import React from "react";
import type { AdsRuntime, BannerProps } from "./runtime.types";
import { consentDecision } from "./consent";
import { createInterstitial } from "./interstitial";
import { createAdInitializer } from "./initialization";
import { adConfig } from "./adConfig";
import { mayUseAdvertisingTracking } from "./tracking";
import { withAdRequestTimeout } from "./requestTimeout";
import { authorizeAdConsent } from "./consentAuthorization";

export async function loadAdsRuntime(): Promise<AdsRuntime> {
  // An older installed development client must fail safely, rather than crash
  // at module import while opening a non-ad screen.
  const sdk = await import("react-native-google-mobile-ads");
  const requestOptions = { requestNonPersonalizedAdsOnly: true };
  const initialize = createAdInitializer({
    configure: async () => {
      if (adConfig.requiresTrackingAuthorization)
        await sdk.default().setPublisherFirstPartyIdEnabled(false);
      await sdk.default().setRequestConfiguration({
        maxAdContentRating: sdk.MaxAdContentRating.G,
        tagForChildDirectedTreatment: false,
        tagForUnderAgeOfConsent: false,
        testDeviceIdentifiers: ["EMULATOR"],
      });
    },
    initialize: () => withAdRequestTimeout(sdk.default().initialize()),
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
        unitId={adConfig.bannerUnitId ?? sdk.TestIds.ADAPTIVE_BANNER}
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
      await withAdRequestTimeout(
        sdk.AdsConsent.requestInfoUpdate(consentOptions),
      );
      if (interactive) await sdk.AdsConsent.loadAndShowConsentFormIfRequired();
      const decision = await consentDecision(sdk.AdsConsent);
      return authorizeAdConsent(
        decision,
        adConfig.requiresTrackingAuthorization,
        () => mayUseAdvertisingTracking(interactive),
      );
    },
    async privacyOptions() {
      const info = await withAdRequestTimeout(
        sdk.AdsConsent.requestInfoUpdate(consentOptions),
      );
      if (info.privacyOptionsRequirementStatus === "REQUIRED")
        await sdk.AdsConsent.showPrivacyOptionsForm();
      const decision = await consentDecision(sdk.AdsConsent);
      return authorizeAdConsent(
        decision,
        adConfig.requiresTrackingAuthorization,
        () => mayUseAdvertisingTracking(true),
      );
    },
    initialize,
    interstitial(onReady) {
      const ad = sdk.InterstitialAd.createForAdRequest(
        adConfig.interstitialUnitId ?? sdk.TestIds.INTERSTITIAL,
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
