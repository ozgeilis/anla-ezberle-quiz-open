import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

const file = process.argv[2];
assert(file, "Pass the generated native Hermes/Metro source map");
const bytes = readFileSync(file);
function collect(map) {
  return [
    ...(map.sources ?? []),
    ...(map.sections ?? []).flatMap((section) => collect(section.map)),
  ];
}
const sources = collect(JSON.parse(bytes)).map((source) =>
  source.replaceAll("\\", "/"),
);
const nativeEntry = sources.some((source) =>
  source.endsWith("/features/ads/runtime.native.tsx"),
);
const webEntry = sources.some((source) =>
  source.endsWith("/features/ads/runtime.web.tsx"),
);
const sdkModules = sources.filter((source) =>
  source.includes("react-native-google-mobile-ads"),
).length;
assert(
  nativeEntry && !webEntry && sdkModules > 0,
  "Native bundle selected a web/fallback ad runtime or omitted GMA",
);
console.log(
  JSON.stringify(
    {
      nativeEntry,
      webEntry,
      sdkModules,
      sourceMapSha256: createHash("sha256").update(bytes).digest("hex"),
    },
    null,
    2,
  ),
);
