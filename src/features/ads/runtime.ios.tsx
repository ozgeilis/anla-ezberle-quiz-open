// Exclude the ad SDK from the iOS JS dependency graph as well as native pods.
// The existing disabled-ad UI and transition fallback remain available.
import type { AdsRuntime } from "./runtime.types";
export async function loadAdsRuntime(): Promise<AdsRuntime> {
  throw Error("Bu iOS sürümünde reklamlar kullanılamaz.");
}
