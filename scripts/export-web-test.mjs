// Public web bundle only. Server/SMTP credentials must never become Expo variables.
import {
  readFileSync,
  readdirSync,
  mkdirSync,
  copyFileSync,
  writeFileSync,
  existsSync,
} from "node:fs";
import { basename, join } from "node:path";
import { spawnSync } from "node:child_process";

const names = [
  "EXPO_PUBLIC_SUPABASE_URL",
  "EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
];
const publicValues = Object.fromEntries(names.map((n) => [n, process.env[n]]));
for (const path of [".env.local", ".env"]) {
  let text;
  try {
    text = readFileSync(path, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") continue;
    throw error;
  }
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\s*(EXPO_PUBLIC_[A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!match) continue;
    const [, name, raw] = match;
    if (![...names, "EXPO_PUBLIC_CONTENT_CHANNEL"].includes(name))
      throw new Error("Unexpected Expo public variable; value withheld");
    if (names.includes(name) && !publicValues[name])
      publicValues[name] = raw.replace(/^(["'])(.*)\1$/, "$2");
  }
}
for (const name of Object.keys(process.env))
  if (
    name.startsWith("EXPO_PUBLIC_") &&
    ![...names, "EXPO_PUBLIC_CONTENT_CHANNEL"].includes(name)
  )
    throw new Error("Unexpected Expo public variable; value withheld");
if (
  publicValues.EXPO_PUBLIC_SUPABASE_URL !==
    "https://mqyuihiobkomjfipxehj.supabase.co" ||
  !publicValues.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.startsWith(
    "sb_publishable_",
  )
)
  throw new Error("Frankfurt URL and publishable client key required");

const result = spawnSync(
  "pnpm",
  ["exec", "expo", "export", "--platform", "web", "--max-workers", "2"],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      ...publicValues,
      EXPO_NO_DOTENV: "1",
      EXPO_PUBLIC_CONTENT_CHANNEL: "production",
    },
  },
);
if (result.error) throw new Error("Web export could not start");
process.exitCode = result.status ?? 1;
if (result.status === 0) {
  const topicManifest = spawnSync(
    process.execPath,
    ["--import", "tsx", "scripts/export-topic-manifest.ts"],
    { stdio: "inherit" },
  );
  if (topicManifest.error || topicManifest.status !== 0)
    throw new Error("Public topic count manifest could not be generated");
  // Vercel's source upload ignores nested node_modules/.pnpm directories.
  // Keep Expo's URLs and bundle hashes unchanged: serve exported font/image
  // bytes from a public directory through the matching Vercel rewrite.
  const manifest = [];
  mkdirSync("dist/web-assets", { recursive: true });
  const visit = (directory) => {
    if (!existsSync(directory)) return;
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isSymbolicLink())
        throw new Error("Unexpected exported asset link");
      if (entry.isDirectory()) visit(path);
      else {
        const target = join("dist/web-assets", basename(path));
        if (
          existsSync(target) &&
          !readFileSync(target).equals(readFileSync(path))
        )
          throw new Error("Exported asset filename collision");
        copyFileSync(path, target);
        manifest.push({
          path: "/" + path.slice("dist/".length),
          destination: "/web-assets/" + basename(path),
        });
      }
    }
  };
  visit("dist/assets/node_modules");
  if (manifest.filter((a) => a.path.endsWith(".ttf")).length !== 6)
    throw new Error("Expected five Manrope fonts and Feather icons");
  writeFileSync("dist/web-assets.json", JSON.stringify(manifest));
  mkdirSync("dist/licenses", { recursive: true });
  for (const file of readdirSync("docs/licenses"))
    copyFileSync(join("docs/licenses", file), join("dist/licenses", file));
  console.log(
    `Prepared ${manifest.length} public font/image assets for hosting`,
  );
}
