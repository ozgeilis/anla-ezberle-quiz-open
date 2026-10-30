import assert from "node:assert/strict";
import { test } from "node:test";
import { bankV31 } from "../src/content/questions/archive/bank-v31";
import { BANK_VERSION, playableQuestions } from "../src/content/questions";
import { SUPPORTED_BANK_VERSIONS, gameQuestion, knownQuestion } from "../src/content/questions/registry";

const normalize = (s: string) => s.normalize("NFKC").toLocaleLowerCase("tr-TR").replace(/[^\p{L}\p{N}]+/gu, " ").trim();

test("600-question editorial gate: all published IDs and prompts are unique", () => {
  assert.equal(BANK_VERSION, 73);
  assert.equal(bankV31.length, 600);
  assert.equal(playableQuestions().length, 1500);
  const ids = bankV31.map(q => q.id);
  assert.equal(new Set(ids).size, ids.length, "duplicate question IDs");
  const prompts = bankV31.map(q => normalize(q.question));
  assert.equal(new Set(prompts).size, prompts.length, "identical question prompts after Turkish-aware normalization");
  assert.ok(prompts.every(Boolean), "empty normalized question");
});

test("600-question editorial gate: answer choices are unambiguous and all have teaching context", () => {
  for (const q of bankV31) {
    assert.equal(q.reviewStatus, "approved", q.id);
    assert.equal(q.options.length, 4, q.id);
    assert.equal(new Set(q.options.map(o => o.id)).size, 4, q.id);
    assert.equal(new Set(q.options.map(o => normalize(o.text))).size, 4, q.id);
    assert.ok(q.options.some(o => o.id === q.correctOptionId), q.id);
    assert.ok(normalize(q.question).length >= 8, q.id);
    assert.ok(normalize(q.explanation).length >= 15, q.id);
    assert.ok(q.sources.length > 0 && q.sources.every(s => s.url.startsWith("https://") && s.title && s.publisher && s.locator && s.supports), q.id);
  }
});

test("600-question editorial gate: stored game option ordering always maps to right answer", () => {
  for (const q of bankV31) {
    const order = [...q.options].reverse().map(o => o.id);
    const game = gameQuestion({ bankVersion: 31, optionOrders: { [q.id]: order } }, q.id);
    assert.ok(game, q.id);
    assert.equal(game.correct, order.indexOf(q.correctOptionId), q.id);
    assert.equal(game.options[game.correct], q.options.find(o => o.id === q.correctOptionId)?.text, q.id);
  }
});

test("600-question editorial gate: supported historical bank versions are immutable", () => {
  assert.equal(SUPPORTED_BANK_VERSIONS[0], 1);
  assert.equal(SUPPORTED_BANK_VERSIONS.at(-1), BANK_VERSION);
  assert.equal(new Set(SUPPORTED_BANK_VERSIONS).size, SUPPORTED_BANK_VERSIONS.length);
  for (const q of bankV31) assert.ok(knownQuestion(31, q.id), q.id);
});
