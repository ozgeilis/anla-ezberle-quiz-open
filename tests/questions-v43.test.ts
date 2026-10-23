import assert from "node:assert/strict";
import test from "node:test";
import { playableQuestions } from "../src/content/questions";
import { bankV43 as questions } from "../src/content/questions/archive/bank-v43";
import { bankV42 } from "../src/content/questions/archive/bank-v42";
import { publishedNewQuestionsV43 } from "../src/content/questions/published-v43";
import { knownQuestion, gameQuestion } from "../src/content/questions/registry";
import { selectionConceptKeys } from "../src/domain/game/engine";

test("v43: exactly 24 added after the unchanged 608-question historical snapshot", () => {
  assert.equal(bankV42.length, 608);
  assert.equal(questions.length, 632);
  assert.equal(playableQuestions("production", questions).length, 632);
  assert.equal(publishedNewQuestionsV43.length, 24);
  for (const [index, previous] of bankV42.entries()) assert.deepEqual(questions[index], previous);
  assert.equal(new Set(questions.map(q => q.id)).size, 632);
});

test("v43: every new question has one Diyanet verse locator, independent options and nontrivial explanation", () => {
  const previous = new Set(bankV42.map(q => q.question.normalize("NFKC").toLocaleLowerCase("tr-TR")));
  const newPrompts = new Set<string>();
  for (const q of publishedNewQuestionsV43) {
    assert.ok(/^q43-(mulk|insan|nebe|abese|mutaffifin)-\d+$/.test(q.id));
    assert.ok(!knownQuestion(42,q.id));
    assert.ok(knownQuestion(43,q.id));
    assert.equal(q.reviewStatus, "approved");
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options.map(o => o.id)).size, 4);
    assert.equal(new Set(q.options.map(o => o.text)).size, 4);
    assert.ok(q.options.some(o => o.id === q.correctOptionId));
    assert.ok(q.explanation.length >= 65);
    assert.equal(q.sources.length, 1);
    assert.ok(q.sources[0]!.url.startsWith("https://kuran.diyanet.gov.tr/kuran?ayet="));
    assert.ok(/^(Mülk 67|İnsân 76|Nebe 78|Abese 80|Mutaffifîn 83)\//.test(q.sources[0]!.locator));
    assert.equal(q.sources[0]!.checkStatus,"supported");
    const normalized = q.question.normalize("NFKC").toLocaleLowerCase("tr-TR");
    assert.ok(!previous.has(normalized),"Repeated historical prompt: "+q.id);
    assert.ok(!newPrompts.has(normalized),"Repeated new prompt: "+q.id);
    newPrompts.add(normalized);
    const order = q.options.map(o => o.id);
    const output = gameQuestion({bankVersion:43,optionOrders:{[q.id]:order}},q.id);
    assert.equal(output?.correct,order.indexOf(q.correctOptionId));
    assert.ok(selectionConceptKeys(q).includes("concept:"+q.conceptGroup));
  }
});
