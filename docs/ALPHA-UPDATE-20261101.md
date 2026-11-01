# Alpha update — 1 November 2026

## Owner direction

The owner designated the existing **Alpha** as the main closed test, requested
retirement of the Google Groups track, and authorized today's changes to main
and closed testing. This supersedes the prior read-only audit restriction for
these specific operations. It does not authorize public Play Production,
new Auth policies, general Google signup/push, real ads, Analytics, or tester
list changes.

## Verified pre-update state

- Remote main: `b0d5c383489228111d40556cf556a9d6a34e24b9`.
- PR #22: `44a55eb3bfd02ec99c1e2710558268c67147a2c9`, open draft.
- PR #23: `8093c409204c19ec84bc606d764021053618b557`, open draft,
  includes #22, release `31e1278`, and all approved branding/release work.
- Both feature HEADs equal GitHub remote HEADs. All existing worktrees clean.
- Alpha track `4700576532370978005`: active `0.1.0 (2) - Alpha kapali test`,
  published 31 October 14:25 as displayed by Console. Selected email list
  `test` contains 20 addresses; Alpha currently shows 9 countries/regions.
  These observed settings were not changed during audit.
- Additional track `4697276437845687698`, actual name `anla-ezberle`:
  Google Groups `anlaezberle-test@googlegroups.com`, unpublished draft
  `0.1.0 (2) - Google Gruplar kapali test`, 178 countries/regions displayed.
- Console lists exactly one uploaded artifact: `2 / 0.1.0`, uploaded
  31 October. Its source is `8d13fc26b2c68a209970ac226dfb2a6a1d650c59`,
  AAB SHA-256 `7cfdf8d109350ddd8cb81360e90abd9a48b2317a2b0ae421b917ba95a57ffd1a`.
- The separate logo-only code4 AAB exists locally but is not uploaded.
  It has the same runtime JS as code2, without today's fixes.
- Production-access panel marks the 12-opt-in requirement complete but the
  continuous 14-day requirement incomplete. Exact current participant count
  and membership of each historical tester are not exposed by that panel.

## Why an updated client is required

The published code2 has 10-second solo timing and flat 250-XP display levels.
Hosted migrations already provide new 20-second matches/rooms and progressive
server levels. New async create/accept requires timingVersion=2, which code2
does not send. The new client negotiates v2; old historical matches preserve
their old timing. This is a source-verified compatibility gap, not a test
performed against a real user's account.

Google Cloud remains External/Testing with only the authorized business test
identity. The hosted signup allowlist is empty and global Google signup=false.
Publishing the corrected client will not by itself permit arbitrary new Google
accounts; any allowlist/policy expansion requires a separate controlled decision.

## Acceptance evidence

- Fresh audit run `pnpm check`: 396/396, TypeScript/lint/question integrity PASS.
- Hosted 20-second defaults/constraints, migration history and Edge v18 reread.
  The 10/15/20 room CHECK intentionally preserves historical room rows.
- Pure hosted level function: 0/99=1, 100=2, 210=3, 330=4,
  1260=10, 16660=50, 57330=99, 58410=100; cap/negative values pass.
- QA APK SHA-256 `26e3b4892c8fbbf627d53b5ce78ea980816af24e6345178f733baa8dae2aa014`,
  `com.kovynelstudio.anlaezberle`, 0.1.0/local code5, debug-signed emulator QA.
  This is not a Play-installable upgrade or the upload AAB.
- Real hosted fresh Gmail -> Chrome -> native automatic Profile, session
  persistence and owner-completed safe deletion pass. Google successful login
  was tested before final error-handling edits; final denial UX passes.
- Real hosted friend acceptance/invite accept/later and 13.67-second answer
  with one answer row pass. Prior native fixture layout matrix: 18 cases.
- Physical Samsung/iPhone, final Google happy path and current native password
  reset remain unaccepted. No claim of physical or Play-signed runtime testing.
- Sources/recorded screenshots: `xp-notifications-20261101/acceptance.md`,
  `hosted-fresh-email-native-result.json`, `direct-correction-deployment-result.json`.

## Concrete release operations

1. Preserve Alpha email list, participants, countries and existing active code2.
2. Retire only the unpublished additional Google Groups workflow; record the
   actual Console result. Do not delete the Google Group itself or its members.
3. Integrate the complete tested #22/#23 source on this isolated release branch;
   no duplicate merge of the older #13 source over the new callback code.
4. Existing store-build guard requires owner acceptance of the exact current
   QA artifact for `ads-closed-test`; record that acceptance before opening the
   one-build gate. Prior code2/logo build approval is not reused.
