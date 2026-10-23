import { questions } from "../src/content/questions";
import assert from "node:assert/strict";
import { test } from "node:test";
import { bankV34 } from "../src/content/questions/archive/bank-v34";
import { bankV35 } from "../src/content/questions/archive/bank-v35";
import { publishedCorrectionsV35 } from "../src/content/questions/published-v35";
import { gameQuestion } from "../src/content/questions/registry";

test("v35 opens the verified verse while preserving all saved answers", () => {
  assert.equal(bankV35.length, 600);
  assert.equal(publishedCorrectionsV35.length, 2);
  for (const [i, q] of bankV35.entries()) {
    const old = bankV34[i]!;
    assert.equal(q.id, old.id);
    assert.deepEqual(q.options, old.options);
    assert.equal(q.correctOptionId, old.correctOptionId);
    if (!publishedCorrectionsV35.includes(q)) {
      assert.equal(q, old);
      continue;
    }
    assert.equal(q.version, old.version + 1);
    const optionOrders = { [q.id]: [...q.options].reverse().map((o) => o.id) };
    const historic = gameQuestion({ bankVersion: 34, optionOrders }, q.id)!;
    const revised = gameQuestion({ bankVersion: 35, optionOrders }, q.id)!;
    assert.equal(historic.text, old.question);
    assert.equal(historic.explanation, old.explanation);
    assert.equal(historic.correct, revised.correct);
    assert.equal(q.reviewedAt, undefined);
  }
  assert.match(bankV35.find((q) => q.id === "v7-prophets-003")!.sources[0]!.url, /sure=21&ayet=69&mode=meal/);
  assert.match(bankV35.find((q) => q.id === "v7-prophets-004")!.sources[0]!.url, /sure=34&ayet=10&mode=meal/);
});

test("source-audited aliases share a fact key without merging separate learning facts", async () => {
  const { sourceAuditConceptGroups } = await import("../src/content/questions/source-audit-concepts-v1");
  const { selectionConceptKeys, selectQuestions } = await import("../src/domain/game/engine");
  for (const ids of sourceAuditConceptGroups) {
    const records = ids.map((id) => questions.find((q) => q.id === id)!);
    assert.ok(records.every(Boolean));
    const key = selectionConceptKeys(records[0]!).find((k) => k.startsWith("fact:source-audit:"))!;
    assert.ok(key);
    assert.ok(records.every((q) => selectionConceptKeys(q).includes(key)));
    // Force overlapping records to the head of the pool and check actual selection.
    const pool = [...records, ...questions.filter((q) => !ids.includes(q.id))];
    const round = selectQuestions(pool, "mixed", undefined, [], () => 0.9999);
    assert.equal(round.length, 10);
    assert.ok(round.filter((q) => ids.includes(q.id)).length <= 1);
  }
  for (const id of ["e150-history-023", "e150-history-024", "e150-general-010", "e150-general-011"]) {
    assert.ok(!selectionConceptKeys(questions.find((q) => q.id === id)!).some((key) => key.startsWith("fact:source-audit:")));
  }
});
