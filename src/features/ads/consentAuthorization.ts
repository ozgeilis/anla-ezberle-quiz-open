import type { ConsentResult } from "./runtime.types";
export async function authorizeAdConsent(
  decision: ConsentResult,
  checkTracking: boolean,
  tracking: () => Promise<boolean>,
) {
  if (!decision.allowed || !checkTracking) return decision;
  // Wait for ATT before starting GMA. Denial is not UMP denial: Google supports
  // ads without IDFA. Requests remain NPA and publisher first-party ID is off.
  // A rejected/unreadable permission check still fails closed via the caller.
  await tracking();
  return decision;
}
