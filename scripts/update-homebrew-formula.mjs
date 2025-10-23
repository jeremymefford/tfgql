#!/usr/bin/env node

import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);

function getArg(name, { required = false } = {}) {
  const flag = `--${name}`;
  const index = args.findIndex((arg) => arg === flag || arg.startsWith(`${flag}=`));
  if (index === -1) {
    if (required) {
      throw new Error(`Missing required argument: --${name}`);
    }
    return undefined;
  }

  const value = args[index].includes("=")
    ? args[index].split("=")[1]
    : args[index + 1];

  if (value === undefined || value.startsWith("--")) {
    throw new Error(`Argument --${name} requires a value`);
  }

  return value;
}

const version = getArg("version", { required: true });
const armUrl = getArg("arm-url", { required: true });
const armSha = getArg("arm-sha", { required: true });
const armBinary = getArg("arm-binary", { required: true });
const x64Url = getArg("x64-url", { required: true });
const x64Sha = getArg("x64-sha", { required: true });
const x64Binary = getArg("x64-binary", { required: true });
const outputPathArg = getArg("output");

const templatePath = path.resolve(__dirname, "../pkg/homebrew/tfgql.rb.tmpl");
const template = await readFile(templatePath, "utf8");

const rendered = template
  .replace(/{{VERSION}}/g, version)
  .replace(/{{ARM64_URL}}/g, armUrl)
  .replace(/{{ARM64_SHA}}/g, armSha)
  .replace(/{{ARM64_BINARY}}/g, armBinary)
  .replace(/{{X64_URL}}/g, x64Url)
  .replace(/{{X64_SHA}}/g, x64Sha)
  .replace(/{{X64_BINARY}}/g, x64Binary);

const outputPath = outputPathArg
  ? path.resolve(outputPathArg)
  : path.resolve(__dirname, "../pkg/homebrew/tfgql.rb");

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${rendered.trim()}\n`, "utf8");

console.log(`Homebrew formula written to ${outputPath}`);
