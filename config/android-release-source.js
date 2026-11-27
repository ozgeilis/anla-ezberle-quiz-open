// Reproducible worker-side gate: EAS archives need not contain .git. Excluding
// the acceptance record avoids a self-referential commit/hash requirement.
const { createHash } = require("node:crypto");
const { readdirSync, readFileSync } = require("node:fs");
const { join } = require("node:path");
function androidReleaseSourceHash(root = ".") {
  const hash = createHash("sha256");
  function visit(relative) {
    if (relative === "config/android-production-approval.json") return;
    hash
      .update(relative + "\0")
      .update(readFileSync(join(root, relative)))
      .update("\0");
  }
  function walk(relative) {
    for (const item of readdirSync(join(root, relative), {
      withFileTypes: true,
    }).sort((a, b) => a.name.localeCompare(b.name, "en"))) {
      const next = relative + "/" + item.name;
      if (item.isDirectory()) walk(next);
      else if (item.isFile()) visit(next);
      else throw Error("Unexpected release source symlink");
    }
  }
  for (const path of [
    "app.json",
    "app.config.ts",
    "eas.json",
    "package.json",
    "pnpm-lock.yaml",
    "metro.config.js",
    "tsconfig.json",
  ])
    visit(path);
  for (const path of [
    "src",
    "assets",
    "config",
    "modules",
    "plugins",
    "scripts",
    "public",
  ])
    walk(path);
  return hash.digest("hex");
}
module.exports = { androidReleaseSourceHash };
