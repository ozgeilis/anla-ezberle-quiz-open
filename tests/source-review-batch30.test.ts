import assert from "node:assert/strict";
import test from "node:test";
import { questions } from "../src/content/questions";
import review from "../docs/source-verification/evidence/v71-batch-30-1451-1500.json";

test("manually source-read v71 batch 30 covers exactly canonical questions 1451–1500", () => {
  assert.equal(questions.length, 1500);
  assert.equal(review.bankVersion, 71);
  assert.deepEqual(review.range, [1451, 1500]);
  assert.equal(review.count, 50);
  assert.equal(review.entries.length, 50);
  assert.equal(new Set(review.entries.map((entry) => entry.id)).size, 50);
  for (const [offset, entry] of review.entries.entries()) {
    const q = questions[1450 + offset]!;
    assert.equal(entry.position, 1451 + offset);
    assert.equal(entry.id, q.id);
    assert.equal(entry.question, q.question);
    assert.equal(entry.correctOptionId, q.correctOptionId);
    assert.equal(
      entry.correctAnswer,
      q.options.find((option) => option.id === q.correctOptionId)?.text,
    );
    assert.deepStrictEqual(entry.allOptions, q.options);
    assert.deepStrictEqual(entry.recordedSourceUrls, q.sources.map((source) => source.url));
    assert.ok(entry.independentlyOpenedSourceUrl.startsWith("https://"));
    assert.ok(entry.finding.trim().length > 40);
    assert.ok(entry.checkedOn);
    assert.equal(entry.sourcePassageFullyOpened, true);
    assert.notEqual(entry.verdict, "unchecked");
  }
  const counts = Object.fromEntries(
    [...new Set(review.entries.map((entry) => entry.verdict))].map((verdict) => [
      verdict,
      review.entries.filter((entry) => entry.verdict === verdict).length,
    ]),
  );
  assert.deepStrictEqual(counts, review.verdictCounts);
  assert.equal(
    review.entries.filter((entry) => entry.verdict === "verified").length,
    46,
  );
  assert.ok(review.entries.some((entry) => entry.id === "q70-gazzali-sam" && entry.verdict === "needs-context"));
  assert.ok(review.entries.some((entry) => entry.id === "q71-kurban-vek" && entry.verdict === "verified-add-source"));
  // Other 1,450 question IDs remain outside this manual external-reading batch.
});
