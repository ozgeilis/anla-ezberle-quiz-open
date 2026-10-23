import { mkdir, writeFile, chmod } from "node:fs/promises";
import { dirname, relative, resolve, isAbsolute, sep } from "node:path";
import { liveContentSql } from "./live-content";
async function main() {
  const file = resolve(process.argv[2] ?? "");
  const rel = relative(process.cwd(), file);
  if (
    !process.argv[2] ||
    (!isAbsolute(rel) && rel !== ".." && !rel.startsWith(`..${sep}`))
  )
    throw new Error("Private output must be outside Expo project");
  await mkdir(dirname(file), { recursive: true, mode: 0o700 });
  await writeFile(file, liveContentSql(), { flag: "wx", mode: 0o600 });
  await chmod(file, 0o600);
  console.log(
    "Private live SQL generated outside project; 600 unchanged published questions. No answer keys printed.",
  );
}
main().catch(() => {
  console.error("Private live export failed; no SQL or answer keys printed.");
  process.exitCode = 1;
});
