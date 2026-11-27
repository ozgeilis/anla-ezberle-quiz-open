# Android first Production candidate — 2026-11-27

Base: integration/ios011-native-source-20261126 at b172111ef16071c3d7bead97e3ce2372bb8cf692. Main remains 1c6a3d876a4ae01661feff22db5823cad4c1b926. Work is isolated on release/android-production-20261127; no main merge or Play Production upload is authorized by this preparation.

## Verified inventory

- Play Production access is granted. Production has no release. Existing Alpha 0.1.0 (6) remains distributed; highest Play and EAS Android versionCode is 6. Candidate number 7 is not yet built/reserved.
- Permanent package com.kovynelstudio.anlaezberle and existing signing credentials are retained.
- Existing Android AdMob app ca-app-pub-9642662711398587~8836643534 had no active units. Owner created Android Ana Sayfa Banner /6077280493 and Android Tur Sonu Geçiş /8188438512. App still needs its public Play store association and AdMob review; limited serving is not fixed by client code.
- Android Google uses the existing browser PKCE flow, not the Apple-only local GoogleSignIn module. Backend signup restrictions remain unchanged.
- Main/open PR dependency chain remains #25 → #26 → #28 → #30 → intervening iOS source → #33 → native source integration. No merge performed.

## Isolated release behavior

New android-production and android-production-qa profiles share source/configuration except live vs Google sample ad units. Existing production/preview/ads-closed-test and all iOS profiles are preserved. Only new Android profiles set version 0.1.2.

The new Android candidate saves a complete ten-answer round before attempting one ready interstitial on /quiz, then reveals Results after close/error. Unavailable ads do not delay Results. Home/Replay never advertise. Fresh SDK objects reload after dismissal, retaining the previously tested iOS lifecycle controller. Legacy Alpha keeps its existing result-exit/3-round/5-minute behavior; iOS keeps its even-round behavior.

Play's current target audience includes 13–15, 16–17 and adults. There is no new age collection screen. Candidate Android requests are conservatively tagged under regional consent age in both UMP and GMA, remain NPA/G-rated, disable publisher first-party ID and retain blocked AD_ID/AdServices permissions. Unknown age is not asserted adult. Existing consentDecision still requires canRequestAds and applicable storage/basic-ad permissions; TFUA does not bypass this guard. This may restrict serving, especially in the EEA. Alpha/iOS flags are unchanged.

Official evidence:
- https://developers.google.com/admob/android/privacy/gdpr (UMP TFUA does not propagate to GMA)
- https://developers.google.com/admob/android/targeting
- https://developers.google.com/admob/android/interstitial (natural pauses, test ads, retire a shown creative)
- https://developers.google.com/admob/android/privacy/play-data-disclosure (GMA 25.5.0 data disclosure)

## Validation in progress

TypeScript and lint passed. Bank integrity check confirms frozen v71–v73 and active v74 files unchanged. Targeted ad/consent/round lifecycle/native client tests passed (49 before profile gate update; 51 after final targeted changes). Full suite initially found the strict profile allowlist correctly rejecting the two new profiles; validator was extended with exact reviewed profile constraints and its eight tests now pass. Final full suite, cloud QA APK, emulator acceptance and signed AAB checks remain pending.

Automated fixture covers five rounds/fifty real engine answers, correct/wrong/final timeout, durable save → ad → close → Results, new preload and non-advertising Home/Replay. This is SDK simulation, not physical Android evidence. Owner has no Android phone and authorized emulator acceptance. No physical acceptance is claimed.

The new production gate is closed pending exact QA APK/source acceptance. Old Alpha APK acceptance is not reused. No AAB, Play upload, live backend mutation or store publication has occurred.
