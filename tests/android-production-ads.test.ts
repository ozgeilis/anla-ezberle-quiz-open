import test from "node:test";
import assert from "node:assert/strict";
import { resolveAdBuild } from "../config/admob.js";
import { resolveRuntimeAds } from "../src/features/ads/runtimeConfig";
import {
  canOfferInterstitial,
  defaultAdPreferences,
} from "../src/features/ads/adPolicy";
const production = {
  EAS_BUILD_PLATFORM: "android",
  EAS_BUILD_PROFILE: "android-production",
  ADS_MODE: "live",
  ADMOB_ANDROID_APP_ID: "ca-app-pub-9642662711398587~8836643534",
  ADMOB_ANDROID_BANNER_ID: "ca-app-pub-9642662711398587/6077280493",
  ADMOB_ANDROID_INTERSTITIAL_ID: "ca-app-pub-9642662711398587/8188438512",
};
test("Android production requires its explicit profile and matching, separate units", () => {
  const build = resolveAdBuild(production);
  const runtime = resolveRuntimeAds("android", build, false);
  assert.equal(runtime.enabled, true);
  assert.equal(runtime.mode, "live");
  assert.equal(runtime.roundEndPlacement, true);
  assert.equal(runtime.requiresTrackingAuthorization, false);
  assert.equal(runtime.underAgeOfConsent, true);
  assert.equal(runtime.bannerUnitId, production.ADMOB_ANDROID_BANNER_ID);
  assert.equal(resolveRuntimeAds("ios", build, false).enabled, false);
  for (const change of [
    { ADS_MODE: "test" },
    { ADMOB_ANDROID_APP_ID: undefined },
    { ADMOB_ANDROID_BANNER_ID: undefined },
    { ADMOB_ANDROID_INTERSTITIAL_ID: production.ADMOB_ANDROID_BANNER_ID },
    { ADMOB_ANDROID_BANNER_ID: "ca-app-pub-1111111111111111/1234567890" },
    { ADMOB_IOS_BANNER_ID: production.ADMOB_ANDROID_BANNER_ID },
  ])
    assert.throws(() => resolveAdBuild({ ...production, ...change }));
});
test("QA cannot emit live units; production cannot force test geography; Alpha stays legacy", () => {
  const qa = resolveRuntimeAds(
    "android",
    resolveAdBuild({
      ...production,
      EAS_BUILD_PROFILE: "android-production-qa",
      ADS_MODE: "test",
      ADS_TEST_UMP_EEA: "1",
    }),
    false,
  );
  assert.equal(qa.enabled, true);
  assert.equal(qa.mode, "test");
  assert.equal(qa.roundEndPlacement, true);
  assert.equal(qa.bannerUnitId, undefined);
  assert.equal(qa.interstitialUnitId, undefined);
  assert.equal(qa.consentDebugEea, true);
  const live = resolveRuntimeAds(
    "android",
    resolveAdBuild({ ...production, ADS_TEST_UMP_EEA: "1" }),
    false,
  );
  assert.equal(live.consentDebugEea, false);
  assert.notEqual(live.preferencesKey, qa.preferencesKey);
  const alpha = resolveRuntimeAds(
    "android",
    resolveAdBuild({
      ...production,
      EAS_BUILD_PROFILE: "ads-closed-test",
      ADS_MODE: "test",
    }),
    false,
  );
  assert.equal(alpha.mode, "test");
  assert.equal(alpha.roundEndPlacement, false);
  assert.equal(alpha.underAgeOfConsent, false);
});
test("only the Android release placement attempts every saved round, never Results or a running quiz", () => {
  const base = {
    platform: "android",
    roundEndPlacement: true,
    trigger: "round-complete" as const,
    resultId: "saved-round",
    saved: true,
    ready: true,
    foreground: true,
    path: "/quiz",
    playing: false,
    busy: false,
    preferences: { ...defaultAdPreferences, lastPresentedAt: Date.now() },
    now: Date.now(),
    monotonicElapsedMs: 0,
  };
  for (let completedRounds = 1; completedRounds <= 5; completedRounds++)
    assert.equal(canOfferInterstitial({ ...base, completedRounds }), true);
  for (const change of [
    { ready: false },
    { playing: true },
    { foreground: false },
    { saved: false },
    { path: "/results", trigger: "results-exit" as const },
    { preferences: { ...base.preferences, consumedResults: [base.resultId] } },
    { roundEndPlacement: false },
  ])
    assert.equal(
      canOfferInterstitial({ ...base, completedRounds: 5, ...change }),
      false,
    );
  assert.equal(
    canOfferInterstitial({ ...base, platform: "ios", completedRounds: 1 }),
    false,
  );
  assert.equal(
    canOfferInterstitial({ ...base, platform: "ios", completedRounds: 2 }),
    true,
  );
});
