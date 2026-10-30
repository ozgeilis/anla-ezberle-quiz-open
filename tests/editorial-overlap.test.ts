import assert from "node:assert/strict";
import test from "node:test";
import {
  editorialOverlap,
  overlapSnapshot,
} from "../scripts/editorial-overlap";
import { questionsV73Candidate } from "../src/content/questions/questions-v73.candidate";

test("Overlap suggestions stay pending until explicitly reviewed; changed content invalidates the decision", () => {
  const a = questionsV73Candidate[0]!;
  const b = { ...a, id: "overlap-review-probe" };
  const pending = editorialOverlap([a, b], []);
  assert.equal(pending.pendingPairs, 1);
  assert.equal(pending.individuallyReviewedPairs, 0);
  assert.equal(pending.repeatedFactPairs, 0);
  const decision = {
    a: a.id,
    b: b.id,
    snapshotSha256: overlapSnapshot(a, b),
    verdict: "repeated-fact" as const,
    reason: "Aynı kök ve aynı bilgi.",
  };
  assert.equal(editorialOverlap([a, b], [decision]).repeatedFactPairs, 1);
  assert.throws(
    () => editorialOverlap([a, b], [decision, decision]),
    /Repeated/,
  );
  assert.throws(
    () =>
      editorialOverlap(
        [a, { ...b, question: b.question + " Değişti." }],
        [decision],
      ),
    /re-review/,
  );
});
