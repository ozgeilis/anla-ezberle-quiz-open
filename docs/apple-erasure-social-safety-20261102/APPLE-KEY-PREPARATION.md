# Next separate approval: Apple server key preparation

Date: 2 November 2026. PR #26 remains draft. The closed Frankfurt backend
preparation is already applied; do not repeat its migrations/deployments.

## Exact proposed scope

- Apple Team `W7CRC43SHP`, existing primary App ID
  `com.kovynelstudio.anlaezberle` only.
- Create a named `Anla Ezberle Apple Auth 20261102` key with **Sign in with
  Apple only**, bound to this primary App ID. No APNs, App Store Connect API,
  DeviceCheck or other service on this key. The owner completes the final
  credential creation step in Apple Developer.
- Download its one-time P8 to a private local directory outside the repository;
  never print its contents, send it to chat, or place it in a public environment.
  Transfer it only to the existing Frankfurt `account-delete` server secrets.
- Configure `APPLE_TEAM_ID`, `APPLE_KEY_ID`, `APPLE_PRIVATE_KEY`, a generated
  32-byte AES key map `APPLE_DELETION_ENCRYPTION_KEYS`, and
  `APPLE_DELETION_ACTIVE_KEY`. Keep `APPLE_ACCOUNT_DELETION_ENABLED` false.
  No application/public environment contains the P8 or encryption key.
- Install the already reviewed `apple-deletion-retention.sql` operation
  (SHA256 `edd96d5ab78486f524bc4dc6fda4338dd4d876825f3edfd6cac29fe722659da8`)
  and verify a successful tick. It purges only expired private deletion jobs;
  no user/profile/game/score rows are targeted. It creates no public RPC grant.

## Explicitly outside this approval

Apple provider activation, OAuth/deletion/revocation/signup flags, allowlist
changes, account creation/deletion, moderator enrollment, player-safety flag,
TestFlight build/upload/distribution, main merge, Alpha changes and public push.
Those require their own concrete acceptance scope. Do not mark real Apple
login/revocation/Private Relay as passed after this key-only preparation.

## Validation and recovery

Verify Team/primary App ID in the final Apple summary before owner registration.
Verify secrets by existence/configuration checks without exposing values. Repeat
anonymous Edge 401 and closed capability checks. Verify no pending deletion jobs
and current row counts. If a key/configuration differs, stop before activation.
A newly unused key may be revoked only on a separate owner-approved action;
do not revoke any pre-existing key. Disable/unschedule the new retention job
if its observed execution differs from the reviewed SQL. Preserve encryption
keys while any unexpired retry job exists; never silently rotate them.

The later real acceptance must cover same-actor Apple proof, cancelled sign-in,
persistent session, token revocation plus verified erasure, retries, linked
Google/email accounts, Private Relay and exact expiring test admission. Existing
real application accounts must not be reused for deletion tests.
