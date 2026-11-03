import assert from "node:assert/strict";
import test from "node:test";
import { resolveAdBuild, googleSampleApps } from "../config/admob.js";
import { resolveRuntimeAds } from "../src/features/ads/runtimeConfig";
import { authorizeTracking } from "../src/features/ads/trackingPolicy";
import { authorizeAdConsent } from "../src/features/ads/consentAuthorization";
import { withAdRequestTimeout } from "../src/features/ads/requestTimeout";
import { validateIosAds } from "../scripts/verify-ios-ads.mjs";
import { readFileSync } from "node:fs";
import { Buffer } from "node:buffer";

const revenue = {
  EAS_BUILD_PLATFORM: "ios",
  EAS_BUILD_PROFILE: "ios-testflight",
  IOS_ADS_MODE: "live",
  ADMOB_IOS_APP_ID: "ca-app-pub-1111111111111111~1111111111",
  ADMOB_IOS_BANNER_ID: "ca-app-pub-1111111111111111/2222222222",
  ADMOB_IOS_INTERSTITIAL_ID: "ca-app-pub-1111111111111111/3333333333",
};
test("iOS revenue needs separate registered app and both matching distinct units", () => {
  const build = resolveAdBuild(revenue);
  assert.equal(build.mode, "live");
  assert.equal(build.realAdsEnabled, true);
  assert.equal(resolveRuntimeAds("ios", build, false).enabled, true);
  for (const change of [
    { ADMOB_IOS_APP_ID: undefined },
    { ADMOB_IOS_APP_ID: googleSampleApps.ios },
    { ADMOB_IOS_BANNER_ID: undefined },
    { ADMOB_IOS_INTERSTITIAL_ID: "ca-app-pub-2222222222222222/3333333333" },
    { ADMOB_IOS_INTERSTITIAL_ID: revenue.ADMOB_IOS_BANNER_ID },
    { ADMOB_ANDROID_APP_ID: revenue.ADMOB_IOS_APP_ID },
  ])
    assert.throws(() => resolveAdBuild({ ...revenue, ...change }));
});
test("native iPhone QA always uses test units even with publisher units in its environment", () => {
  const build = resolveAdBuild({ ...revenue, IOS_ADS_MODE: "test" });
  const runtime = resolveRuntimeAds("ios", build, true);
  assert.equal(build.realAdsEnabled, false);
  assert.equal(build.iosUnits, null);
  assert.equal(runtime.enabled, true);
  assert.equal(runtime.bannerUnitId, undefined);
  assert.equal(runtime.interstitialUnitId, undefined);
  assert.equal(runtime.requiresTrackingAuthorization, true);
  const qa = resolveAdBuild({
    ...revenue,
    EAS_BUILD_PROFILE: "ios-development",
    IOS_ADS_MODE: "test",
    ADS_TEST_UMP_EEA: "1",
  });
  assert.equal(resolveRuntimeAds("ios", qa, false).consentDebugEea, true);
  for (const mode of ["test", "live"]) {
    const store = resolveAdBuild({
      ...revenue,
      IOS_ADS_MODE: mode,
      ADS_TEST_UMP_EEA: "1",
    });
    assert.equal(resolveRuntimeAds("ios", store, false).consentDebugEea, false);
  }
});
test("iOS flags cannot enable Android revenue or web SDK; old test opt-in is not reused for revenue", () => {
  assert.equal(
    resolveAdBuild({
      ...revenue,
      EAS_BUILD_PLATFORM: "android",
      EAS_BUILD_PROFILE: "ads-closed-test",
      IOS_BUILD_TARGET: "store",
      ADS_MODE: "test",
    }).realAdsEnabled,
    false,
  );
  const live = resolveRuntimeAds("ios", resolveAdBuild(revenue), false);
  const qa = resolveRuntimeAds(
    "ios",
    resolveAdBuild({ ...revenue, IOS_ADS_MODE: "test" }),
    false,
  );
  assert.notEqual(live.preferencesKey, qa.preferencesKey);
  assert.equal(
    resolveRuntimeAds("web", resolveAdBuild(revenue), false).enabled,
    false,
  );
  assert.equal(
    resolveRuntimeAds("android", resolveAdBuild(revenue), false).enabled,
    false,
  );
  for (const units of [
    null,
    {},
    { banner: 42 },
    { banner: "not-an-id", interstitial: "not-an-id" },
  ])
    assert.equal(
      resolveRuntimeAds(
        "ios",
        { ...resolveAdBuild(revenue), iosUnits: units },
        false,
      ).enabled,
      false,
    );
});
test("ATT denial/restriction does not prompt repeatedly; passive refresh never opens a prompt", async () => {
  let prompts = 0;
  const request = async () => {
    prompts++;
    return { granted: false, canAskAgain: false };
  };
  for (const interactive of [false, true])
    assert.equal(
      await authorizeTracking(interactive, {
        get: async () => ({ granted: false, canAskAgain: false }),
        request,
      }),
      false,
    );
  assert.equal(prompts, 0);
  assert.equal(
    await authorizeTracking(false, {
      get: async () => ({ granted: false, canAskAgain: true }),
      request,
    }),
    false,
  );
  assert.equal(prompts, 0);
  assert.equal(
    await authorizeTracking(true, {
      get: async () => ({ granted: false, canAskAgain: true }),
      request,
    }),
    false,
  );
  assert.equal(prompts, 1);
  assert.equal(
    await authorizeTracking(false, {
      get: async () => ({ granted: true, canAskAgain: false }),
      request,
    }),
    true,
  );
});
test("UMP denial never asks ATT; ATT denial blocks ads; Android keeps UMP behavior", async () => {
  let prompts = 0;
  const tracking = async () => {
    prompts++;
    return false;
  };
  const denied = { allowed: false, privacyOptionsRequired: true };
  assert.equal(
    (await authorizeAdConsent(denied, true, tracking)).allowed,
    false,
  );
  assert.equal(prompts, 0);
  const allowed = { ...denied, allowed: true };
  assert.equal(
    (await authorizeAdConsent(allowed, false, tracking)).allowed,
    true,
  );
  assert.equal(prompts, 0);
  assert.equal(
    (await authorizeAdConsent(allowed, true, tracking)).allowed,
    false,
  );
  assert.equal(prompts, 1);
  assert.equal(
    (await authorizeAdConsent(allowed, true, async () => true)).allowed,
    true,
  );
  await assert.rejects(
    authorizeAdConsent(allowed, true, async () => {
      throw Error("unavailable");
    }),
  );
});
test("offline SDK requests terminate; rejection and success preserve their result", async () => {
  await assert.rejects(
    withAdRequestTimeout(new Promise(() => {}), 10),
    /timeout/,
  );
  assert.equal(
    await withAdRequestTimeout(Promise.resolve("ready"), 100),
    "ready",
  );
  await assert.rejects(
    withAdRequestTimeout(Promise.reject(Error("offline")), 100),
    /offline/,
  );
});

