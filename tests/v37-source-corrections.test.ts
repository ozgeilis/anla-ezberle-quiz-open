import assert from "node:assert/strict";
import { test } from "node:test";
import { bankV36 } from "../src/content/questions/archive/bank-v36";
import { bankV37 } from "../src/content/questions/archive/bank-v37";
import { publishedCorrectionsV37 } from "../src/content/questions/published-v37";
import { gameQuestion } from "../src/content/questions/registry";

test("v37 publishes 26 source corrections and preserves all old answer IDs", () => {
  assert.equal(bankV37.length, 600);
  assert.equal(publishedCorrectionsV37.length, 26);
  for (const [i, q] of bankV37.entries()) {
    const old = bankV36[i]!;
    assert.equal(q.id, old.id);
    assert.deepEqual(q.options, old.options);
    assert.equal(q.correctOptionId, old.correctOptionId);
    if (!publishedCorrectionsV37.includes(q)) {
      assert.equal(q, old);
      continue;
    }
    assert.equal(q.version, old.version + 1);
    const optionOrders = { [q.id]: [...q.options].reverse().map((o) => o.id) };
    const historic = gameQuestion({ bankVersion: 36, optionOrders }, q.id)!;
    const revised = gameQuestion({ bankVersion: 37, optionOrders }, q.id)!;
    assert.equal(historic.text, old.question);
    assert.equal(historic.explanation, old.explanation);
    assert.equal(historic.correct, revised.correct);
    assert.equal(q.reviewedAt, undefined);
  }
  assert.ok(publishedCorrectionsV37.every((q) => !q.sources[0]!.url.includes("/tefsir/sure/")));
});
