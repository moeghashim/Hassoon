import { createRequire } from "node:module";

declare const __HASSOON_VERSION__: string | undefined;

function readVersionFromPackageJson(): string | null {
  try {
    const require = createRequire(import.meta.url);
    const pkg = require("../package.json") as { version?: string };
    return pkg.version ?? null;
  } catch {
    return null;
  }
}

// Single source of truth for the current hassoon version.
// - Embedded/bundled builds: injected define or env var.
// - Dev/npm builds: package.json.
export const VERSION =
  (typeof __HASSOON_VERSION__ === "string" && __HASSOON_VERSION__) ||
  process.env.HASSOON_BUNDLED_VERSION ||
  readVersionFromPackageJson() ||
  "0.0.0";
