import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, realpathSync, statSync } from "node:fs";
import { dirname, resolve as absolute } from "node:path";
import { resolveAdBuild, googleSampleApps } from "../config/admob.js";
import {
  AD_INTERVAL_MS,
  canOfferInterstitial,
  mayPrepareAdConsent,
  defaultAdPreferences,
  parseAdPreferences,
} from "../src/features/ads/adPolicy";
import {
  createInterstitial,
  type InterstitialPort,
} from "../src/features/ads/interstitial";
import { consentDecision } from "../src/features/ads/consent";
import type { AdsConsentInterface } from "react-native-google-mobile-ads";
import { createRequire } from "node:module";
import { createAdInitializer } from "../src/features/ads/initialization";

test("GMA initializes before native mute, shares concurrent starts and retries failures", async () => {
  const calls: string[] = [];
  let initialized = false,
    fail = true;
  const initialize = createAdInitializer({
    configure: async () => {
      calls.push("configure");
    },
    initialize: async () => {
      calls.push("initialize");
      if (fail) throw Error("unavailable");
      await Promise.resolve();
      initialized = true;
    },
    mute: () => {
      assert.ok(initialized, "Native GMA rejects mute before initialize");
      calls.push("mute");
    },
  });
  await assert.rejects(initialize(), /unavailable/);
  assert.deepEqual(calls, ["configure", "initialize"]);
  fail = false;
  await Promise.all([initialize(), initialize()]);
  await initialize();
  assert.deepEqual(calls, [
    "configure",
    "initialize",
    "configure",
    "initialize",
    "mute",
  ]);
});

test("prebuild retains the reflectively created WorkDatabase constructor without disabling R8", () => {
  const require = createRequire(import.meta.url);
  const { appendRules } = require("../plugins/with-admob-workmanager.js") as {
    appendRules: (value: string) => string;
  };
  const original =
    "# Existing app rules\n-keep class com.example.Required { *; }\n";
  const result = appendRules(original);
  assert.ok(result.startsWith(original));
  assert.ok(
    result.includes("-keep class androidx.work.impl.WorkDatabase_Impl"),
  );
  assert.ok(result.includes("public <init>();"));
  assert.equal(appendRules(result), result);
  assert.equal(result.includes("-dontobfuscate"), false);
});

test("revenue cannot be enabled by public or production environment flags", () => {
  for (const profile of ["production", "preview", "development", "unknown"]) {
    for (const mode of ["production", "live", "test", undefined])
      assert.equal(
        resolveAdBuild({
          EAS_BUILD_PROFILE: profile,
          ADS_TEST_BUILD: "1",
          ADS_MODE: mode,
        }).mode,
        "off",
      );
  }
  assert.equal(resolveAdBuild({ ADS_MODE: "test" }).mode, "off");
  const config = resolveAdBuild({
    EAS_BUILD_PROFILE: "ads-preview",
    ADS_MODE: "test",
  });
  assert.equal(config.mode, "test");
  assert.equal(config.realAdsEnabled, false);
  assert.equal(config.androidAppId, googleSampleApps.android);
  assert.throws(
    () =>
      resolveAdBuild({
        ADS_TEST_BUILD: "1",
        ADS_MODE: "test",
        ADMOB_ANDROID_APP_ID: "ca-app-pub-3940256099942544/6300978111",
      }),
    /App ID/,
  );
});

test("guarded closed-test AAB uses the accepted preview ad configuration without revenue", () => {
  const env = {
    ADS_MODE: "test",
    ADS_TEST_BUILD: "1",
    ADMOB_ANDROID_APP_ID: "ca-app-pub-9642662711398587~8836643534",
  };
  assert.deepEqual(
    resolveAdBuild({ ...env, EAS_BUILD_PROFILE: "ads-closed-test" }),
    resolveAdBuild({ ...env, EAS_BUILD_PROFILE: "ads-preview" }),
  );
  for (const mode of ["live", "production", undefined])
    assert.equal(
      resolveAdBuild({
        ...env,
        EAS_BUILD_PROFILE: "ads-closed-test",
        ADS_MODE: mode,
      }).mode,
      "off",
    );
});

