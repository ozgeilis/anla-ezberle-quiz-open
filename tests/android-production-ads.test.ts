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

test("EAS local config without a profile/platform uses the explicit Android target marker", () => {
  const build = resolveAdBuild({
    ...production,
    EAS_BUILD_PROFILE: undefined,
    EAS_BUILD_PLATFORM: undefined,
    ANDROID_BUILD_TARGET: "production",
  });
  assert.equal(build.platform, "android");
  assert.equal(build.mode, "live");
  assert.equal(resolveRuntimeAds("android", build, false).enabled, true);
  assert.equal(
    resolveAdBuild({
      ...production,
      EAS_BUILD_PLATFORM: "ios",
      ANDROID_BUILD_TARGET: "production",
      IOS_ADS_MODE: "off",
    }).platform,
    "ios",
  );
});

test("release acceptance hashes payload bytes without requiring a Git checkout or hashing its own approval record", async () => {
  const { mkdtempSync, mkdirSync, writeFileSync, rmSync } =
    await import("node:fs");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");
  const { createRequire } = await import("node:module");
  const { androidReleaseSourceHash } = createRequire(import.meta.url)(
    "../config/android-release-source.js",
  );
  const root = mkdtempSync(join(tmpdir(), "anla-android-payload-"));
  try {
    for (const file of [
      "app.json",
      "app.config.ts",
      "eas.json",
      "package.json",
      "pnpm-lock.yaml",
      "metro.config.js",
      "tsconfig.json",
    ])
      writeFileSync(join(root, file), file);
    for (const dir of [
      "src",
      "assets",
      "config",
      "modules",
      "plugins",
      "scripts",
      "public",
    ])
      mkdirSync(join(root, dir));
    writeFileSync(join(root, "src", "game.ts"), "preserved game");
    const before = androidReleaseSourceHash(root);
    writeFileSync(
      join(root, "config", "android-production-approval.json"),
      JSON.stringify({ approved: true, reviewedSourceSha256: before }),
    );
    assert.equal(androidReleaseSourceHash(root), before);
    writeFileSync(join(root, "src", "game.ts"), "different game");
    assert.notEqual(androidReleaseSourceHash(root), before);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
