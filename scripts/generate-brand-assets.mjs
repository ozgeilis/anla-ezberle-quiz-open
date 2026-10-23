// Vector-derived assets. SHARP_MODULE may point at an existing developer tool installation.
// This script is not imported by the app and never modifies the original icon.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { Buffer } from "node:buffer";
const require = createRequire(import.meta.url);
const sharp = require(process.env.SHARP_MODULE ?? "sharp");
const original = await readFile(
  new URL("../assets/icons/app-icon.svg", import.meta.url),
  "utf8",
);
const foreground = original
  .replace(/  <rect width="1024" height="1024"[^\n]+\n/, "")
  .replace(/  <rect x="160"[^\n]+\n/, "")
  .replace(/(<\/defs>)/, '$1<g transform="translate(92.16 92.16) scale(.82)">')
  .replace("</svg>", "</g></svg>");
for (const name of ["adaptive-foreground", "splash-mark"]) {
  await writeFile(
    new URL(`../assets/icons/${name}.svg`, import.meta.url),
    foreground,
  );
  await sharp(Buffer.from(foreground))
    .resize(1024, 1024)
    .png()
    .toFile(new URL(`../assets/images/${name}.png`, import.meta.url).pathname);
}
const store = original.replace('rx="220" ', "");
await mkdir(new URL("../store/google-play/", import.meta.url), {
  recursive: true,
});
await sharp(Buffer.from(store))
  .resize(512, 512)
  .png()
  .toFile(
    new URL("../store/google-play/icon-512.png", import.meta.url).pathname,
  );
console.log(
  "Generated 2 transparent 1024 px brand marks and the full-bleed 512 px store icon. Original icon unchanged.",
);
