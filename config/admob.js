// Public Google sample identifiers, never publisher credentials or live units.
const googleSampleApps = {
  android: "ca-app-pub-3940256099942544~3347511713",
  ios: "ca-app-pub-3940256099942544~1458002511",
};

function resolveAdBuild(env) {
  const profile = env.EAS_BUILD_PROFILE;
  const ios =
    env.EAS_BUILD_PLATFORM === "ios" ||
    !!env.IOS_BUILD_TARGET ||
    profile?.startsWith("ios-");
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
      consentDebugGeography:
        mode === "test" &&
        profile !== "ios-testflight" &&
        env.ADS_TEST_UMP_EEA === "1"
          ? "EEA"
          : null,
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
