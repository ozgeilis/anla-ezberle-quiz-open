import assert from "node:assert/strict";
import test from "node:test";
import { questions } from "../src/content/questions";
import evidence from "../docs/source-verification/evidence/v71-batch-01-0001-0050.json";

test("first 50 canonical questions have correctly attributed external source evidence", () => {
  assert.deepStrictEqual(evidence.range, [1, 50]);
  assert.equal(evidence.count, 50);
  assert.equal(evidence.entries.length, 50);
  assert.equal(new Set(evidence.entries.map((entry) => entry.id)).size, 50);
  for (const [index, entry] of evidence.entries.entries()) {
    const question = questions[index]!;
    assert.equal(entry.position, index + 1);
    assert.equal(entry.id, question.id);
    assert.equal(entry.question, question.question);
    assert.equal(entry.correctOptionId, question.correctOptionId);
    assert.equal(entry.correctAnswer, question.options.find((o) => o.id === question.correctOptionId)!.text);
    assert.deepStrictEqual(entry.allOptions, question.options);
    assert.deepStrictEqual(entry.originalSourceUrls, question.sources.map((source) => source.url));
    assert.ok(entry.externalOfficialSource.startsWith("https://"));
    assert.ok(entry.evidenceSummary.length > 25);
    assert.ok(["official-article-body-read", "official-indexed-source-excerpt"].includes(entry.sourceAccess));
    assert.ok(entry.evidenceStatus === "supported-by-read-source" || entry.evidenceStatus === "supported-by-indexed-excerpt-needs-direct-reading");
  }
  const complete = evidence.entries.filter((entry) => entry.evidenceStatus === "supported-by-read-source").length;
  const partial = evidence.entries.filter((entry) => entry.evidenceStatus === "supported-by-indexed-excerpt-needs-direct-reading").length;
  assert.equal(complete, 35);
  assert.equal(partial, 15);
  assert.deepStrictEqual(evidence.sourceClassificationCounts, {
    "supported-by-read-source": complete,
    "supported-by-indexed-excerpt-needs-direct-reading": partial,
  });
});
