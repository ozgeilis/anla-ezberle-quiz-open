import assert from "node:assert/strict";
import test from "node:test";
import { questions1500 as questions } from "../src/content/questions/questions-1500";
import { sourceReviewLedger } from "../scripts/audit-source-consistency";

test("v71 source ledger covers every question without claiming external certification", () => {
  const report = sourceReviewLedger(questions);
  assert.equal(report.totalQuestions, 1500);
  assert.equal(report.rows.length, 1500);
  assert.equal(new Set(report.rows.map((row) => row.id)).size, 1500);
  assert.ok(report.rows.every((row) => row.independentPassageVerification === "not-performed"));
  assert.ok(report.rows.every((row) => row.recordedCorrectAnswer.length > 0));
  assert.ok(report.rows.every((row) => row.sourceUrls.length > 0));
  assert.equal(report.totalSourceRecords, 1512);
  assert.equal(report.uniqueSourceUrls, 794);
  assert.equal(report.copiedSupportMetadataRecords, 1498);
  assert.equal(report.questionsWithoutIndependentReviewTimestamp, 1500);
  assert.equal(report.citationUrlReferencesScreened, 403);
  assert.deepEqual(report.citationUrlMismatches, []);
});

test("flag known citation-location typo without altering frozen v71 records", () => {
  const report = sourceReviewLedger(questions);
  assert.deepEqual(report.citationLocationMismatches, ["learn-dua-014"]);
  const row = report.rows.find((q) => q.id === "learn-dua-014");
  assert.ok(row);
  assert.equal(row.sourceLocators[0], "Âl-i İmrân 3/38");
  assert.equal(row.recordedCorrectAnswer, "Günahların bağışlanması ve ateş azabından korunma");
  assert.ok(row.flags.includes("question-vs-source-locator-reference-mismatch"));
});
