# Premium results and approved category artwork acceptance

Feature branch: `feat/approved-special-category-art`. Stacked on the Android preview work in PR #2; Home's source, shared artwork, theme tokens and assets are unchanged by this branch.

## Results

Five genuine isolated browser rounds were completed with 10, 8, 6, 4 and 2 correct answers. Their saved answers, exact statistics, titles, illustration selection and percentages were checked. Each round was captured in light/dark mode at 320, 360, 390 and 768 px (40 screenshots). This is per-round presentation, not a new permanent achievement or XP rule. Existing records, answer keys and reward calculation are unchanged. Server result badges consume server counts, including non-ten-question rounds.

## Categories (25 October 2026)

The owner's nine approved illustrations are mapped to the existing category/collection IDs in `assets/images/category-approved/README.md`. Exterior white backgrounds were removed; transparent PNG copies are at most 640 px. Original supplied sources are preserved outside Git, with hashes in the manifest. The older generated category candidates were unused and moved outside the worktree, not deleted; no pre-existing tracked artwork was removed.

All 15 illustrated cards use the same component, contained image viewport, corner geometry, gold border, title block and padding. Actual browser DOM measurements were identical within each size in both themes:

| Viewport width | All 15 card widths | All 15 card heights |
| --- | --- | --- |
| 320 | 134 | 209.03 |
| 360 | 150 | 228.54 |
| 390 | 165 | 246.83 |
| 768 | 354 | 270 |

Nine category mappings were checked in each of eight theme/size combinations (72 genuine screen captures). Additional normal/special comparisons were captured at 320, 360 and 390 px. No white rectangles or horizontal overflow were observed. The image viewport preserves composition with `contain`; labels are real text. The content list and action panel occupy separate flex rows above the safe-area/tab layout. The scroll viewport uses `minHeight: 0` and 24 px of end clearance, so the last card stays reachable without a large empty tail. Ready-question technical copy is hidden when a round can start; true unavailability/error messages remain.

Preview buttons now open a read-only explanation rather than a quiz. They are informational buttons, never selectable radios. The child preview was opened and closed in the browser; the existing `Karma · Kolay` selection remained unchanged. No content publication gate is changed. CI checks the same behavior for all nine previews and checks equal card dimensions and last-card clearance above the start panel.

## Validation and limits

- `pnpm check`: question integrity, TypeScript, lint, 307 tests, no skips.
- Web export passed; Android/iOS/web Expo JavaScript exports passed. These are not native APK/device acceptance.
- Six existing localhost SQL suites passed with rollback. Eight disposable-account localhost Auth/Edge deletion checks passed; the rollout flag was restored false and temporary synthetic accounts/credentials were removed. No production deletion or deployment was performed.
- Staged text secret scan found no credentials. Scanning Git's encoded PNG binary patch produced a false-positive token-like byte sequence in a newly generated trophy image; this was traced to the binary patch, not a source credential.
- OS reduced motion/static result views were tested in the browser. Physical Android/iPhone performance, native screen-reader and native cold-launch acceptance remain outstanding.
- CI browser acceptance is recorded by the PR check and downloadable artifacts. No claim of a new production release is made.

Local captures are kept outside the source tree in the task acceptance directory. The independent source-validation/editorial status of the 1,500 questions is not changed by UI tests. Account deletion readiness/approval steps are documented separately; the deletion implementation and production configuration are untouched by this feature.
