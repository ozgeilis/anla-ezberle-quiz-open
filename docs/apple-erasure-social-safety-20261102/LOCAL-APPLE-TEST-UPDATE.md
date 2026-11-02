# Local iPhone candidate update before real Apple acceptance

2 November 2026. Proposed correction to the approved single-actor Apple trial;
**signing and installation await separate owner approval**.

## Verified need

The installed acceptance application uses an embedded Release bundle. Launching
the Metro URL did not connect it to port8111. The prior test plan's development
client assumption was incorrect. No real Apple test account has been created.
Apple provider, all four Apple capability flags and the server deletion flag
were restored to disabled while preparing this correction.

## Exact proposed operation

- Source PR26 `4071a90074a594e9d80e02ab35d71bc63c2db551` (subsequent changes
  confined to these evidence/plan documents). Export the current production-channel
  iOS JavaScript/assets with public Frankfurt client configuration and ads off.
- Use a **copy** of the retained native Release app from the previous accepted
  iOS build2 archive. PR25-to-PR26 native configuration and runtime dependencies
  are unchanged; only the server/test development dependency `jose` was added.
  Replace embedded JavaScript/assets in the copy; retain native executables,
  identity, URL schemes, version/build and existing development entitlements.
- Re-sign only that local copy using the existing Apple Development identity and
  existing `Anla Ezberle Development 20261101` provisioning. Verified Team
  `W7CRC43SHP`, bundle `com.kovynelstudio.anlaezberle`, registered iPhone,
  matching certificate, expiry1 November2027, Apple Default and development APNs.
  Do not create/export a private key, certificate, profile or capability.
- Verify the signature, profile, native binary hashes, exact exported bundle hash,
  required assets and absence of added permissions before installation. Stop on
  identity/entitlement mismatch or missing native support.
- Install as an update to the same existing iPhone app without uninstalling,
  clearing storage or migrating/resetting local progress. Compare the existing
  visible XP/badges/history before and after. Same identity preserves its sandbox;
  verification is required rather than assuming data survival.
- Reopen the approved one-account Apple trial only after the candidate is verified;
  follow its empty-allowlist denial, exact relay admission, real login/persistence,
  fresh proof, owner-confirmed deletion/revocation and closed-state restoration.

## Explicit exclusions

No IPA/App Store Connect upload, TestFlight distribution, new EAS build, Android
binary/release, main merge, Alpha/tester change or additional live migration.
The TestFlight/store acceptance gates remain closed. This local artifact is for
the one-account physical iPhone test, not a new store release.

The existing `developmentBuildApproved` guard will be opened only after this
specific owner approval, validated for the existing ios-development profile,
then reclosed. The prior PR25 build approval is not reused as approval for PR26.

## Prepared evidence, before signing

- iOS Hermes export completed successfully from PR26; bundle SHA256
  `3d7b11b37e53de1cb332294051b03be1ca8b7fabcba0d26b5103e5c9e21852c4`.
- Separate local candidate copy prepared; original archive untouched. Main native
  executable remains byte-identical, SHA256
  `476c412eb07c13e4e478f9b495187cb6a02705899799e1a72d0cd6dbfa56d501`.
  This copy has **not** been re-signed or installed and is not an accepted artifact.
- Existing PR26 GitHub checks at `4071a90`: content-check, leaderboard SQL/Edge,
  leaderboard UI, Vercel and preview comments all passed. No native Apple trial
  has occurred, and no real Apple session/revocation acceptance is claimed.
- Hosted rollback verified: public Auth settings report Apple disabled; database
  oauth/deletion/revocation/signup flags are all false and Apple identities remain0.
  Secret flag digest equals SHA256(`false`),
  `fcbcf165908dd18a9e49f7ff27810176db8e9f63b4352213741664245224f8aa`.
  Existing approved server key and retention cron remain in place.
