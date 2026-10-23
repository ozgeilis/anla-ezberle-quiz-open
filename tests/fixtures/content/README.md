# Pre-consolidation evidence

Captured before moving any bank or switching the entry point, from main
`9f5667e` plus PR #61 at `ca4b645c9ef408d0484cadd40229ffb5cc3508a4`.
No real user data is included. The five rounds use a synthetic local profile and
fixed timestamps, six correct answers and four incorrect answers.

- `pre-consolidation-v71.json`: count and SHA-256 for every bank v1–v71.
  Reproduce each digest with
  `createHash("sha256").update(questionSnapshot(bank)).digest("hex")`.
  The ordered literal serializer is `scripts/question-snapshot.ts`; it preserves
  own undefined fields, unlike JSON. Verify the same serializer against the
  baseline commit's banks to independently reproduce the manifest.
- `saved-rounds-v1-v71.json`: complete stored rounds and expected resolved
  questions, stats and progress for v1, v13, v31, v41 and v71. Modern rounds
  deliberately reverse their option order; legacy v1 uses its original format.

The manifest is an independent checked-in baseline, not generator output to
refresh whenever content drifts. Tests compare full data and all digests, not
just counts or answer text. Changes require an intentional new content version.
