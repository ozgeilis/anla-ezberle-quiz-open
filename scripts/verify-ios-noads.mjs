// Inspect the final .app, not merely an environment flag or JS preference.
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

const sdkResource =
  /(?:^|\/)(?:GoogleMobileAds|GoogleUserMessagingPlatform|UserMessagingPlatform|RNGoogleMobileAds)[^/]*(?:\/|$)/i;
const sdkSymbols = [
  "GADMobileAds",
  "UMPConsentInformation",
  "RNGoogleMobileAds",
  "NativeGoogleMobileAdsModule",
];

export function validateNoIosAds({ plist, paths, binary, bundle }) {
  for (const key of [
    "GADApplicationIdentifier",
    "GADDelayAppMeasurementInit",
    "NSUserTrackingUsageDescription",
    "SKAdNetworkItems",
  ])
    assert.equal(
      plist[key],
      undefined,
      `Unexpected advertising plist key: ${key}`,
    );
  assert(
    !paths.some((path) => sdkResource.test(path)),
    "Advertising SDK resource remains",
  );
  for (const marker of sdkSymbols) {
    assert(
      !binary.includes(marker),
      `Advertising native code remains: ${marker}`,
    );
    assert(
      !bundle.includes(marker),
      `Advertising JS module remains: ${marker}`,
    );
  }
  return {
    advertisingSdkResourcesAbsent: true,
    advertisingNativeMarkersAbsent: true,
    advertisingJsMarkersAbsent: true,
    trackingPromptAbsent: true,
    // Static exclusion is stronger than a disabled flag, but is not a traffic test.
    runtimeNetworkTested: false,
  };
}

export function verifyNoIosAds(app, plist) {
  const paths = [];
  function walk(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      paths.push(relative(app, path));
      if (entry.isDirectory()) walk(path);
    }
  }
  walk(app);
  return validateNoIosAds({
    plist,
    paths,
    binary: readFileSync(join(app, plist.CFBundleExecutable)),
    bundle: readFileSync(join(app, "main.jsbundle")),
  });
}
