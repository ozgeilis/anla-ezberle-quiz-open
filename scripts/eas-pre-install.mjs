// Build-time guard only. Does not alter app identity, preferences or server data.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const profile = process.env.EAS_BUILD_PROFILE;
const android = process.env.EAS_BUILD_PLATFORM === "android";
if (android && ["preview", "production"].includes(profile)) {
  const allowed = new Set([
    "EXPO_PUBLIC_CONTENT_CHANNEL",
    "EXPO_PUBLIC_SUPABASE_URL",
    "EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  ]);
  assert(
    Object.keys(process.env).every(
      (key) => !key.startsWith("EXPO_PUBLIC_") || allowed.has(key),
    ),
    "Unexpected public environment variable; values withheld",
  );
  assert.equal(process.env.EXPO_PUBLIC_CONTENT_CHANNEL, "production");
  assert.equal(
    process.env.EXPO_PUBLIC_SUPABASE_URL,
    "https://mqyuihiobkomjfipxehj.supabase.co",
    "Expected existing Frankfurt client endpoint; values withheld",
  );
  assert(
    process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.startsWith(
      "sb_publishable_",
    ),
    "Publishable client configuration required; no administrator keys",
  );
}
if (android && profile === "production") {
  const { expo } = JSON.parse(readFileSync("app.json", "utf8"));
  const approval = JSON.parse(
    readFileSync("config/android-store-approval.json", "utf8"),
  );
  assert(
    approval.approved === true &&
      approval.packageId === expo.android.package &&
      /^[a-f0-9]{64}$/.test(approval.acceptedApkSha256 ?? ""),
    "Store AAB blocked: owner must approve permanent package ID and accept a physical Android APK first (config/android-store-approval.json).",
  );
}
console.log("EAS build prerequisites passed; no credentials printed.");
