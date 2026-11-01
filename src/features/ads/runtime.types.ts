import type { ComponentType } from "react";
export interface ConsentResult {
  allowed: boolean;
  privacyOptionsRequired: boolean;
}
export interface BannerProps {
  width: number;
  onLoaded: () => void;
  onFailed: () => void;
}
export interface FullscreenAd {
  load(): void;
  show(): Promise<boolean>;
  dispose(): void;
}
export interface AdsRuntime {
  consent(interactive: boolean): Promise<ConsentResult>;
  privacyOptions(): Promise<ConsentResult>;
  initialize(): Promise<void>;
  interstitial(onReady: (ready: boolean) => void): FullscreenAd;
  Banner: ComponentType<BannerProps>;
}
