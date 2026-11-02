# Unready game-card visibility — 2 November 2026

Base: remote main `89f6ba46255b0a611544cf764ceb4fc18ca775cd`.
PR #24 is merged; PR #25 remains separate/draft at `bdcac7a`.
The owner explicitly authorizes this focused feature's main merge, a new
existing-Alpha submission and a conditional safe internal TestFlight build.
No live Supabase, Google Groups, public App Store or Play Production change.

## Behaviour

Removed the unfinished category-preview renderer, its no-op callbacks/details
and reserved child-card spacer. Category eligibility still comes from the
existing engine and reviewed bank, shared by Android, iOS and web.
`visibleCategoryOptions` filters only catalogue display; raw assessment,
question IDs, historical category identities and all artwork/manifests remain.
No date flag can publish a draft. Unsupported/child/seasonal subject links to
`/prepare` return to the usable catalogue; they never start a mixed game.

Hidden: Ramazan, Kadir Gecesi, Ramazan Bayramı, Kurban Bayramı, Hac Mevsimi,
Muharrem ve Aşure; the draft Peygamberimizin Hayatı and Kadın Sahabeler
collections; Çocuklar İçin preview. Their review/content files remain intact.
The active broad Peygamberimizin Hayatı ve Sahabe category remains playable.

Visible: Kur'an ve Dualar, Peygamberimizin Hayatı ve Sahabe, Peygamber Kıssaları,
İbadet ve Fıkıh, İman ve Ahlak, İslam Tarihi ve Medeniyeti, plus Karma.
A difficulty filter hides any category unable to supply an independent round
(e.g. current hard İman/Ahlak pool), without deleting questions or changing
existing difficulty labels/history. No change to home actions or game rules.

Future activation requires explicit editorial publication, reviewed independent
content, real route/engine support, tests and release approval. Merely reaching
a calendar date or adding an illustration does not activate a collection.

## Validation

- `pnpm check`: 399/399; TypeScript, lint and immutable question checks pass.
- `pnpm export:web`: PASS.
- New behaviour tests cover each category/difficulty, empty/insufficient pools,
  restored playable content, unpublished/child/malformed links and valid legacy
  links. Existing history/XP/v71/v72/v73 and seasonal draft regressions pass.
- Real Chrome responsive view: 320/360/390 dp dark; 320/390 viewport PNGs saved.
  Open/light theme 360 dp also captured. Android runs light and iOS runs dark.
- Real Android 14 emulator: new release Hermes JS embedded in the unchanged
  previous debug QA native shell; installed with `adb install -r`, no uninstall
  or data reset. Home retains 30 XP and prior score; six-category view opens.
  Hidden-child deep link returns to the catalogue with no start action, confirmed
  from real UIAutomator output. This QA APK is not the signed store AAB or a
  Play-installed acceptance.
- Real iOS 27 simulator/390pt: same new release JS in a copied existing Release
  simulator native shell, ad-hoc local signing only. Home retains prior 10 XP;
  six-category catalogue and Kur'an/easy preparation work. No physical device
  or real Apple OAuth/revocation acceptance is claimed.
- Screenshot folder contains actual browser/native renders, not mockups.

## App Review and remaining security gate

[Apple App Review 2.1](https://developer.apple.com/app-store/review/guidelines/#app-completeness)
requires complete, functioning review submissions; hiding unfinished entry cards
addresses this specific issue, not an App Store approval guarantee.

Apple erasure/revocation and shared moderation live in a separate stacked PR,
with closed defaults and pending real Apple/hosted acceptance. No permission to
apply those live security changes is inferred from this release instruction.
A build with unresolved required security must not be forced into TestFlight
internal distribution. Keep this gate explicit in the final delivery.

## Observed store state before new submission

Play publishing overview: Alpha `0.1.0 (5) - 20 saniye ve giriş düzeltmeleri`
is **under review**, not verified available. Source `ba47975f7976954fc51339b3b722424b7ac0f57e`,
EAS build `6e07ccb8-b259-4d18-9965-8e2c249aebf7`, recorded AAB SHA
`3ebf000c7291269663a41dd1d0e631d06d77e35bf3f2943d425f6c2292022ae9`.
Preserve active Alpha/list/participation; do not revive Google Groups.

Apple existing uploaded build: `0.1.0 (2)`, permanent bundle
`com.kovynelstudio.anlaezberle`, Team `W7CRC43SHP`, Connect `6829516832`;
previous processing ready for internal testing but no assigned group.
These earlier artifacts do **not** contain this new visibility fix.
New artifacts, upload/review/availability states must be recorded separately.
