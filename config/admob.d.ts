export const googleSampleApps: {
  readonly android: string;
  readonly ios: string;
};
export function resolveAdBuild(env: Record<string, string | undefined>): {
  mode: "off" | "test" | "live";
  realAdsEnabled: boolean;
  platform?: "ios" | "android";
  androidRelease?: boolean;
  androidUnits?: { banner: string; interstitial: string } | null;
  iosQaConsent?: boolean;
  iosUnits?: { banner: string; interstitial: string } | null;
  androidAppId: string;
  iosAppId: string;
  consentDebugGeography: "EEA" | null;
};
