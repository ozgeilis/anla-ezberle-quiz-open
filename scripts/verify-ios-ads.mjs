import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

export function validateIosAds(
  { plist, paths, binary, bundle, configuration },
  expected,
) {
  assert.match(expected.appId ?? "", /^ca-app-pub-\d{16}~\d{10}$/);
  assert.equal(
    plist.GADApplicationIdentifier,
    expected.appId,
    "Wrong iOS AdMob App ID",
  );
  assert.equal(
    plist.GADDelayAppMeasurementInit,
    true,
    "Measurement must wait for consent",
  );
  assert.equal(
    typeof plist.NSUserTrackingUsageDescription,
    "string",
    "ATT explanation missing",
  );
  assert(plist.NSUserTrackingUsageDescription.trim().length > 20);
  assert(
    paths.some((p) => /GoogleMobileAds.*PrivacyInfo\.xcprivacy/.test(p)),
    "GMA privacy manifest missing",
  );
  assert(
    paths.some((p) => /UserMessagingPlatform.*PrivacyInfo\.xcprivacy/.test(p)),
    "UMP privacy manifest missing",
  );
  for (const symbol of [
    "GADMobileAds",
    "UMPConsentInformation",
    "ExpoTrackingTransparency",
  ])
    assert(binary.includes(symbol), `Expected native module absent: ${symbol}`);
  assert(
    bundle.includes("RNGoogleMobileAds"),
    "Advertising JS binding missing",
  );
  if (expected.mode) {
    assert(
      ["test", "live"].includes(expected.mode),
      "Explicit advertising mode required",
    );
    const ads = configuration?.extra?.ads;
    assert.equal(ads?.platform, "ios");
    assert.equal(ads?.mode, expected.mode, "Wrong embedded advertising mode");
    assert.equal(ads?.iosAppId, expected.appId);
    assert.equal(ads?.realAdsEnabled, expected.mode === "live");
    if (expected.mode === "live") {
      assert.equal(
        ads?.iosQaConsent,
        false,
        "QA override in revenue candidate",
      );
      assert.equal(
        ads?.consentDebugGeography,
        null,
        "Geography override in revenue candidate",
      );
      for (const [key, expectedId] of [
        ["banner", expected.bannerId],
        ["interstitial", expected.interstitialId],
      ]) {
        assert.match(expectedId ?? "", /^ca-app-pub-\d{16}\/\d{10}$/);
        assert.equal(
          ads?.iosUnits?.[key],
          expectedId,
          "Wrong embedded iOS ad unit",
        );
      }
    } else
      assert.equal(ads?.iosUnits, null, "QA must not carry publisher ad units");
  }
  return {
    advertisingSdkPresent: true,
    umpPresent: true,
    attNativePresent: true,
    measurementDelayed: true,
    appIdMatches: true,
    runtimeAdDisplayTested: false,
    runtimeNetworkTested: false,
    appPrivacyPublished: false,
  };
}

export function verifyIosAds(app, plist, expected) {
  assert(
    ["test", "live"].includes(expected.mode),
    "Explicit advertising mode required",
  );
  const paths = [];
  function walk(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      paths.push(relative(app, path));
      if (entry.isDirectory()) walk(path);
    }
  }
  walk(app);
  return validateIosAds(
    {
      plist,
      paths,
      binary: readFileSync(join(app, plist.CFBundleExecutable)),
      bundle: readFileSync(join(app, "main.jsbundle")),
      configuration: JSON.parse(
        readFileSync(join(app, "EXConstants.bundle", "app.config"), "utf8"),
      ),
    },
    expected,
  );
}
