import type { ConsentResult } from "./runtime.types";
export async function authorizeAdConsent(
  decision: ConsentResult,
  requireTracking: boolean,
  tracking: () => Promise<boolean>,
) {
  if (!decision.allowed || !requireTracking) return decision;
  return { ...decision, allowed: await tracking() };
}
