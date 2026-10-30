export const AD_PREFERENCES_KEY = "@anla-ezberle-quiz/ads/v1";
export const AD_INTERVAL_MS = 5 * 60_000;
export interface AdPreferences {
  adultConfirmed: boolean;
  testAdsAllowed: boolean;
  lastPresentedAt: number;
  consumedResults: string[];
}
export const defaultAdPreferences: AdPreferences = {
  adultConfirmed: false,
  testAdsAllowed: false,
  lastPresentedAt: 0,
  consumedResults: [],
};
export function parseAdPreferences(raw: string | null): AdPreferences {
  if (!raw) return { ...defaultAdPreferences, consumedResults: [] };
  const value: unknown = JSON.parse(raw);
  if (!value || typeof value !== "object")
    throw Error("Invalid ad preferences");
  const v = value as Record<string, unknown>;
  return {
    adultConfirmed: v.adultConfirmed === true,
    testAdsAllowed: v.testAdsAllowed === true,
    lastPresentedAt:
      typeof v.lastPresentedAt === "number" &&
      Number.isFinite(v.lastPresentedAt) &&
      v.lastPresentedAt >= 0
        ? v.lastPresentedAt
        : 0,
    consumedResults: Array.isArray(v.consumedResults)
      ? v.consumedResults
          .filter((id): id is string => typeof id === "string")
          .slice(-100)
      : [],
  };
}
export function canOfferInterstitial(input: {
  completedRounds: number;
  resultId: string;
  saved: boolean;
  ready: boolean;
  foreground: boolean;
  path: string;
  playing: boolean;
  busy: boolean;
  preferences: AdPreferences;
  now: number;
  monotonicElapsedMs: number;
}) {
  const p = input.preferences;
  return (
    input.completedRounds >= 3 &&
    input.saved &&
    input.ready &&
    input.foreground &&
    input.path === "/results" &&
    !input.playing &&
    !input.busy &&
    p.adultConfirmed &&
    p.testAdsAllowed &&
    input.monotonicElapsedMs >= AD_INTERVAL_MS &&
    !p.consumedResults.includes(input.resultId) &&
    (p.lastPresentedAt === 0 || input.now - p.lastPresentedAt >= AD_INTERVAL_MS)
  );
}
