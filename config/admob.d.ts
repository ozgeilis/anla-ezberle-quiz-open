export const googleSampleApps: {
  readonly android: string;
  readonly ios: string;
};
export function resolveAdBuild(env: Record<string, string | undefined>): {
  mode: "off" | "test";
  realAdsEnabled: false;
  androidAppId: string;
  iosAppId: string;
  consentDebugGeography: "EEA" | null;
};
