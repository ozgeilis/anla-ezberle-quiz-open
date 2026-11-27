import { AD_PREFERENCES_KEY } from "./adPolicy";

export function resolveRuntimeAds(
  platform: string,
  build: Record<string, unknown> | undefined,
  development: boolean,
) {
  const ios = platform === "ios" && build?.platform === "ios";
  const androidRelease =
    platform === "android" &&
    build?.platform === "android" &&
    build?.androidRelease === true;
  const mode: "live" | "test" =
    build?.mode === "live" && (ios || androidRelease) ? "live" : "test";
  const appId = ios ? build?.iosAppId : build?.androidAppId;
  const units = (ios ? build?.iosUnits : build?.androidUnits) as {
    banner?: string;
    interstitial?: string;
  } | null;
  const liveUnitsValid =
    units &&
    [units.banner, units.interstitial].every(
      (id) =>
        typeof id === "string" &&
        /^ca-app-pub-\d{16}\/\d{10}$/.test(id) &&
        typeof appId === "string" &&
        id.split("/")[0] === appId.split("~")[0],
    );
  return {
    enabled:
      (ios || platform === "android") &&
      typeof appId === "string" &&
      /^ca-app-pub-\d{16}~\d{10}$/.test(appId) &&
      (mode === "live"
        ? build?.realAdsEnabled === true && !!liveUnitsValid
        : build?.mode === "test" && build?.realAdsEnabled === false),
    mode,
    consentDebugEea:
      mode === "test" &&
      build?.consentDebugGeography === "EEA" &&
      (development ||
        androidRelease ||
        (ios &&
          build?.iosQaConsent === true &&
          build?.realAdsEnabled === false)),
    requiresTrackingAuthorization: ios,
    // Play audience includes 13–17. With no neutral age screen, do not mark
    // an unknown user as over the regional consent age. Never affects Alpha.
    underAgeOfConsent: androidRelease,
    roundEndPlacement: ios || androidRelease,
    bannerUnitId: mode === "live" ? units?.banner : undefined,
    interstitialUnitId: mode === "live" ? units?.interstitial : undefined,
    // Keep test/live local records separate. Neither record is UMP/ATT consent;
    // the SDK privacy state is checked before initializing/loading ads.
    preferencesKey:
      androidRelease && mode === "live"
        ? "@anla-ezberle-quiz/ads/android-live/v1"
        : ios && mode === "live"
          ? "@anla-ezberle-quiz/ads/ios-live/v1"
          : AD_PREFERENCES_KEY,
  };
}