test("UMP geography override requires an explicit test development configuration", () => {
  for (const profile of [
    "production",
    "preview",
    "development",
    "ads-preview",
    "ads-closed-test",
  ])
    assert.equal(
      resolveAdBuild({
        EAS_BUILD_PROFILE: profile,
        ADS_MODE: "test",
        ADS_TEST_BUILD: "1",
        ADS_TEST_UMP_EEA: "1",
      }).consentDebugGeography,
      null,
    );
  assert.equal(
    resolveAdBuild({
      ADS_MODE: "test",
      ADS_TEST_BUILD: "1",
      ADS_TEST_UMP_EEA: "1",
    }).consentDebugGeography,
    "EEA",
  );
  assert.equal(
    resolveAdBuild({ EAS_BUILD_PROFILE: "ads-development", ADS_MODE: "test" })
      .consentDebugGeography,
    null,
  );
  assert.equal(
    resolveAdBuild({ ADS_TEST_UMP_EEA: "1" }).consentDebugGeography,
    null,
  );
  assert.match(
    readFileSync(absolute("src/features/ads/adConfig.ts"), "utf8"),
    /consentDebugEea: __DEV__ &&/,
  );
});
const eligible = () => ({
  completedRounds: 3,
  resultId: "completed-local-game",
  saved: true,
  ready: true,
  foreground: true,
  path: "/results",
  playing: false,
  busy: false,
  preferences: {
    ...defaultAdPreferences,
    adultConfirmed: true,
    testAdsAllowed: true,
  },
  now: 1_000_000,
  monotonicElapsedMs: Infinity,
});
test("first two completed rounds never qualify; third can; cooldown survives restart/clock rollback", () => {
  const input = eligible();
  for (const count of [0, 1, 2])
    assert.equal(
      canOfferInterstitial({ ...input, completedRounds: count }),
      false,
    );
  assert.equal(canOfferInterstitial(input), true);
  input.preferences.lastPresentedAt = input.now;
  const reloaded = parseAdPreferences(JSON.stringify(input.preferences));
  for (const diff of [-60000, 0, AD_INTERVAL_MS - 1])
    assert.equal(
      canOfferInterstitial({
        ...input,
        preferences: reloaded,
        now: input.now + diff,
      }),
      false,
    );
  assert.equal(
    canOfferInterstitial({ ...input, now: input.now + AD_INTERVAL_MS }),
    true,
  );
  assert.equal(
    canOfferInterstitial({
      ...input,
      now: input.now + 3_600_000,
      monotonicElapsedMs: 60_000,
    }),
    false,
  );
});
test("no advertising during gameplay, review, auth, rooms, deletion, intro or background", () => {
  const input = eligible();
  for (const path of [
    "/",
    "/quiz",
    "/results/review",
    "/online",
    "/online/auth/callback",
    "/live",
    "/duel/play",
    "/account-delete",
    "/settings/privacy",
  ])
    assert.equal(canOfferInterstitial({ ...input, path }), false);
  for (const change of [
    { playing: true },
    { foreground: false },
    { ready: false },
    { busy: true },
    { saved: false },
  ])
    assert.equal(canOfferInterstitial({ ...input, ...change }), false);
  for (const p of [
    defaultAdPreferences,
    { ...input.preferences, adultConfirmed: false },
    { ...input.preferences, testAdsAllowed: false },
    { ...input.preferences, consumedResults: [input.resultId] },
  ])
    assert.equal(canOfferInterstitial({ ...input, preferences: p }), false);
});

function port() {
  const listeners = new Map<string, Set<() => void>>();
  let shows = 0,
    loads = 0,
    destroyed = false;
  const p: InterstitialPort = {
    load: () => {
      loads++;
    },
    show: async () => {
      shows++;
    },
    destroy: () => {
      destroyed = true;
    },
    listen: (event, fn) => {
      const set = listeners.get(event) ?? new Set();
      set.add(fn);
      listeners.set(event, set);
      return () => {
        set.delete(fn);
      };
    },
  };
  return {
    p,
    emit: (event: string) => listeners.get(event)?.forEach((fn) => fn()),
    stats: () => ({ shows, loads, destroyed }),
  };
}
test("a ready ad shows once and navigation waits for actual CLOSE, not show() resolution", async () => {
  const driver = port(),
    states: boolean[] = [];
  const ad = createInterstitial(driver.p, (ready) => states.push(ready));
  assert.equal(await ad.show(), false);
  assert.equal(driver.stats().shows, 0);
  ad.load();
  driver.emit("loaded");
  let done = 0;
  const first = ad.show().then((shown) => {
    done++;
    return shown;
  });
  assert.equal(await ad.show(), false);
  driver.emit("opened");
  await Promise.resolve();
  assert.equal(done, 0);
  assert.equal(driver.stats().shows, 1);
  driver.emit("closed");
  assert.equal(await first, true);
  driver.emit("closed");
  assert.equal(done, 1);
  ad.dispose();
  assert.equal(driver.stats().destroyed, true);
  assert.equal(await ad.show(), false);
});
test("load/show failures release the transition and do not retry endlessly", async () => {
  const driver = port();
  const ad = createInterstitial(driver.p, () => {});
  ad.load();
  driver.emit("error");
  assert.equal(await ad.show(), false);
  driver.emit("loaded");
  driver.p.show = async () => {
    throw Error("offline");
  };
  assert.equal(await ad.show(), false);
  assert.equal(driver.stats().loads, 1);
  ad.dispose();
});
test("no duplicate load while an ad is loading", () => {
  const driver = port(),
    ad = createInterstitial(driver.p, () => {});
  ad.load();
  ad.load();
  assert.equal(driver.stats().loads, 1);
  ad.dispose();
});

