export const googleSampleApps: {
  readonly android: string;
  readonly ios: string;
};
export function resolveAdBuild(env: Record<string, string | undefined>): {
  mode: "off" | "test" | "live";
  realAdsEnabled: boolean;
  platform?: "ios";
  iosUnits?: { banner: string; interstitial: string } | null;
  androidAppId: string;
  iosAppId: string;
  consentDebugGeography: "EEA" | null;
};
