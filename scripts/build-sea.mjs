#!/usr/bin/env node

import { execFileSync, execSync } from "node:child_process";
import {
  access,
  chmod,
  cp,
  mkdir,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import { createWriteStream } from "node:fs";
import https from "node:https";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const buildDir = path.join(rootDir, "build", "sea");
const runtimeDir = path.join(buildDir, "runtime");
const downloadsDir = path.join(buildDir, "downloads");
const outDir = path.join(buildDir, "binaries");
const blobPath = path.join(buildDir, "tfgql.sea");
const rawNodeVersion =
  process.env.NODE_VERSION_OVERRIDE ?? process.version;
const nodeVersion = rawNodeVersion.startsWith("v")
  ? rawNodeVersion
  : `v${rawNodeVersion}`;

if (!nodeVersion || !/^v\d+\.\d+\.\d+/.test(nodeVersion)) {
  console.error(
    `Unable to determine Node.js version (got "${rawNodeVersion ?? "undefined"}").`
  );
  process.exit(1);
}

const targets = [
  {
    os: "darwin",
    arch: "arm64",
    archive: `node-${nodeVersion}-darwin-arm64.tar.gz`,
    binaryPath: `node-${nodeVersion}-darwin-arm64/bin/node`,
    outputName: "tfgql-darwin-arm64",
    postjectArgs: ["--macho-segment-name", "NODE_SEA"],
  },
  {
    os: "darwin",
    arch: "x64",
    archive: `node-${nodeVersion}-darwin-x64.tar.gz`,
    binaryPath: `node-${nodeVersion}-darwin-x64/bin/node`,
    outputName: "tfgql-darwin-x64",
    postjectArgs: ["--macho-segment-name", "NODE_SEA"],
  },
  {
    os: "linux",
    arch: "arm64",
    archive: `node-${nodeVersion}-linux-arm64.tar.xz`,
    binaryPath: `node-${nodeVersion}-linux-arm64/bin/node`,
    outputName: "tfgql-linux-arm64",
    postjectArgs: [],
  },
  {
    os: "linux",
    arch: "x64",
    archive: `node-${nodeVersion}-linux-x64.tar.xz`,
    binaryPath: `node-${nodeVersion}-linux-x64/bin/node`,
    outputName: "tfgql-linux-x64",
    postjectArgs: [],
  },
  {
    os: "win",
    arch: "arm64",
    archive: `node-${nodeVersion}-win-arm64.zip`,
    binaryPath: `node-${nodeVersion}-win-arm64/node.exe`,
    outputName: "tfgql-win-arm64.exe",
    postjectArgs: [],
  },
  {
    os: "win",
    arch: "x64",
    archive: `node-${nodeVersion}-win-x64.zip`,
    binaryPath: `node-${nodeVersion}-win-x64/node.exe`,
    outputName: "tfgql-win-x64.exe",
    postjectArgs: [],
  },
];

const nodeBaseUrl = `https://nodejs.org/dist/${nodeVersion}`;
const nodeBinaryCache = new Map();
const skipPostject = process.env.SKIP_POSTJECT === "1";
const doubleDashIndex = process.argv.indexOf("--");
const rawArgs = doubleDashIndex === -1 ? process.argv.slice(2) : process.argv.slice(doubleDashIndex + 1);
const scopeArgIndex = rawArgs.findIndex((arg) => arg === "--scope" || arg.startsWith("--scope="));
let cliScope;
if (scopeArgIndex !== -1) {
  const arg = rawArgs[scopeArgIndex];
  if (arg.includes("=")) {
    cliScope = arg.split("=")[1];
  } else if (scopeArgIndex + 1 < rawArgs.length) {
    cliScope = rawArgs[scopeArgIndex + 1];
  } else {
    throw new Error("--scope flag requires a value (all, current, linux)");
  }
}
const scope = (cliScope || process.env.SEA_SCOPE || "current").toLowerCase();
const targetFilter = process.env.SEA_TARGETS
  ? process.env.SEA_TARGETS.split(",")
      .map((entry) => entry.trim())
      .filter(Boolean)
  : null;
const normalizedFilter = targetFilter
  ? targetFilter.map((entry) => (entry === "linux-amd64" ? "linux-x64" : entry))
  : null;

function selectTargetsByScope() {
  if (normalizedFilter && normalizedFilter.length > 0) {
    return targets.filter((target) => normalizedFilter.includes(`${target.os}-${target.arch}`));
  }

  switch (scope) {
    case "current": {
      const platformMap = { darwin: "darwin", linux: "linux", win32: "win" };
      const archMap = { x64: "x64", arm64: "arm64" };
      const os = platformMap[process.platform];
      const arch = archMap[process.arch];
      if (!os || !arch) {
        throw new Error(`Unsupported host platform/arch for scope=current: ${process.platform}/${process.arch}`);
      }
      return targets.filter((target) => target.os === os && target.arch === arch);
    }
    case "linux": {
      const archs = new Set(["linux-arm64", "linux-amd64", "linux-x64"]); // accept either naming
      if (targetFilter && targetFilter.length > 0) {
        return targets.filter((target) => target.os === "linux");
      }
      return targets.filter((target) => target.os === "linux");
    }
    case "all": {
      return targets;
    }
    default:
      throw new Error(`Unknown scope "${scope}". Use one of: all, current, linux.`);
  }
}

const targetsToBuild = selectTargetsByScope();

if (targetsToBuild.length === 0) {
  throw new Error(
    `SEA target selection produced no matches (scope=${scope}, filter=${normalizedFilter?.join(",") ?? "<none>"})`,
  );
}

function log(message) {
  process.stdout.write(`${message}\n`);
}

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

async function download(url, destination) {
  if (await exists(destination)) {
    return;
  }
  await mkdir(path.dirname(destination), { recursive: true });
  log(`Downloading ${url}`);
  await new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        request.destroy();
        download(response.headers.location, destination)
          .then(resolve)
          .catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        reject(
          new Error(
            `Download failed for ${url} (status ${response.statusCode})`
          )
        );
        return;
      }
      const file = createWriteStream(destination);
      pipeline(response, file).then(resolve, reject);
    });
    request.on("error", reject);
  });
}

