import React from "react";
import type { AdsRuntime, BannerProps } from "./runtime.types";
import { consentDecision } from "./consent";
import { createInterstitial } from "./interstitial";
import { createAdInitializer } from "./initialization";
import { adConfig } from "./adConfig";

export async function loadAdsRuntime(): Promise<AdsRuntime> {
  // An older installed development client must fail safely, rather than crash
  // at module import while opening a non-ad screen.
  const sdk = await import("react-native-google-mobile-ads");
  const requestOptions = { requestNonPersonalizedAdsOnly: true };
  const initialize = createAdInitializer({
    configure: () =>
      sdk.default().setRequestConfiguration({
        maxAdContentRating: sdk.MaxAdContentRating.G,
        tagForChildDirectedTreatment: false,
        tagForUnderAgeOfConsent: false,
        testDeviceIdentifiers: ["EMULATOR"],
      }),
    initialize: () => sdk.default().initialize(),
    mute: () => sdk.default().setAppMuted(true),
  });
  const consentOptions = {
    tagForUnderAgeOfConsent: false,
    ...(adConfig.consentDebugEea
      ? { debugGeography: sdk.AdsConsentDebugGeography.EEA }
      : {}),
  };
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
      await sdk.AdsConsent.requestInfoUpdate(consentOptions);
      if (interactive) await sdk.AdsConsent.loadAndShowConsentFormIfRequired();
      return consentDecision(sdk.AdsConsent);
    },
    async privacyOptions() {
      const info = await sdk.AdsConsent.requestInfoUpdate(consentOptions);
      if (info.privacyOptionsRequirementStatus === "REQUIRED")
        await sdk.AdsConsent.showPrivacyOptionsForm();
      return consentDecision(sdk.AdsConsent);
    },
    initialize,
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
