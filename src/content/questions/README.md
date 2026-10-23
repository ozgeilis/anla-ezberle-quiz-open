# Question content boundaries

## Current local game: v72 / 1,500 questions

`questions-v72.ts` is the canonical, self-contained **current** data file. All 1,500
records are literal objects in that file; its only import is the `Question` type.
The earlier `questions-1500.ts` is frozen as the v71 historical snapshot.
There are no runtime fetches or content-fragment imports. `index.ts` preserves
`questions`, `questionById`, `Question`, `BANK_VERSION = 72`, and channel filtering.
Exactly 30 rote Quran metadata questions were replaced at their original positions
with 30 owner-authorized meaning-focused questions from `release-v72-meaning.ts`;
eight other prepared candidates remain unpublished.
Source/review metadata is reproduced exactly; consolidation is not fact checking
or independent religious expert approval.

## Historical compatibility

`archive/bank-v1.ts` through `archive/bank-v70.ts` are immutable historical banks
needed to read saved rounds. `registry.ts` resolves each version separately and
applies that round's saved option order. Version 71 resolves the frozen `questions-1500.ts` file, and version 72 resolves
`questions-v72.ts`.
`archive/bank-v71.ts` remains the frozen pre-consolidation reference for deterministic
generation and comparison, not the current app entry point. Historical wording,
option IDs, order, keys, difficulty, sources and metadata must not be replaced
with current values. No save migration or storage-key change is required.

The small version-composition modules are intentionally retained: they share
records across snapshots and depend on historical `published-*`, `candidates-*`,
calibration and correction modules. Removing them would break saved games,
frozen server exports or regression evidence. Only import paths were changed.

## Editorial and draft modules

`published-v*.ts` retain versioned additions/corrections and some learning-topic
maps. They are archive/test/taxonomy inputs, not the current bank entry point.
`candidates-*`, `learning-*-drafts-*`, seasonal and editorial catalogs remain
distinct development inputs. A module's presence or a source-check flag does not
publish it. Do not infer new approval or add draft content during maintenance.
`model.ts` is unchanged.

## Online boundaries

- `scripts/live-content.ts` still uses frozen `archive/bank-v41.ts` (600).
- The older private owner-v13 exporter still uses `archive/bank-v13.ts` (500).
- The 20 synthetic async-duel questions in Supabase fixtures are unchanged.
- Nothing here changes a remote dataset, Auth, RLS, functions or configuration.
  Do not send local answer keys to competitive public endpoints. Existing private
  SQL exporters must write outside the Expo tree; never commit their SQL output.

## Reproduction and safe updates

```sh
pnpm questions:generate   # reproduce canonical v71 from the frozen archive
pnpm questions:check      # fails on stale output or changed v71 baseline
pnpm exec tsx scripts/question-dependencies.ts
pnpm check
pnpm exec tsx scripts/audit-published-questions.ts
pnpm export:web
```

Generation creates both the frozen v71 snapshot and the current v72 snapshot,
and is offline and deterministic, with stable property/array order and
explicit `undefined` support. No explicit undefined values were present in v71;
the serializer must nevertheless distinguish them from omitted fields.
`tests/fixtures/content/pre-consolidation-v71.json` pins all 71 original banks.
Do not regenerate that manifest to make a failed integrity test pass.

A future approved release must freeze the current canonical file as its historical
snapshot first, introduce a new bank version and named canonical file, preserve
all prior archives, and update the generator's explicit source/version/count and
new-release digest only after review. Never edit an archived question in place.
Update the current entry and registry together, add compatibility fixtures, run
the dependency audit before deleting anything, and rerun all checks. A local bank
release never authorizes an online content rollout.

## Quran v72 editorial release

- The 30 retired IDs are `e150-quran-001` through `e150-quran-030`. v71 snapshots and saved rounds retain their original wording, answer keys and XP.
- Source-check evidence and 38 candidate draft records: `docs/content-editorial/quran-38-kaynak-dogrulama-2026-10-22.md` and `docs/content-editorial/quran-anlam-odakli-38-taslak.json`.
- Authorisation here is owner/source-based and is **not independent religious-expert certification**. Current v72 content uses `reviewStatus = approved` in the owner-authorized editorial channel.
- The older private live exporter still references v41 / 600 and has **not** been migrated. Publishing this code to web does not migrate Supabase online rooms.
