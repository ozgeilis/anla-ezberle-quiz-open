# Approved logo — limited Alpha update

The owner replied **“yayınla”** after PR #21 and the actual Android icon preview/test report. This authorizes publishing this approved logo update to the existing closed Alpha, retaining Turkey and the existing selected test audience. It does not authorize public Play Production, broader access, real ads, Analytics, Supabase changes or merging the unrelated #17/#18/#20 stack into main.

PR #21 was merged into its existing base `release/play-final-candidate-20261030` as `007ed07c538a774ca68612dd140482a0b0de9a00`. Main remains unchanged.

The source checks (378 tests, TypeScript/lint/question integrity), web export and Android/iOS resource prebuild passed. This build approval uses the prior accepted game APK as the unchanged gameplay-code baseline and the separately approved native icon preview for changed branding. It does not label the preview fixture as a full game APK or claim physical-device acceptance. Before upload, the new actual AAB must pass signature/identity/version/permissions/resource verification and emulator testing of a locally derived QA APK.

Expo Free Android quota was checked: 15/15 used for 1 October–1 November. No paid plan/overage is authorized. A **local** EAS build with the existing frozen EAS upload credentials will be attempted; no new key/signing identity. The one-build gate is opened only for this source snapshot and will be reclosed after the attempt. No automatic submission.

The store icon update will use the exact `store/google-play/icon-512.png` from PR #21. Existing screenshot/copy/billing/privacy/Data Safety/test-access settings and closed push rules remain unchanged. The existing Play review flow and managed-publishing setting are retained. New legal, credential, payment or broader-access requirements cause a stop.

At preparation time, the browser tool still reports local browser access disabled despite the owner's enablement response. Console state and publication cannot be asserted until actual access is restored.
