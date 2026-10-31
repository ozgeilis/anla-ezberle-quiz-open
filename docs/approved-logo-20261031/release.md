# Approved logo — limited Alpha update

The owner replied **“yayınla”** after PR #21 and the actual Android icon preview/test report. This authorizes publishing this approved logo update to the existing closed Alpha, retaining Turkey and the existing selected test audience. It does not authorize public Play Production, broader access, real ads, Analytics, Supabase changes or merging the unrelated #17/#18/#20 stack into main.

PR #21 was merged into its existing base `release/play-final-candidate-20261030` as `007ed07c538a774ca68612dd140482a0b0de9a00`. Main remains unchanged.

The source checks (378 tests, TypeScript/lint/question integrity), web export and Android/iOS resource prebuild passed. This build approval uses the prior accepted game APK as the unchanged gameplay-code baseline and the separately approved native icon preview for changed branding. It does not label the preview fixture as a full game APK or claim physical-device acceptance. Before upload, the new actual AAB must pass signature/identity/version/permissions/resource verification and emulator testing of a locally derived QA APK.

Expo Free Android quota was checked: 15/15 used for 1 October–1 November. No paid plan/overage is authorized. A **local** EAS build with the existing frozen EAS upload credentials will be attempted; no new key/signing identity. The one-build gate is opened only for this source snapshot and will be reclosed after the attempt. No automatic submission.

The store icon update will use the exact `store/google-play/icon-512.png` from PR #21. Existing screenshot/copy/billing/privacy/Data Safety/test-access settings and closed push rules remain unchanged. The existing Play review flow and managed-publishing setting are retained. New legal, credential, payment or broader-access requirements cause a stop.

The direct browser API reported disabled. The documented native Chrome application interface is available; actual Console access was restored through it after the owner relinquished concurrent control. No login or browser warning was bypassed.

Current Console selection was read before changes: Turkey only; selected `test` list now contains **7 addresses** (previous first-release snapshot had 2). Dashboard shows **4 opt-ins**. These existing values were not modified by this work; this is not a new audience expansion by the agent. Addresses are not stored in Git.

## Actual local build and validation

- Source `d00efc0`, profile `ads-closed-test`, version **0.1.0 / code4**, target36. The first packaging attempt stopped before compilation because `npm` was absent; remote version3 was reserved but no version3 artifact exists. Installing npm as an isolated developer tool allowed the retry. No application dependency or paid build changed.
- AAB SHA256 `074bac0ef7077a7c7c99deb3c69c5f85de452e136f10de6a4940bcc7d0780f51`, 85,945,280 bytes. Local build SUCCESS, same upload certificate as published code2; bundletool/JAR signature/manifest and all 52 native64 16KB LOAD alignments PASS. Permissions exactly match code2; Advertising ID/AdServices remain blocked.
- Actual Hermes bytecode **identical to published code2**; no gameplay/runtime JS edits. Native source/lockfile unchanged; 22/52 native64 files differ after local macOS rather than cloud Linux compilation; this is reported, not claimed binary-identical.
- All **15 actual AAB launcher/round/adaptive mipmaps** match the approved native prebuild pixel-for-pixel.
- Derived universal QA APK ZIP16KB alignment PASS. Updated the existing isolated API36 emulator game with `adb install -r`, retaining guest **score100 / XP10**. All five tabs opened, no new fatal entries. [Actual installed game icon](actual-code4-icon.png), [retained guest home](actual-code4-home-preserved.png). This is the real new AAB-derived game, distinct from the earlier icon-only fixture.
- Physical Samsung/iPhone and Play-signed runtime acceptance remain untested; no real device/application data was removed.
- `expo-doctor`: **19/20**; 5 newer SDK patch versions recommended. The tested published dependency lockfile was deliberately retained for this icon-only release. It is not reported as 20/20. Source check remains 378/378; current identity/build-gate regressions **10/10** PASS.
- Build gate reclosed after source snapshot (`9817e8d`), preventing another unrelated build. [Structured artifact evidence](code4-aab-evidence.json).

Play upload/submission state will be recorded below only after actual confirmation.

The owner explicitly confirmed that this newly supplied logo was AI-generated/edited. The new icon is labelled accordingly; the existing other seven asset labels remain selected. This is source provenance, not a claim that the integration generated a new design.

The new 512×512 Play icon and its eight asset labels were saved successfully: Console confirmed “Değişiklik kaydedildi. Yayınlama özeti sayfasından incelemeye gönderin.” Existing store title/copy, feature graphic and six screenshots were preserved. Not sent separately; the native AAB will be included in the same final submission.
