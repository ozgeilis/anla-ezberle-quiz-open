import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import createConfig from "../app.config";
import { validateNoIosAds } from "../scripts/verify-ios-noads.mjs";

const require = createRequire(import.meta.url);

test("the native ad dependency is excluded only on iOS", () => {
  const config = require("../react-native.config.js");
  assert.deepEqual(
    config.dependencies["react-native-google-mobile-ads"].platforms,
    { ios: null },
  );
  const runtime = readFileSync("src/features/ads/runtime.ios.tsx", "utf8");
  assert(!runtime.includes("react-native-google-mobile-ads"));
  assert(runtime.includes("throw Error"));
});

test("Expo excludes the ad plugin on iOS and preserves Android configuration", () => {
  const context = {
    config: { name: "Fixture", slug: "fixture", plugins: ["expo-router"] },
    projectRoot: process.cwd(),
    staticConfigPath: null,
    packageJsonPath: "package.json",
  };
  const prior = process.env.EAS_BUILD_PLATFORM;
  try {
    process.env.EAS_BUILD_PLATFORM = "ios";
    const ios = createConfig(context);
    assert(
      !ios.plugins?.some(
        (p) => Array.isArray(p) && p[0] === "react-native-google-mobile-ads",
      ),
    );
    process.env.EAS_BUILD_PLATFORM = "android";
    const android = createConfig(context);
    assert(
      android.plugins?.some(
        (p) => Array.isArray(p) && p[0] === "react-native-google-mobile-ads",
      ),
    );
    assert(
      android.android?.blockedPermissions?.includes(
        "com.google.android.gms.permission.AD_ID",
      ),
    );
  } finally {
    if (prior === undefined) delete process.env.EAS_BUILD_PLATFORM;
    else process.env.EAS_BUILD_PLATFORM = prior;
  }
});

const fixture = () => ({
  plist: {} as Record<string, unknown>,
  paths: ["ExpoSecureStore.bundle/PrivacyInfo.xcprivacy"],
  binary: Buffer.from("synthetic native executable"),
  bundle: Buffer.from("synthetic game bundle"),
});
test("advertising exclusion evidence does not invent network acceptance", () => {
  const evidence = validateNoIosAds(fixture());
  assert.equal(evidence.advertisingNativeMarkersAbsent, true);
  assert.equal(evidence.runtimeNetworkTested, false);
});
test("a disabled-ad plist flag cannot pass final SDK exclusion", () => {
  const facts = fixture();
  facts.plist.GADDelayAppMeasurementInit = true;
  assert.throws(() => validateNoIosAds(facts));
});
test("final advertising resources, compiled classes and JS registrations are rejected", () => {
  for (const resource of [
    "GoogleMobileAdsResources.bundle/PrivacyInfo.xcprivacy",
    "UserMessagingPlatformResources.bundle/PrivacyInfo.xcprivacy",
  ]) {
    const facts = fixture();
    facts.paths.push(resource);
    assert.throws(() => validateNoIosAds(facts));
  }
  for (const marker of [
    "GADMobileAds",
    "UMPConsentInformation",
    "RNGoogleMobileAds",
    "NativeGoogleMobileAdsModule",
  ]) {
    for (const key of ["binary", "bundle"] as const) {
      const facts = fixture();
      facts[key] = Buffer.from(marker);
      assert.throws(() => validateNoIosAds(facts));
    }
  }
});
