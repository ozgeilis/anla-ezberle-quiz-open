// This intentionally does not deploy anything. The generated SQL contains
// correct answers; the operator must keep it OUTSIDE the Expo repository.
import { writeFile } from "node:fs/promises";
import { isAbsolute, relative, resolve, sep } from "node:path";
import {
  buildOnlineContentRows,
  buildOnlineSeedSql,
} from "./online-content-export";

async function main() {
  const args = process.argv.slice(2);
  const outFlag = args.indexOf("--out");
  const destination = outFlag < 0 ? "" : (args[outFlag + 1] ?? "");
  if (args.length !== 2 || outFlag !== 0 || !isAbsolute(destination)) {
    throw new Error(
      "Usage: pnpm export:online-content --out /absolute/private/path/v72-seed.sql",
    );
  }
  const path = resolve(destination);
  const rel = relative(process.cwd(), path);
  if (!(rel === ".." || rel.startsWith(".." + sep)) || !path.endsWith(".sql")) {
    throw new Error("Refusing to save private answer keys inside the project");
  }
  const rows = buildOnlineContentRows();
  await writeFile(path, buildOnlineSeedSql(rows), { flag: "wx", mode: 0o600 });
  console.log(
    `Created private v72 staging SQL for ${rows.length} questions (0600, new file only).`,
  );
  console.log(
    "The online content switch is unchanged; no database changes were made.",
  );
}

void main().catch(() => {
  // Filesystem errors can contain the private destination. Do not log them.
  console.error(
    "Private content export failed. Check content gates, an external .sql destination, permissions and absence of an existing file.",
  );
  process.exitCode = 1;
});
