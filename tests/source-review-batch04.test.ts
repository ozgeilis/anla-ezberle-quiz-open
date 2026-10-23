import assert from "node:assert/strict";
import test from "node:test";
import { questions } from "../src/content/questions";
import evidence from "../docs/source-verification/evidence/v71-batch-04-0151-0200.json";

test("TDV and Diyanet historical/ritual evidence matches exactly 50 v71 question records 151–200", () => {
  assert.deepEqual(evidence.range, [151, 200]);
  assert.equal(evidence.count, 50);
  assert.equal(evidence.entries.length, 50);
  assert.equal(new Set(evidence.entries.map(e => e.id)).size, 50);
  const counts: Record<string,number> = {};
  for (const [i, row] of evidence.entries.entries()) {
    const question = questions[150 + i]!;
    assert.equal(row.position, 151 + i);
    assert.equal(row.id, question.id);
    assert.equal(row.question, question.question);
    assert.equal(row.correctOptionId, question.correctOptionId);
    assert.equal(row.correctAnswerText, question.options.find(o=>o.id===question.correctOptionId)?.text);
    assert.deepEqual(row.allOptions, question.options);
    assert.deepEqual(row.originalSourceUrls, question.sources.map(s=>s.url));
    assert.ok(row.officialSourceUrl.startsWith("https://"));
    assert.ok(row.sourceEvidenceSummary.length > 50);
    assert.ok(row.conclusion.startsWith("answer-supported"));
    if (row.access.includes("not-direct-fetch")) assert.ok(row.reviewCaveat);
    counts[row.access] = (counts[row.access] ?? 0) + 1;
  }
  assert.deepEqual(counts, evidence.sourceAccessCounts);
  assert.deepEqual(counts, {
    "TDV-official-article-opened": 44,
    "TDV-full-article-text-returned-in-web-search-result-not-direct-fetch": 5,
    "Diyanet-original-published-Quran-meal": 1,
  });
});
