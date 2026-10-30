import assert from "node:assert/strict";
import { test } from "node:test";
import { questions } from "../src/content/questions";
import { auditPublishedQuestions } from "../scripts/audit-published-questions";
import editorial from "../docs/editorial-v73/audit-round2-summary.json";

test("all 1500 current questions pass full structural audit without mutation", () => {
  const original = JSON.stringify(questions);
  const report = auditPublishedQuestions(questions);
  assert.equal(report.count, 1500);
  assert.equal(report.structuralIssues.length, 0, JSON.stringify(report.structuralIssues));
  assert.equal(Object.values(report.categories).reduce((a,b) => a+b, 0), 1500);
  assert.equal(Object.values(report.difficulties).reduce((a,b) => a+b, 0), 1500);
  assert.equal(report.similarityCandidates, editorial.overlapReview.automaticCandidatePairs);
  assert.equal(Object.values(report.reviewSignalCounts).reduce((a,b) => a+b, 0), report.similarityCandidates);
  assert.ok(report.limitations.some(value => value.includes("fact-check")));
  assert.equal(JSON.stringify(questions), original);
});
test("full audit detects distinct structural errors without editing data", () => {
  const q = questions[0]!;
  const bad = {...q, id: "test-duplicate", explanation: "", sources: []};
  const report = auditPublishedQuestions([bad, bad]);
  const issues = report.structuralIssues.map(item => item.issue);
  assert.ok(issues.includes("duplicate-id"));
  assert.ok(issues.includes("duplicate-question-text"));
  assert.ok(issues.includes("short-explanation"));
  assert.ok(issues.includes("missing-source"));
});
