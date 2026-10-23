import { questions1500 as questions } from "../src/content/questions/questions-1500";
import { BANK_VERSION } from "../src/content/questions";
import assert from "node:assert/strict";
import { test } from "node:test";
import { bankV40 } from "../src/content/questions/archive/bank-v40";
import { bankV41 } from "../src/content/questions/archive/bank-v41";
import { publishedCorrectionsV41 } from "../src/content/questions/published-v41";
import { gameQuestion } from "../src/content/questions/registry";

test("v41 publishes 5 source corrections and preserves all old answer IDs", () => {
  assert.equal(BANK_VERSION, 72);
  assert.deepEqual(questions.slice(0, bankV41.length), bankV41);
  assert.equal(bankV41.length, 600);
  assert.equal(publishedCorrectionsV41.length, 5);
  for (const [i, q] of bankV41.entries()) {
    const old = bankV40[i]!;
    assert.equal(q.id, old.id);
    assert.deepEqual(q.options.map((o) => o.id), old.options.map((o) => o.id));
    assert.equal(q.options.find((o) => o.id === q.correctOptionId)!.text,
      old.options.find((o) => o.id === old.correctOptionId)!.text);
    assert.equal(q.correctOptionId, old.correctOptionId);
    if (!publishedCorrectionsV41.includes(q)) {
      assert.equal(q, old);
      continue;
    }
    assert.equal(q.version, old.version + 1);
    const optionOrders = { [q.id]: [...q.options].reverse().map((o) => o.id) };
    const historic = gameQuestion({ bankVersion: 40, optionOrders }, q.id)!;
    const revised = gameQuestion({ bankVersion: 41, optionOrders }, q.id)!;
    assert.deepEqual(historic.options, [...old.options].reverse().map((o) => o.text));
    assert.equal(historic.text, old.question);
    assert.equal(historic.explanation, old.explanation);
    assert.equal(historic.correct, revised.correct);
    assert.equal(q.reviewedAt, undefined);
  }
  assert.ok(publishedCorrectionsV41.every((q) => !q.sources[0]!.url.includes("/tefsir/sure/")));
});

test("v41 simplifies distractors and distinguishes related facts from repeats", async () => {
  const { sourceAuditConceptKey } = await import("../src/content/questions/source-audit-concepts-v1");
  assert.equal(sourceAuditConceptKey("e150-prophets-030"), sourceAuditConceptKey("learn-dua-011"));
  assert.equal(sourceAuditConceptKey("e150-prophets-035"), undefined);
  assert.equal(sourceAuditConceptKey("v11-prophets-011"), undefined);
  assert.notDeepEqual(bankV41.find((q) => q.id === "general-012")!.options,
    bankV40.find((q) => q.id === "general-012")!.options);
});
