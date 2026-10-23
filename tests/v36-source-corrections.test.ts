import assert from "node:assert/strict";
import { test } from "node:test";
import { bankV35 } from "../src/content/questions/archive/bank-v35";
import { bankV36 } from "../src/content/questions/archive/bank-v36";
import { publishedCorrectionsV36 } from "../src/content/questions/published-v36";
import { gameQuestion } from "../src/content/questions/registry";

test("v36 publishes five verified verse targets without changing saved answers", () => {
  assert.equal(bankV36.length, 600);
  assert.equal(publishedCorrectionsV36.length, 5);
  for (const [i, q] of bankV36.entries()) {
    const old = bankV35[i]!;
    assert.equal(q.id, old.id);
    assert.deepEqual(q.options, old.options);
    assert.equal(q.correctOptionId, old.correctOptionId);
    if (!publishedCorrectionsV36.includes(q)) {
      assert.equal(q, old);
      continue;
    }
    assert.equal(q.version, old.version + 1);
    const optionOrders = { [q.id]: [...q.options].reverse().map((o) => o.id) };
    const historic = gameQuestion({ bankVersion: 35, optionOrders }, q.id)!;
    const revised = gameQuestion({ bankVersion: 36, optionOrders }, q.id)!;
    assert.equal(historic.text, old.question);
    assert.equal(historic.explanation, old.explanation);
    assert.equal(historic.correct, revised.correct);
    assert.equal(q.reviewedAt, undefined);
  }
  for (const q of publishedCorrectionsV36) assert.match(q.sources[0]!.url, /kuran\?sure=.+&ayet=.+&mode=meal/);
});
