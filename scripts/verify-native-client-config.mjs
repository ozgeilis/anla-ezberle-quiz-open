// Inspect the final embedded bundle, including manually exported candidates.
// EAS pre-install alone cannot protect bundles produced outside EAS.
import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export function verifyNativeClientConfig(bundle, expected) {
  assert(Buffer.isBuffer(bundle) && bundle.length > 0, "Native bundle missing");
  assert.equal(
    expected.url,
    "https://mqyuihiobkomjfipxehj.supabase.co",
    "Expected Frankfurt client endpoint; values withheld",
  );
  assert(
    /^sb_publishable_[A-Za-z0-9_-]+$/.test(expected.key ?? ""),
    "Enabled publishable client key required; no administrator credentials",
  );
  assert(
    bundle.includes(Buffer.from(expected.url)),
    "Embedded client endpoint is missing or mismatched",
  );
  assert(
    bundle.includes(Buffer.from(expected.key)),
    "Embedded publishable client key is missing or mismatched",
  );
  return {
    embeddedClientConfigVerified: true,
    bundleSha256: createHash("sha256").update(bundle).digest("hex"),
    // Presence is necessary, but does not prove an Auth/network/session flow.
    runtimeLoginVerified: false,
  };
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  assert(
    process.argv[2],
    "Usage: node scripts/verify-native-client-config.mjs /absolute/main.jsbundle",
  );
  const evidence = verifyNativeClientConfig(
    readFileSync(resolve(process.argv[2])),
    {
      url: process.env.EXPO_PUBLIC_SUPABASE_URL,
      key: process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    },
  );
  console.log(JSON.stringify(evidence, null, 2));
}
