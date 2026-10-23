import assert from "node:assert/strict";
import { test } from "node:test";
import { bankV33 } from "../src/content/questions/archive/bank-v33";
import { bankV34 } from "../src/content/questions/archive/bank-v34";
import { publishedCorrectionsV34 } from "../src/content/questions/published-v34";
import { gameQuestion } from "../src/content/questions/registry";

test("v34 removes ambiguous mosque wording and fixes verse targets while preserving all saved answers", () => {
  assert.equal(bankV34.length, 600);
  assert.equal(publishedCorrectionsV34.length, 48);
  for (const [i, q] of bankV34.entries()) {
    const old = bankV33[i]!;
    assert.equal(q.id, old.id);
    assert.deepEqual(q.options, old.options);
    assert.equal(q.correctOptionId, old.correctOptionId);
    if (!publishedCorrectionsV34.includes(q)) {
      assert.equal(q, old);
      continue;
    }
    assert.equal(q.version, old.version + 1);
    const optionOrders = { [q.id]: [...q.options].reverse().map((o) => o.id) };
    const historic = gameQuestion({ bankVersion: 33, optionOrders }, q.id)!;
    const revised = gameQuestion({ bankVersion: 34, optionOrders }, q.id)!;
    assert.equal(historic.text, old.question);
    assert.equal(historic.explanation, old.explanation);
    assert.equal(historic.correct, revised.correct);
    assert.equal(q.reviewedAt, undefined);
  }
  const mosque = bankV34.find((q) => q.id === "e150-history-010")!;
  assert.match(mosque.question, /Hücre-i Saâdet/);
  const challenge = bankV34.find((q) => q.id === "e150-prophets-032")!;
  assert.match(challenge.explanation, /doğudan.*batıdan/);
  assert(
    bankV34.every((q) =>
      q.sources.every((s) => !s.url.includes("mode=kuran-meal")),
    ),
  );
});