test("UMP unknown/rejected/basic-storage refusal never authorize requests", async () => {
  // Only consent methods are exercised; no mock is presented as real UMP acceptance.
  function consent(
    status: string,
    canRequestAds: boolean,
    gdpr: boolean,
    storage = true,
    basic = true,
  ) {
    return {
      getConsentInfo: async () => ({
        status,
        canRequestAds,
        privacyOptionsRequirementStatus: "REQUIRED",
      }),
      getGdprApplies: async () => gdpr,
      getUserChoices: async () => ({
        storeAndAccessInformationOnDevice: storage,
        selectBasicAds: basic,
      }),
    } as unknown as AdsConsentInterface;
  }
  for (const c of [
    consent("UNKNOWN", true, false),
    consent("REQUIRED", true, false),
    consent("OBTAINED", false, true),
    consent("OBTAINED", true, true, false),
    consent("OBTAINED", true, true, true, false),
  ])
    assert.equal((await consentDecision(c)).allowed, false);
  assert.equal(
    (await consentDecision(consent("NOT_REQUIRED", true, false))).allowed,
    true,
  );
  assert.equal(
    (await consentDecision(consent("OBTAINED", true, true))).allowed,
    true,
  );
});
test("web runtime has no native SDK import and no reward API exists", () => {
  const web = readFileSync("src/features/ads/runtime.web.tsx", "utf8");
  assert.equal(web.includes("react-native-google-mobile-ads"), false);
  const runtime = readFileSync("src/features/ads/runtime.native.tsx", "utf8");
  assert.equal(runtime.includes("RewardedAd"), false);
  assert.equal(runtime.includes("sdk.TestIds.INTERSTITIAL"), true);
});

test("unknown/minor age cannot even start UMP; adults can reopen privacy after local opt-out", () => {
  const p = { ...defaultAdPreferences, testAdsAllowed: true };
  assert.equal(mayPrepareAdConsent(p, false), false);
  assert.equal(mayPrepareAdConsent(p, true), false);
  assert.equal(
    mayPrepareAdConsent(
      { ...p, adultConfirmed: true, testAdsAllowed: false },
      true,
    ),
    true,
  );
});
test("actual Metro resolver selects native GMA on Android/iOS and safe web code on web", () => {
  const require = createRequire(import.meta.url);
  const expoRoot = dirname(require.resolve("expo/package.json"));
  const metroConfig = require.resolve("@expo/metro-config", {
    paths: [expoRoot],
  });
  const { resolve } = createRequire(metroConfig)("metro-resolver") as {
    resolve(
      context: Record<string, unknown>,
      specifier: string,
      platform: string,
    ): { filePath: string };
  };
  const context = {
    originModulePath: absolute("src/features/ads/AdProvider.tsx"),
    sourceExts: ["js", "jsx", "json", "ts", "tsx"],
    assetExts: new Set(),
    preferNativePlatform: true,
    getPackageForModule: () => null,
    doesFileExist: existsSync,
    fileSystemLookup: (path: string) =>
      existsSync(path)
        ? {
            exists: true,
            type: statSync(path).isFile() ? "f" : "d",
            realPath: realpathSync(path),
          }
        : { exists: false },
    mainFields: ["react-native", "browser", "main"],
  };
  for (const platform of ["android", "ios"])
    assert.ok(
      resolve(context, "./runtime", platform).filePath.endsWith(
        "runtime.native.tsx",
      ),
    );
  assert.ok(
    resolve(context, "./runtime", "web").filePath.endsWith("runtime.web.tsx"),
  );
});
