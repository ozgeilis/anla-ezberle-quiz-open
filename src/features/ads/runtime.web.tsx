import type { AdsRuntime } from "./runtime.types";
// Metro resolves runtime.native.tsx only on native platforms.
export async function loadAdsRuntime(): Promise<AdsRuntime> {
  throw Error("Native advertisements are unavailable on web");
}
