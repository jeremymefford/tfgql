import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Multi-mode static asset loader for SEA binary, ncc bundle, and dev environments.
 *
 * Resolution order:
 *  1. SEA embedded asset (node:sea getAsset)
 *  2. Filesystem relative to __dirname (ncc bundle with copied assets)
 *  3. Dev-mode fallback path (e.g. node_modules)
 */

let seaGetAsset: ((key: string) => ArrayBuffer) | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const sea = require("node:sea") as {
    isSea(): boolean;
    getAsset(key: string): ArrayBuffer;
  };
  if (sea.isSea()) {
    seaGetAsset = sea.getAsset.bind(sea);
  }
} catch {
  // Not running as a Single Executable Application
}

const cache = new Map<string, Buffer>();

/**
 * Load a static asset using a three-tier fallback chain.
 *
 * @param bundleRelPath  Path relative to the bundle root (e.g. "graphiql-assets/graphiql.min.css")
 * @param devFallbackPath  Absolute path used in dev mode (e.g. from node_modules)
 */
export async function loadBundledAsset(
  bundleRelPath: string,
  devFallbackPath: string,
): Promise<Buffer> {
  const cached = cache.get(bundleRelPath);
  if (cached) return cached;

  let data: Buffer;

  if (seaGetAsset) {
    // SEA mode: retrieve from embedded asset blob
    const raw = seaGetAsset(`bundle/${bundleRelPath}`);
    data = Buffer.from(
      raw instanceof ArrayBuffer ? new Uint8Array(raw) : raw,
    );
  } else {
    try {
      // Bundle mode: read from filesystem relative to this module
      data = await readFile(path.join(__dirname, bundleRelPath));
    } catch {
      // Dev mode: read from the dev fallback path
      data = await readFile(devFallbackPath);
    }
  }

  cache.set(bundleRelPath, data);
  return data;
}
