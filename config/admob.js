// Public Google sample identifiers, never publisher credentials or live units.
const googleSampleApps = {
  android: "ca-app-pub-3940256099942544~3347511713",
  ios: "ca-app-pub-3940256099942544~1458002511",
};

function resolveAdBuild(env) {
  const profile = env.EAS_BUILD_PROFILE;
  const testBuild =
    profile === "ads-preview" ||
    profile === "ads-development" ||
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
  };
}

module.exports = { googleSampleApps, resolveAdBuild };
