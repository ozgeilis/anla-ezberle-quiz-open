// Build-time guard only. Does not alter app identity, preferences or server data.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import iosApproval from "../config/ios-approval.js";

const profile = process.env.EAS_BUILD_PROFILE;
const android = process.env.EAS_BUILD_PLATFORM === "android";
const ios = process.env.EAS_BUILD_PLATFORM === "ios";
assert(
  !(android && profile?.startsWith("ios-")),
  "iOS-only profile cannot build Android",
);
assert(
  !(
    process.env.EAS_BUILD_PLATFORM === "ios" &&
    ["production", "ads-closed-test"].includes(profile)
  ),
  "Use the separately gated ios-testflight profile for iOS store distribution",
);
const storeProfiles = ["production", "ads-closed-test"];
if (
  (android && ["preview", "ads-preview", ...storeProfiles].includes(profile)) ||
  (ios &&
    ["ios-development", "ios-simulator-acceptance", "ios-testflight"].includes(
      profile,
    ))
) {
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
if (android && storeProfiles.includes(profile)) {
  const { expo } = JSON.parse(readFileSync("app.json", "utf8"));
  const approval = JSON.parse(
    readFileSync("config/android-store-approval.json", "utf8"),
  );
  assert(
    approval.approved === true &&
      approval.packageApproved === true &&
      approval.packageId === expo.android.package &&
      approval.approvedProfile === profile &&
      /^[a-f0-9]{64}$/.test(approval.acceptedApkSha256 ?? ""),
    "Store AAB blocked: owner must approve permanent package ID, this exact build profile and APK acceptance evidence (config/android-store-approval.json).",
  );
}
if (process.env.EAS_BUILD_PLATFORM === "ios" && profile === "ios-development") {
  const identity = JSON.parse(
    readFileSync("config/ios-store-approval.json", "utf8"),
  );
  assert(
    identity.developmentBuildApproved === true &&
      identity.appleTeamVerified === true &&
      identity.registeredBundleId === "com.kovynelstudio.anlaezberle" &&
      identity.registeredBundleId === process.env.IOS_REGISTERED_BUNDLE_ID,
    "Registered iOS development build requires separate owner approval, verified App ID and Team; old development profiles remain unchanged.",
  );
}
if (process.env.EAS_BUILD_PLATFORM === "ios" && profile === "ios-testflight") {
  const approval = JSON.parse(
    readFileSync("config/ios-store-approval.json", "utf8"),
  );
  if (process.env.IOS_PUBLIC_BETA_CANDIDATE === "1") {
    iosApproval.validatePublicBetaCandidate(
      approval,
      JSON.parse(readFileSync("config/ios-public-beta-export.json", "utf8")),
      execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(),
      process.env,
    );
  } else if (process.env.IOS_TESTFLIGHT_UPLOAD_ONLY === "1") {
    iosApproval.validateTestflightUpload(
      approval,
      JSON.parse(readFileSync("config/ios-testflight-export.json", "utf8")),
      execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(),
      process.env,
    );
  } else
    assert(
      approval.approved === true &&
        approval.appleTeamVerified === true &&
        approval.registeredBundleId === "com.kovynelstudio.anlaezberle" &&
        process.env.IOS_REGISTERED_BUNDLE_ID === approval.registeredBundleId &&
        approval.physicalAcceptance === true &&
        approval.appleAuthAndDeletionAccepted === true &&
        approval.reviewReadinessAccepted === true,
      "TestFlight build blocked: owner approval, registered identity, device/Auth/deletion and review acceptance required.",
    );
}
console.log("EAS build prerequisites passed; no credentials printed.");
