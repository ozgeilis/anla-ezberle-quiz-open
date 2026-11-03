import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import test from "node:test";
import { validateNoIosAds } from "../scripts/verify-ios-noads.mjs";

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
