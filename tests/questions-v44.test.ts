import assert from "node:assert/strict";
import test from "node:test";
import { playableQuestions } from "../src/content/questions";
import { bankV44 as questions } from "../src/content/questions/archive/bank-v44";
import { bankV43 } from "../src/content/questions/archive/bank-v43";
import { publishedNewQuestionsV44 } from "../src/content/questions/published-v44";
import { gameQuestion, knownQuestion } from "../src/content/questions/registry";
import { selectionConceptKeys } from "../src/domain/game/engine";

test("v44: 652 playable questions without modification to bank v43", () => {
  assert.equal(bankV43.length,632);
  assert.equal(questions.length,652);
  assert.equal(playableQuestions("production",questions).length,652);
  assert.equal(publishedNewQuestionsV44.length,20);
  for(const [i,old] of bankV43.entries()) assert.deepEqual(questions[i],old);
  assert.equal(new Set(questions.map(q=>q.id)).size,652);
});

test("v44: source locators, four options and explanatory answers are present", () => {
  const oldPrompts=new Set(bankV43.map(q=>q.question.normalize("NFKC").toLocaleLowerCase("tr-TR")));
  const prompts=new Set<string>();
  for (const q of publishedNewQuestionsV44) {
    assert.ok(/^q44-(leyl|duha|insirah|tin)-\d+$/.test(q.id));
    assert.equal(q.reviewStatus,"approved");
    assert.equal(q.options.length,4);
    assert.equal(new Set(q.options.map(o=>o.id)).size,4);
    assert.equal(new Set(q.options.map(o=>o.text)).size,4);
    assert.ok(q.options.some(o=>o.id===q.correctOptionId));
    assert.ok(q.explanation.length>=70);
    assert.equal(q.sources.length,1);
    assert.ok(/^https:\/\/kuran\.diyanet\.gov\.tr\/kuran\?ayet=\d+&mode=kuran-meal&sure=\d+$/.test(q.sources[0]!.url));
    assert.equal(q.sources[0]!.checkStatus,"supported");
    assert.ok(!knownQuestion(43,q.id));
    assert.ok(knownQuestion(44,q.id));
    const text=q.question.normalize("NFKC").toLocaleLowerCase("tr-TR");
    assert.ok(!oldPrompts.has(text));
    assert.ok(!prompts.has(text));
    prompts.add(text);
    const order=q.options.map(o=>o.id);
    const view=gameQuestion({bankVersion:44,optionOrders:{[q.id]:order}},q.id);
    assert.equal(view?.correct,order.indexOf(q.correctOptionId));
    assert.ok(selectionConceptKeys(q).includes("concept:"+q.conceptGroup));
  }
});
