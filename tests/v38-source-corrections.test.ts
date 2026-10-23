import assert from "node:assert/strict";
import { test } from "node:test";
import { bankV37 } from "../src/content/questions/archive/bank-v37";
import { bankV38 } from "../src/content/questions/archive/bank-v38";
import { publishedCorrectionsV38 } from "../src/content/questions/published-v38";
import { gameQuestion } from "../src/content/questions/registry";

test("v38 publishes 25 source corrections and preserves all old answer IDs", () => {
  assert.equal(bankV38.length, 600);
  assert.equal(publishedCorrectionsV38.length, 25);
  for (const [i, q] of bankV38.entries()) {
    const old = bankV37[i]!;
    assert.equal(q.id, old.id);
    assert.deepEqual(q.options, old.options);
    assert.equal(q.correctOptionId, old.correctOptionId);
    if (!publishedCorrectionsV38.includes(q)) {
      assert.equal(q, old);
      continue;
    }
    assert.equal(q.version, old.version + 1);
    const optionOrders = { [q.id]: [...q.options].reverse().map((o) => o.id) };
    const historic = gameQuestion({ bankVersion: 37, optionOrders }, q.id)!;
    const revised = gameQuestion({ bankVersion: 38, optionOrders }, q.id)!;
    assert.equal(historic.text, old.question);
    assert.equal(historic.explanation, old.explanation);
    assert.equal(historic.correct, revised.correct);
    assert.equal(q.reviewedAt, undefined);
  }
  assert.ok(publishedCorrectionsV38.every((q) => !q.sources[0]!.url.includes("/tefsir/sure/")));
});
