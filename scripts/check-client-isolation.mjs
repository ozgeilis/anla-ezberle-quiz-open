// Checks actual export bytes against private local credentials without printing
// their values. Run after export; this is not a mock of Metro's resolver rules.
import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { readFile, readdir } from "node:fs/promises";
import { homedir } from "node:os";
import { resolve, join } from "node:path";

const refIndex = process.argv.indexOf("--project-ref");
const ref = process.argv[refIndex + 1];
const directories = process.argv.slice(2, refIndex);
assert(
  refIndex > 2 && /^[a-z]{20}$/.test(ref ?? ""),
  "Provide export directories followed by --project-ref",
);
const privateDir = resolve(homedir(), ".local", "share", "anla-quiz-dev", ref);
const env = await readFile(join(privateDir, "server.env"), "utf8");
const key = env.match(/^SUPABASE_SERVICE_ROLE_KEY=(.+)$/m)?.[1];
assert(
  key?.startsWith("sb_secret_"),
  "Private server key required for isolation check",
);
const secrets = new Set([key]);
function collect(value) {
  if (!value || typeof value !== "object") return;
  for (const [name, child] of Object.entries(value)) {
    if (
      ["password", "jwt", "refresh"].includes(name) &&
      typeof child === "string" &&
      child.length > 8
    )
      secrets.add(child);
    else if (typeof child === "object") collect(child);
  }
}
collect(JSON.parse(await readFile(join(privateDir, "testers.json"), "utf8")));
try {
  collect(
    JSON.parse(
      await readFile(join(privateDir, "browser-fixtures.json"), "utf8"),
    ),
  );
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
let files = 0;
async function inspect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await inspect(path);
    else if (entry.isFile()) {
      const bytes = await readFile(path);
      for (const secret of secrets)
        assert(
          !bytes.includes(Buffer.from(secret)),
          "Private credential found in client export; values suppressed",
        );
      files++;
    }
  }
}
for (const directory of directories) await inspect(resolve(directory));
assert(files > 0);
console.log(
  JSON.stringify({
    clientFilesChecked: files,
    privateValuesChecked: secrets.size,
    privateCredentialsFound: false,
  }),
);
