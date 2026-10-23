import assert from "node:assert/strict";
import { test } from "node:test";
import { bankV39 } from "../src/content/questions/archive/bank-v39";
import { bankV40 } from "../src/content/questions/archive/bank-v40";
import { publishedCorrectionsV40 } from "../src/content/questions/published-v40";
import { gameQuestion } from "../src/content/questions/registry";

test("v40 publishes 6 source corrections and preserves all old answer IDs", () => {
  assert.equal(bankV40.length, 600);
  assert.equal(publishedCorrectionsV40.length, 6);
  for (const [i, q] of bankV40.entries()) {
    const old = bankV39[i]!;
    assert.equal(q.id, old.id);
    assert.deepEqual(q.options, old.options);
    assert.equal(q.correctOptionId, old.correctOptionId);
    if (!publishedCorrectionsV40.includes(q)) {
      assert.equal(q, old);
      continue;
    }
    assert.equal(q.version, old.version + 1);
    const optionOrders = { [q.id]: [...q.options].reverse().map((o) => o.id) };
    const historic = gameQuestion({ bankVersion: 39, optionOrders }, q.id)!;
    const revised = gameQuestion({ bankVersion: 40, optionOrders }, q.id)!;
    assert.equal(historic.text, old.question);
    assert.equal(historic.explanation, old.explanation);
    assert.equal(historic.correct, revised.correct);
    assert.equal(q.reviewedAt, undefined);
  }
  assert.ok(publishedCorrectionsV40.every((q) => !q.sources[0]!.url.includes("/tefsir/sure/")));
});

test("v40 distinguishes Zeyneb from Sevde without rewriting saved questions", () => {
  const q = bankV40.find((q) => q.id === "learn-women-019")!;
  assert.match(q.question, /Zeyd b. Hârise/);
  assert.ok(q.sources.some((s) => s.url.endsWith("/sevde")));
  assert.ok(!bankV39.find((old) => old.id === q.id)!.question.includes("Zeyd"));
});