test("final advertising artifact requires GMA, UMP, ATT and the exact iOS App ID", () => {
  const facts = {
    plist: {
      GADApplicationIdentifier: revenue.ADMOB_IOS_APP_ID,
      GADDelayAppMeasurementInit: true,
      NSUserTrackingUsageDescription:
        "Synthetic permission explanation, not real data",
    },
    paths: [
      "GoogleMobileAdsResources.bundle/PrivacyInfo.xcprivacy",
      "UserMessagingPlatformResources.bundle/PrivacyInfo.xcprivacy",
    ],
    binary: Buffer.from(
      "GADMobileAds UMPConsentInformation ExpoTrackingTransparency",
    ),
    bundle: Buffer.from("RNGoogleMobileAds"),
    configuration: { extra: { ads: resolveAdBuild(revenue) } },
  };
  const expected = { appId: revenue.ADMOB_IOS_APP_ID };
  const result = validateIosAds(facts, expected);
  assert.equal(result.runtimeAdDisplayTested, false);
  assert.equal(result.appPrivacyPublished, false);
  for (const change of [
    { paths: [] },
    { binary: Buffer.from("SDK excluded") },
    { bundle: Buffer.from("no SDK") },
    { plist: { ...facts.plist, GADDelayAppMeasurementInit: false } },
    { plist: { ...facts.plist, NSUserTrackingUsageDescription: "" } },
  ])
    assert.throws(() => validateIosAds({ ...facts, ...change }, expected));
  assert.throws(() => validateIosAds(facts, { appId: googleSampleApps.ios }));
  const configured = {
    ...facts,
    configuration: { extra: { ads: resolveAdBuild(revenue) } },
  };
  const liveExpected = {
    ...expected,
    mode: "live",
    bannerId: revenue.ADMOB_IOS_BANNER_ID,
    interstitialId: revenue.ADMOB_IOS_INTERSTITIAL_ID,
  };
  validateIosAds(configured, liveExpected);
  assert.throws(() =>
    validateIosAds(configured, { ...liveExpected, mode: "test" }),
  );
  assert.throws(() =>
    validateIosAds(configured, {
      ...liveExpected,
      bannerId: revenue.ADMOB_IOS_INTERSTITIAL_ID,
    }),
  );
});

test("the new tracking native module is excluded from Android autolinking", () => {
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  assert(
    pkg.expo.autolinking.android.exclude.includes("expo-tracking-transparency"),
  );
});
