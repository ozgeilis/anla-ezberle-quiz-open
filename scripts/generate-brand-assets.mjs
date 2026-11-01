// Keep the existing developer entry point; the approved PNG is now the only source.
import { spawnSync } from "node:child_process";
const result = spawnSync(
  process.env.PYTHON ?? "python3",
  [
    new URL("./generate-brand-assets.py", import.meta.url).pathname,
    ...process.argv.slice(2),
  ],
  { stdio: "inherit" },
);
if (result.error) throw result.error;
process.exit(result.status ?? 1);