5. Use only existing frozen Android signing credentials, existing EAS preview
   client configuration and official test ads. No paid quota or new key.
6. Produce a fresh higher-versionCode AAB, verify manifest/certificate/16KB/
   resources/source, and test the actual AAB-derived package in the emulator.
   Reclose the build gate. Do not upload the old code4 logo-only artifact.
7. Merge this integration PR to main after checks. Main's existing Vercel
   integration may deploy automatically; verify the actual deployment.
8. Upload only the verified new artifact to existing Alpha and submit the
   focused update. New legal, financial or expanded security prompts stop the
   operation. Do not touch public Play Production or additional test audiences.
9. Report uploaded / draft / under review / available as distinct states;
   Google review completion is not under agent control.

No new live Supabase migration is part of this release operation.

## Current owner approvals

The owner accepted the exact QA APK evidence for one new `ads-closed-test`
AAB (reply: "Bu APK kanitiyla Alpha AAB'sini uret"). Physical Samsung/iPhone
acceptance is explicitly absent. The prior general direction authorizes main
integration and submission to the existing Alpha, not public Play Production.
The owner separately approved deletion of only the unpublished Google Groups
draft. The Google Group and members must not be deleted.

EAS account usage reread on 1 November: Free plan, Android 0/15 used in the
1 November–1 December cycle. Remote Android versionCode before this build: 4.
No paid build, billing change or signing-key rotation is authorized.

## Preparation results

- Owner-confirmed Google Groups draft deletion completed. Console now shows
  no release and an inactive additional track; the empty track record remains
  in Console. Alpha remains active. The Google Group and members were not
  deleted; the Alpha list/countries were not modified.
- Authorized EAS build `6e07ccb8-b259-4d18-9965-8e2c249aebf7`, source
  `ba47975f7976954fc51339b3b722424b7ac0f57e`, `ads-closed-test`, 0.1.0/code5,
  started 1 November 16:13 UTC. The one-build gate was reclosed immediately
  after snapshot capture. It is not an upload or publication result.
- Full main-targeted CI uncovered stale integration assumptions: direct-duel
  regression calls omitted timingVersion=2; the security inventory rejected
  the reviewed private/expiring Google test allowlist email column; the inbox
  test counted its action before the separate friend fetch completed.
  Test harnesses now exercise v2, explicitly reject legacy new-match acceptance,
  require a 20-second server deadline, retain all cross-user/RLS assertions,
  allow only that exact server-only expiring address column with read-only
  Auth-hook privilege, and wait for the actual actionable card state.
  No app or server runtime source changed after the approved build snapshot.
  Rollback-only security SQL passed on the migrated isolated local stack.
  All GitHub checks must pass before merge; failed runs are not hidden.

## Artifact verification before upload

EAS build finished 1 November 16:31 UTC. Actual AAB code5 SHA-256:
`3ebf000c7291269663a41dd1d0e631d06d77e35bf3f2943d425f6c2292022ae9`.
The package/scheme/upload certificate are unchanged; target36, all52 native64
ELF files and bundle alignment pass16KB checks. Hermes bytecode is exactly the
owner-accepted QA APK bytecode. Native cloud binaries were rebuilt and are not
claimed byte-identical to the local QA build. Static byte scanning initially
joined adjacent Hermes strings after the SDK literal `sb_secret_`; decoded
Hermes string-table scanning verified that this was not an embedded secret.

The actual AAB-derived universal APK, signed only with the existing isolated
local debug key, updated the Android14 emulator without uninstalling it. Prior
20XP/score200 remained. An actual ten-question round completed: a fresh question
showed20s, background time reduced the deadline (20 ->13), a response after12s
was accepted, and the result displayed the full score without an empty-game
interstitial observed by the UI sampler. This is sampling, not proof of every
video frame; earlier detailed transition acceptance remains separately recorded.
The new local result added10XP; Profile correctly showed30/100XP and total300.
No hosted account was created. Physical-device and Play-signed runtime acceptance
remain absent. [Artifact details](alpha-update-20261101/artifact-evidence.json),
[native events](alpha-update-20261101/native-smoke-result.json) and screenshots
are retained alongside prior hosted Auth/inbox evidence.

The canonical CI test now follows config.toml's local project_id. Its account
erasure regression also requires the real Storage schema; CI enables only its
throwaway local Storage service before startup. The repository/hosted Storage
configuration is unchanged. No synthetic substitute table or weakened erasure
assertion was added. All checks must be green before main integration/upload.
