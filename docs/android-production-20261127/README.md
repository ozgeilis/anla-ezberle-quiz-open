# Android first Production candidate — 2026-11-27

Base: integration/ios011-native-source-20261126 at b172111ef16071c3d7bead97e3ce2372bb8cf692. Main remains 1c6a3d876a4ae01661feff22db5823cad4c1b926. Work is isolated on release/android-production-20261127; no main merge or Play Production upload is authorized by this preparation.

## Verified inventory

- Play Production access is granted. Production has no release. Existing Alpha 0.1.0 (6) remains distributed; highest Play and EAS Android versionCode is 6. Candidate number 7 is not yet built/reserved.
- Permanent package com.kovynelstudio.anlaezberle and existing signing credentials are retained.
- Existing Android AdMob app ca-app-pub-9642662711398587~8836643534 had no active units. Owner created Android Ana Sayfa Banner /6077280493 and Android Tur Sonu Geçiş /8188438512. App still needs its public Play store association and AdMob review; limited serving is not fixed by client code.
- Android Google uses the existing browser PKCE flow, not the Apple-only local GoogleSignIn module. Backend settings remain unchanged. Read-only hosted checks on 2026-11-27 confirm registration/deletion and Google OAuth/signup/deletion enabled; actual Android sign-in acceptance still remains pending.
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

The new production gate is closed pending exact QA APK and payload verification. The source hash excludes only its own acceptance record and documents, so it works without .git and cannot require a self-referential commit SHA. Old Alpha APK acceptance is not reused. No AAB, Play upload, live backend mutation or store publication has occurred. The user has authorized one AAB only after readiness; Play upload/review still requires final approval.

## Additional verified state

- Full suite: 506/506 passed before the build-hook-only payload gate update; 13 targeted profile/source-gate tests passed after it. TypeScript/lint passed. No question or gameplay records were edited.
- First cloud request 8403a9c0 was canceled while still queued because EAS local config resolved the old version; no APK/AAB produced. Explicit ANDROID_BUILD_TARGET now makes local/worker resolution agree. QA request 71492ce9-b661-4645-b089-220beee825cb uses source 5d839100, version 0.1.2/code 6, official sample ads, reused managed signing. Its job is in progress; no Production AAB has started.
- QA source differs from the later branch only by the release acceptance hook/hash, policy prose, a comment, tests and docs. No ad/game/Auth native behavior was changed after this QA snapshot.
- Existing AnlaAdsTest36 installed APK is signed with SHA256 FAC61745DC0903786FB9EDE62A962B399F7348F0BB6F899B8332667591033B9C (different from the Play upload identity). It was backed up without data changes; no incompatible update or uninstall was attempted. Other Anla AVDs remain untouched.
- Emulator start became blocked by low disk (approximately 1.2 GiB available); both AnlaAabValidation36 and AnlaClosedTest36 refused to boot. Owner has been asked to free space; no simulator, key, worktree, iOS package or user data was deleted. No Android UI/physical success is claimed.
- Live read-only backend proof: online_scope/live_dataset bank-v74, live_enabled/content_approved true, 3000 online rows/live rows/answer keys. No new migration or flag changes performed.
- Play declarations currently say contains ads and does not use advertising ID. Target audience is 13–15, 16–17, adults; existing IARC regional ratings are retained (PEGI12/IARC12+, ESRB13+). The technical manifest must still be verified in the built artifact.
- Data Safety corrections and website mismatch: see DATA-SAFETY-REVIEW.md. The in-app Android policy paragraph is prepared on this branch; live web policy has not been deployed/merged. Store metadata still needs final current-candidate evidence/screenshots before Production.
