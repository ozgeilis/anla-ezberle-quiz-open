import React from "react";
import type { AdsRuntime, BannerProps } from "./runtime.types";
import { consentDecision } from "./consent";
import { createInterstitial } from "./interstitial";

export async function loadAdsRuntime(): Promise<AdsRuntime> {
  // An older installed development client must fail safely, rather than crash
  // at module import while opening a non-ad screen.
  const sdk = await import("react-native-google-mobile-ads");
  const requestOptions = { requestNonPersonalizedAdsOnly: true };
  let initialization: Promise<unknown> | undefined;
  function Banner({ width, onLoaded, onFailed }: BannerProps) {
    return (
      <sdk.BannerAd
        unitId={sdk.TestIds.ADAPTIVE_BANNER}
        size={sdk.BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        width={width}
        requestOptions={requestOptions}
        onAdLoaded={onLoaded}
        onAdFailedToLoad={onFailed}
      />
    );
  }
  return {
    async consent(interactive) {
      await sdk.AdsConsent.requestInfoUpdate({
        tagForUnderAgeOfConsent: false,
      });
      if (interactive) await sdk.AdsConsent.loadAndShowConsentFormIfRequired();
      return consentDecision(sdk.AdsConsent);
    },
    async privacyOptions() {
      const info = await sdk.AdsConsent.requestInfoUpdate();
      if (info.privacyOptionsRequirementStatus === "REQUIRED")
        await sdk.AdsConsent.showPrivacyOptionsForm();
      return consentDecision(sdk.AdsConsent);
    },
    async initialize() {
      if (!initialization)
        initialization = (async () => {
          await sdk.default().setRequestConfiguration({
            maxAdContentRating: sdk.MaxAdContentRating.G,
            tagForChildDirectedTreatment: false,
            tagForUnderAgeOfConsent: false,
            testDeviceIdentifiers: ["EMULATOR"],
          });
          await sdk.default().setAppMuted(true);
          return sdk.default().initialize();
        })();
      try {
        await initialization;
      } catch (error) {
        initialization = undefined;
        throw error;
      }
    },
    interstitial(onReady) {
      const ad = sdk.InterstitialAd.createForAdRequest(
        sdk.TestIds.INTERSTITIAL,
        requestOptions,
      );
      const events = {
        loaded: sdk.AdEventType.LOADED,
        opened: sdk.AdEventType.OPENED,
        closed: sdk.AdEventType.CLOSED,
        error: sdk.AdEventType.ERROR,
      };
      return createInterstitial(
        {
          load: () => ad.load(),
          show: () => ad.show(),
          destroy: () => ad.destroy(),
          listen: (event, fn) => ad.addAdEventListener(events[event], fn),
        },
        onReady,
      );
    },
    Banner,
  };
}
