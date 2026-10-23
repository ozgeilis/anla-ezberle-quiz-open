import assert from "node:assert/strict";
import test from "node:test";
import { playableQuestions } from "../src/content/questions";
import { bankV45 as questions } from "../src/content/questions/archive/bank-v45";
import { bankV44 } from "../src/content/questions/archive/bank-v44";
import { publishedNewQuestionsV45 } from "../src/content/questions/published-v45";
import { knownQuestion, gameQuestion } from "../src/content/questions/registry";
import { selectionConceptKeys } from "../src/domain/game/engine";

test("v45: 669 playable questions and unchanged v44 archive", () => {
  assert.equal(bankV44.length,652);
  assert.equal(questions.length,669);
  assert.equal(playableQuestions("production",questions).length,669);
  assert.equal(publishedNewQuestionsV45.length,17);
  for(const [i,previous] of bankV44.entries())assert.deepEqual(questions[i],previous);
  assert.equal(new Set(questions.map(q=>q.id)).size,669);
});
test("v45: every TDV question has four options, one correct answer and a checkable source", () => {
  const existing=new Set(bankV44.map(q=>q.question.normalize("NFKC").toLocaleLowerCase("tr-TR")));
  const seen=new Set<string>();
  for(const q of publishedNewQuestionsV45){
    assert.ok(q.id.startsWith("q45-"));
    assert.ok(!knownQuestion(44,q.id));
    assert.ok(knownQuestion(45,q.id));
    assert.equal(q.reviewStatus,"approved");
    assert.ok(q.categoryId==="history"||q.categoryId==="general");
    assert.equal(q.options.length,4);
    assert.equal(new Set(q.options.map(o=>o.id)).size,4);
    assert.equal(new Set(q.options.map(o=>o.text)).size,4);
    assert.ok(q.options.some(o=>o.id===q.correctOptionId));
    assert.ok(q.explanation.length>=75);
    assert.equal(q.sources.length,1);
    assert.ok(q.sources[0]!.url.startsWith("https://islamansiklopedisi.org.tr/"));
    assert.ok(q.sources[0]!.locator.length>=8);
    assert.equal(q.sources[0]!.checkStatus,"supported");
    const prompt=q.question.normalize("NFKC").toLocaleLowerCase("tr-TR");
    assert.ok(!existing.has(prompt));
    assert.ok(!seen.has(prompt));
    seen.add(prompt);
    const order=q.options.map(o=>o.id);
    const rendered=gameQuestion({bankVersion:45,optionOrders:{[q.id]:order}},q.id);
    assert.equal(rendered?.correct,order.indexOf(q.correctOptionId));
    assert.ok(selectionConceptKeys(q).includes("concept:"+q.conceptGroup));
  }
});
