// Verify a real simulator .app. This is not a distribution archive/signing test.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { createHash } from "node:crypto";
import { verifyNativeClientConfig } from "./verify-native-client-config.mjs";
import { verifyIosAds } from "./verify-ios-ads.mjs";
const [appArgument, output] = process.argv.slice(2);
assert(
  appArgument,
  "Usage: node scripts/verify-ios-simulator.mjs /absolute/App.app [evidence.json]",
);
const app = resolve(appArgument);
const plist = JSON.parse(
  execFileSync(
    "plutil",
    ["-convert", "json", "-o", "-", join(app, "Info.plist")],
    { encoding: "utf8" },
  ),
);
assert.equal(plist.DTPlatformName, "iphonesimulator");
assert.equal(
  plist.CFBundleIdentifier,
  "com.kovynelstudio.anlaezberle",
  "Acceptance must use the registered permanent Bundle ID",
);
assert.deepEqual([...plist.UIDeviceFamily].sort(), [1, 2]);
assert(
  plist.CFBundleURLTypes.some((entry) =>
    entry.CFBundleURLSchemes.includes("anla-ezberle-quiz"),
  ),
);
assert(
  typeof plist.NSUserTrackingUsageDescription === "string",
  "Advertising acceptance requires the ATT explanation",
);
assert(
  !plist.NSMicrophoneUsageDescription,
  "Quiz must not ask to record audio",
);
assert(!(plist.UIBackgroundModes ?? []).includes("audio"));
assert(
  existsSync(join(app, "main.jsbundle")),
  "Release must contain an offline JS bundle",
);
const privacy = [];
function visit(directory) {
  for (const file of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, file.name);
    if (file.isDirectory()) visit(path);
    else if (file.name === "PrivacyInfo.xcprivacy") {
      const data = JSON.parse(
        execFileSync("plutil", ["-convert", "json", "-o", "-", path], {
          encoding: "utf8",
        }),
      );
      privacy.push({
        path: path.slice(app.length + 1),
        tracking: data.NSPrivacyTracking ?? null,
        accessedApiCategories: (data.NSPrivacyAccessedAPITypes ?? []).map(
          (v) => ({
            category: v.NSPrivacyAccessedAPIType,
            reasons: v.NSPrivacyAccessedAPITypeReasons,
          }),
        ),
        collectedTypes: (data.NSPrivacyCollectedDataTypes ?? []).map((v) => ({
          type: v.NSPrivacyCollectedDataType,
          linked: v.NSPrivacyCollectedDataTypeLinked,
          tracking: v.NSPrivacyCollectedDataTypeTracking,
          purposes: v.NSPrivacyCollectedDataTypePurposes,
        })),
      });
    }
  }
}
visit(app);
assert(privacy.length > 0, "Expected bundled SDK privacy manifests");
const pods = readFileSync("ios/Podfile.lock", "utf8");
assert(pods.includes("ExpoAppleAuthentication (58.0.2)"));
assert(pods.includes("Google-Mobile-Ads-SDK"));
assert(pods.includes("GoogleUserMessagingPlatform"));
assert(pods.includes("RNGoogleMobileAds"));
const evidence = {
  kind: "unsigned-ios-simulator-release",
  bundleIdentifier: plist.CFBundleIdentifier,
  version: plist.CFBundleShortVersionString,
  buildNumber: plist.CFBundleVersion,
  minimumOS: plist.MinimumOSVersion,
  deviceFamily: plist.UIDeviceFamily,
  sdk: plist.DTSDKName,
  jsBundleSha256: createHash("sha256")
    .update(readFileSync(join(app, "main.jsbundle")))
    .digest("hex"),
  appleNativePod: "58.0.2",
  adsMode: "test (native advertising acceptance; not revenue evidence)",
  ...verifyIosAds(app, plist, { appId: process.env.ADMOB_IOS_APP_ID, mode: "test" }),
  ...verifyNativeClientConfig(readFileSync(join(app, "main.jsbundle")), {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL,
    key: process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  }),
  privacyManifests: privacy,
  ipaProduced: false,
  signingValidated: false,
  physicalDeviceTested: false,
};
if (output) writeFileSync(output, JSON.stringify(evidence, null, 2) + "\n");
console.log(JSON.stringify(evidence, null, 2));
