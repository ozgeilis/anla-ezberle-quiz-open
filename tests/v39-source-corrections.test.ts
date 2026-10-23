import assert from "node:assert/strict";
import { test } from "node:test";
import { bankV38 } from "../src/content/questions/archive/bank-v38";
import { bankV39 } from "../src/content/questions/archive/bank-v39";
import { publishedCorrectionsV39 } from "../src/content/questions/published-v39";
import { gameQuestion } from "../src/content/questions/registry";

test("v39 publishes 7 source corrections and preserves all old answer IDs", () => {
  assert.equal(bankV39.length, 600);
  assert.equal(publishedCorrectionsV39.length, 7);
  for (const [i, q] of bankV39.entries()) {
    const old = bankV38[i]!;
    assert.equal(q.id, old.id);
    assert.deepEqual(q.options, old.options);
    assert.equal(q.correctOptionId, old.correctOptionId);
    if (!publishedCorrectionsV39.includes(q)) {
      assert.equal(q, old);
      continue;
    }
    assert.equal(q.version, old.version + 1);
    const optionOrders = { [q.id]: [...q.options].reverse().map((o) => o.id) };
    const historic = gameQuestion({ bankVersion: 38, optionOrders }, q.id)!;
    const revised = gameQuestion({ bankVersion: 39, optionOrders }, q.id)!;
    assert.equal(historic.text, old.question);
    assert.equal(historic.explanation, old.explanation);
    assert.equal(historic.correct, revised.correct);
    assert.equal(q.reviewedAt, undefined);
  }
  assert.ok(publishedCorrectionsV39.every((q) => !q.sources[0]!.url.includes("/tefsir/sure/")));
});

test("v39 disambiguates Sevde and targets the actual dua verses", () => {
  const q = bankV39.find((q) => q.id === "learn-women-013")!;
  assert.match(q.question, /tek eşi/);
  assert.equal(q.correctOptionId, "o2");
  assert.match(bankV38.find((old) => old.id === q.id)!.question, /Hatice/);
  assert.ok(!bankV38.find((old) => old.id === q.id)!.question.includes("tek eşi"));
  const dua = bankV39.find((q) => q.id === "learn-dua-013")!;
  assert.equal(new URL(dua.sources[0]!.url).searchParams.get("ayet"), "250");
});
