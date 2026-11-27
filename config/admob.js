// Public Google sample identifiers, never publisher credentials or live units.
const googleSampleApps = {
  android: "ca-app-pub-3940256099942544~3347511713",
  ios: "ca-app-pub-3940256099942544~1458002511",
};

function resolveAdBuild(env) {
  const profile =
    env.EAS_BUILD_PROFILE ||
    (env.ANDROID_BUILD_TARGET === "production"
      ? "android-production"
      : env.ANDROID_BUILD_TARGET === "qa"
        ? "android-production-qa"
        : undefined);
  const ios =
    env.EAS_BUILD_PLATFORM === "ios" ||
    (env.EAS_BUILD_PLATFORM !== "android" &&
      (!!env.IOS_BUILD_TARGET || profile?.startsWith("ios-")));
  if (ios) {
    const mode = ["test", "live"].includes(env.IOS_ADS_MODE)
      ? env.IOS_ADS_MODE
      : "off";
    const appId = env.ADMOB_IOS_APP_ID || googleSampleApps.ios;
    if (!/^ca-app-pub-\d{16}~\d{10}$/.test(appId))
      throw Error("ADMOB_IOS_APP_ID must be an iOS App ID, not an ad-unit ID");
    if (appId === env.ADMOB_ANDROID_APP_ID)
      throw Error("iOS must not reuse the Android AdMob App ID");
    const units =
      mode === "live"
        ? {
            banner: env.ADMOB_IOS_BANNER_ID,
            interstitial: env.ADMOB_IOS_INTERSTITIAL_ID,
          }
        : null;
    if (mode === "live") {
      if (
        profile !== "ios-testflight" &&
        !(!profile && env.IOS_BUILD_TARGET === "store")
      )
        throw Error(
          "Revenue requires the iOS store distribution configuration",
        );
      if (appId === googleSampleApps.ios || !env.ADMOB_IOS_APP_ID)
        throw Error("Revenue requires the registered iOS AdMob App ID");
      const publisher = appId.split("~")[0];
      for (const value of Object.values(units))
        if (
          !/^ca-app-pub-\d{16}\/\d{10}$/.test(value || "") ||
          !value.startsWith(`${publisher}/`)
        )
          throw Error(
            "Revenue requires matching iOS banner and interstitial unit IDs",
          );
      if (units.banner === units.interstitial)
        throw Error("iOS banner and interstitial units must be distinct");
    }
    return {
      platform: "ios",
      mode,
      realAdsEnabled: mode === "live",
      androidAppId: googleSampleApps.android,
      iosAppId: appId,
      iosUnits: units,
      iosQaConsent:
        mode === "test" &&
        profile === "ios-development" &&
        env.ADS_TEST_UMP_EEA === "1",
      consentDebugGeography:
        mode === "test" &&
        profile !== "ios-testflight" &&
        env.ADS_TEST_UMP_EEA === "1"
          ? "EEA"
          : null,
    };
  }
  const androidRelease =
    env.EAS_BUILD_PLATFORM !== "ios" &&
    (env.EAS_BUILD_PLATFORM === "android" || !!env.ANDROID_BUILD_TARGET) &&
    ["android-production", "android-production-qa"].includes(profile);
  if (androidRelease) {
    const qa = profile === "android-production-qa";
    const mode = qa ? "test" : "live";
    const appId = env.ADMOB_ANDROID_APP_ID;
    if (
      env.ADS_MODE !== mode ||
      appId !== "ca-app-pub-9642662711398587~8836643534"
    )
      throw Error(
        "Android release requires its registered App ID and explicit ad mode",
      );
    const units = qa
      ? null
      : {
          banner: env.ADMOB_ANDROID_BANNER_ID,
          interstitial: env.ADMOB_ANDROID_INTERSTITIAL_ID,
        };
    if (units) {
      for (const id of Object.values(units))
        if (!/^ca-app-pub-9642662711398587\/\d{10}$/.test(id || ""))
          throw Error(
            "Android revenue requires matching registered Android units",
          );
      if (
        units.banner === units.interstitial ||
        [env.ADMOB_IOS_BANNER_ID, env.ADMOB_IOS_INTERSTITIAL_ID].some(
          (id) => id && Object.values(units).includes(id),
        )
      )
        throw Error(
          "Android units must be distinct and must not reuse iOS units",
        );
    }
    return {
      platform: "android",
      androidRelease: true,
      mode,
      realAdsEnabled: !qa,
      androidAppId: appId,
      androidUnits: units,
      iosAppId: googleSampleApps.ios,
      consentDebugGeography: qa && env.ADS_TEST_UMP_EEA === "1" ? "EEA" : null,
    };
  }
  const testBuild =
    profile === "ads-preview" ||
    profile === "ads-development" ||
    profile === "ads-closed-test" ||
    (!profile && env.ADS_TEST_BUILD === "1");
  const mode = testBuild && env.ADS_MODE === "test" ? "test" : "off";
  const appId = env.ADMOB_ANDROID_APP_ID;
  if (mode === "test" && appId && !/^ca-app-pub-\d{16}~\d{10}$/.test(appId))
    throw Error("ADMOB_ANDROID_APP_ID must be an App ID, not an ad-unit ID");
  return {
    mode,
    // Production revenue intentionally has no implementation/remote switch yet.
    realAdsEnabled: false,
    androidAppId: mode === "test" && appId ? appId : googleSampleApps.android,
    iosAppId: googleSampleApps.ios,
    // QA only: never override real users' geography or EAS preview/production.
    consentDebugGeography:
      mode === "test" &&
      (!profile || profile === "ads-development") &&
      env.ADS_TEST_UMP_EEA === "1"
        ? "EEA"
        : null,
  };
}

module.exports = { googleSampleApps, resolveAdBuild };
