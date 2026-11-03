import { AD_PREFERENCES_KEY } from "./adPolicy";

export function resolveRuntimeAds(
  platform: string,
  build: Record<string, unknown> | undefined,
  development: boolean,
) {
  const ios = platform === "ios" && build?.platform === "ios";
  const mode: "live" | "test" = build?.mode === "live" && ios ? "live" : "test";
  const appId = ios ? build?.iosAppId : build?.androidAppId;
  const units = build?.iosUnits as {
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
    consentDebugEea: development && build?.consentDebugGeography === "EEA",
    requiresTrackingAuthorization: ios,
    bannerUnitId: mode === "live" ? units?.banner : undefined,
    interstitialUnitId: mode === "live" ? units?.interstitial : undefined,
    // An old test opt-in must never silently authorize revenue ads.
    preferencesKey:
      ios && mode === "live"
        ? "@anla-ezberle-quiz/ads/ios-live/v1"
        : AD_PREFERENCES_KEY,
  };
}
