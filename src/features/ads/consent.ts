import type { AdsConsentInterface } from "react-native-google-mobile-ads";
import type { ConsentResult } from "./runtime.types";

export async function consentDecision(
  consent: AdsConsentInterface,
): Promise<ConsentResult> {
  const info = await consent.getConsentInfo();
  let allowed =
    info.canRequestAds && ["OBTAINED", "NOT_REQUIRED"].includes(info.status);
  // NPA alone is not a substitute for storage/basic-ad consent in the EEA.
  if (allowed && (await consent.getGdprApplies())) {
    const choices = await consent.getUserChoices();
    allowed =
      choices.storeAndAccessInformationOnDevice && choices.selectBasicAds;
  }
  return {
    allowed,
    privacyOptionsRequired: info.privacyOptionsRequirementStatus === "REQUIRED",
  };
}
