# Account deletion: review and approval gate

This is a readiness report, not authorization to deploy or erase production accounts.

## Observed hosted state (24 October 2026)

Target: existing Frankfurt development project `mqyuihiobkomjfipxehj`.
Only the published client configuration was used. No management/service-role credential was used and no production mutation was sent.

| Check                                                    | Result        | Evidence                                                                                                            |
| -------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------- |
| Published capability endpoint                            | PASS          | Read-only `online_service_capabilities` returned HTTP 200.                                                          |
| Deletion capability advertised                           | NOT READY     | The `accountDeletionEnabled` field was absent. Client treats absence as disabled.                                   |
| Deletion Edge Function available                         | NOT READY     | An OPTIONS request returned HTTP 404 / NOT_FOUND. No erasure request was sent.                                      |
| Hosted migration history, grants, server-managed secrets | NOT VERIFIED  | Management/SQL access was not used. Client-visible capability absence does not prove the precise migration history. |
| Production activation                                    | NOT PERFORMED | No migration, function deployment, flag, Auth, Vercel or user-data changes.                                         |

The reviewed implementation is still on the Android preview branch, not main. Production therefore cannot expose the prepared feature merely by changing a client button.

## Locally verified implementation

Eight real HTTP checks used two newly created disposable accounts on the existing localhost Supabase stack. They covered invalid JWT rejection, disabled rollout rejection, body actor override rejection, rejection of the other account's password, same-actor fresh password verification and atomic erasure, rejection of the erased JWT, preservation of the second account and rejection of a repeated erased-session request. Tests were followed by synthetic-account cleanup and restoration of the disabled rollout gate.

The separate SQL test validates that anonymous/authenticated clients cannot directly execute the service-only erasure RPC, erasure rolls back atomically on failure, shared match results remain viewable and the other player's immutable score/answers survive. Unit tests additionally reject anonymous/unconfirmed users, malformed/oversize input, unauthorized origins and failed erasure responses.

The function resolves the actor from Auth `getUser(JWT)`, not client input; binds fresh password authentication to that same verified actor; keeps the administrative key in the server runtime; returns success only after the service-only SQL operation reports completion. Passwords/tokens are not logged by the handler. Stored solo history/preferences are separate local records and are not silently cleared.

Limitations: this path requires an email/password account. OAuth-only deletion needs a separate fresh-identity proof before enabling any such providers. Auth/security log and backup retention need a documented policy; removing the primary account is not a promise to erase all operational logs/backups instantly. Native end-to-end UI deletion acceptance remains outstanding.

## Concrete rollout sequence — owner approval required first

1. Recheck the exact Frankfurt target and read-only installed function definitions, migration history, table grants and the `match_view` shape. Review the candidate migration against that installed schema; stop on unexpected drift. Review existing-user/score preservation evidence without exporting personal data.
2. Approve the backend migration `20261024000100_account_deletion.sql` specifically. It keeps the gate false; it makes selected historical identity links nullable and introduces a tightly scoped service-only erasure transaction. The migration must not accidentally include the separate live-room timing migration.
3. Deploy only `account-delete` with its explicit Auth verification configuration. Use server-managed Supabase keys, never an Expo/public environment variable. Confirm server secret availability without printing values. Keep CORS restricted to the intended exact origins; do not broadly trust arbitrary Vercel preview domains.
4. Test the deployed but disabled endpoint: origin handling, invalid JWT and body-actor rejection, then use separately authorized disposable staging accounts for the complete path. Do not erase a real user's account for acceptance.
5. Deploy the reviewed client/web routes only after separate publication approval. Verify `/account-delete` can be opened outside an installed app and preserves the intended sign-in redirect. Review public privacy/support contact and retention wording before treating it as a Google Play release requirement fulfilled.
6. After the above acceptance and owner approval, enable the flag. Keep the flag as the immediate rollback switch; do not reverse history by restoring erased personal data or force-pushing code.

There is no claim that production deletion is currently live, that all legal obligations are certified, or that the hosted grants/secrets have been fully audited.