function run(command, options = {}) {
  execSync(command, { stdio: "inherit", ...options });
}

function commandExists(command) {
  try {
    execSync(`command -v ${command}`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

async function prepareBuildDirs() {
  await rm(buildDir, { recursive: true, force: true });
  await mkdir(buildDir, { recursive: true });
  await mkdir(runtimeDir, { recursive: true });
  await mkdir(downloadsDir, { recursive: true });
  await mkdir(outDir, { recursive: true });
}

async function buildBundle() {
  const bundleDir = path.join(buildDir, "bundle");
  await rm(bundleDir, { recursive: true, force: true });
  log("Bundling application with @vercel/ncc");
  run(
    `npx --yes @vercel/ncc build dist/index.js -o ${JSON.stringify(bundleDir)} --no-source-map-register`,
    { cwd: rootDir }
  );
  return bundleDir;
}

async function prepareRuntime() {
  log("Compiling TypeScript sources");
  run("npm run compile", { cwd: rootDir });

  const bundleDir = await buildBundle();

  log("Preparing SEA runtime directory");
  await copyFile(path.join(rootDir, "package.json"), path.join(runtimeDir, "package.json"));
  const lockPath = path.join(rootDir, "package-lock.json");
  if (await exists(lockPath)) {
    await copyFile(lockPath, path.join(runtimeDir, "package-lock.json"));
  }

  log("Copying bundled output");
  await cp(bundleDir, path.join(runtimeDir, "bundle"), { recursive: true });

  const entryPointPath = path.join(runtimeDir, "sea-entry.js");
  const entrySource = [
    'const { createRequire } = require("node:module");',
    'const path = require("node:path");',
    'const { startupSnapshot } = require("node:v8");',
    'const requireFromEntry = createRequire(__filename);',
    'const entryPoint = () => {',
    '  requireFromEntry(path.resolve(__dirname, "bundle/index.js"));',
    "};",
    "startupSnapshot.setDeserializeMainFunction(entryPoint);",
    "const isSeaRuntime = process.execPath === __filename;",
    'if (process.env.NODE_SEA_BUILD !== \"1\" && !isSeaRuntime) {',
    "  entryPoint();",
    "}",
    "",
  ].join("\n");
  await writeFile(entryPointPath, entrySource);

  const assets = {
    "sea-entry.js": "sea-entry.js",
    "package.json": "package.json",
  };
  for (const relPath of await collectAssetPaths("bundle")) {
    assets[relPath] = relPath;
  }

  const seaConfig = {
    main: "./sea-entry.js",
    output: "../tfgql.sea",
    useSnapshot: true,
    assets,
  };
  const configPath = path.join(runtimeDir, "sea-config.json");
  await writeFile(configPath, `${JSON.stringify(seaConfig, null, 2)}\n`);

  log("Generating SEA blob");
  execFileSync(process.execPath, ["--experimental-sea-config", "sea-config.json"], {
    cwd: runtimeDir,
    env: { ...process.env, NODE_SEA_BUILD: "1", TFGQL_SKIP_AUTOSTART: "1" },
    stdio: "inherit",
  });
}

async function extractArchive(archivePath, destination, archiveName) {
  await mkdir(destination, { recursive: true });
  if (archiveName.endsWith(".tar.gz")) {
    run(`tar -xzf ${JSON.stringify(archivePath)} -C ${JSON.stringify(destination)}`);
  } else if (archiveName.endsWith(".tar.xz")) {
    run(`tar -xJf ${JSON.stringify(archivePath)} -C ${JSON.stringify(destination)}`);
  } else if (archiveName.endsWith(".zip")) {
    run(`unzip -q ${JSON.stringify(archivePath)} -d ${JSON.stringify(destination)}`);
  } else {
    throw new Error(`Unsupported archive type for ${archiveName}`);
  }
}

async function buildTarget(target) {
  const binarySource = await ensureNodeBinary(target);
  const binaryOutput = path.join(
    outDir,
    target.outputName
  );

  await copyFile(binarySource, binaryOutput);
  if (target.os === "darwin") {
    if (commandExists("codesign")) {
      run(`codesign --remove-signature ${JSON.stringify(binaryOutput)}`);
    } else {
      log("codesign not available; skipping signature removal for macOS binary");
    }
  }
  if (target.os !== "win") {
    await chmod(binaryOutput, 0o755);
  }

  if (skipPostject) {
    log(`Skipping postject for ${target.outputName}; blob available at ${blobPath}`);
    return;
  }

  const postjectArgs = [
    "--yes",
    "postject@1.0.0-alpha.6",
    binaryOutput,
    "NODE_SEA_BLOB",
    blobPath,
    "--sentinel-fuse",
    "NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2",
    ...target.postjectArgs,
  ];
  log(`Embedding SEA blob into ${target.outputName}`);
  execFileSync("npx", postjectArgs, { stdio: "inherit" });
  log(`Built ${binaryOutput}`);

  if (target.os === "darwin") {
    if (commandExists("codesign")) {
      run(`codesign --sign - --force --deep ${JSON.stringify(binaryOutput)}`);
    } else {
      log("codesign not available; produced macOS binary is unsigned");
    }
  }
}

async function collectAssetPaths(relativeDir) {
  const start = path.join(runtimeDir, relativeDir);
  if (!(await exists(start))) {
    return [];
  }
  const results = [];
  async function walk(currentRel) {
    const dirPath = path.join(runtimeDir, currentRel);
    const entries = await readdir(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const entryRel = path.join(currentRel, entry.name);
      if (entry.isDirectory()) {
        await walk(entryRel);
      } else if (entry.isFile() || entry.isSymbolicLink()) {
        results.push(entryRel.split(path.sep).join("/"));
      }
    }
  }
  await walk(relativeDir);
  return results;
}

async function ensureNodeBinary(target) {
  const cacheKey = `${target.os}-${target.arch}`;
  if (nodeBinaryCache.has(cacheKey)) {
    return nodeBinaryCache.get(cacheKey);
  }
  const archivePath = path.join(downloadsDir, target.archive);
  if (!(await exists(archivePath))) {
    await download(`${nodeBaseUrl}/${target.archive}`, archivePath);
  }
  const archiveRoot = target.binaryPath.split("/")[0];
  const binaryPath = path.join(downloadsDir, target.binaryPath);
  if (!(await exists(binaryPath))) {
    await rm(path.join(downloadsDir, archiveRoot), { recursive: true, force: true });
    await extractArchive(archivePath, downloadsDir, target.archive);
  }
  nodeBinaryCache.set(cacheKey, binaryPath);
  return binaryPath;
}

async function copyFile(source, destination) {
  await mkdir(path.dirname(destination), { recursive: true });
  await cp(source, destination, { recursive: true });
}

async function main() {
  log(`Building SEA binaries using Node.js ${nodeVersion}`);
  log(
    `Target scope: ${scope} -> ${targetsToBuild
      .map((t) => `${t.os}-${t.arch}`)
      .join(", ")}`,
  );
  await prepareBuildDirs();
  await prepareRuntime();

  for (const target of targetsToBuild) {
    await buildTarget(target);
  }

  log(`SEA binaries available in ${outDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
