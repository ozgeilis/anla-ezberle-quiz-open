import assert from "node:assert/strict";
import test from "node:test";
import { playableQuestions } from "../src/content/questions";
import { bankV52 as questions } from "../src/content/questions/archive/bank-v52";
import { bankV51 } from "../src/content/questions/archive/bank-v51";
import { publishedNewQuestionsV52 } from "../src/content/questions/published-v52";
import { gameQuestion,knownQuestion } from "../src/content/questions/registry";
import { selectionConceptKeys } from "../src/domain/game/engine";

test("v52 retains every historical question and appends 25 source-linked worship items", () => {
 assert.equal(bankV51.length,840);
 assert.equal(questions.length,865);
 assert.equal(playableQuestions("production",questions).length,865);
 assert.equal(publishedNewQuestionsV52.length,25);
 for(const [i,q] of bankV51.entries())assert.deepEqual(questions[i],q);
 assert.equal(new Set(questions.map(q=>q.id)).size,865);
});
test("v52 source URLs, explanations, correct options and learning groups", () => {
 const oldPrompts=new Set(bankV51.map(q=>q.question.normalize("NFKC").toLocaleLowerCase("tr-TR")));
 const newPrompts=new Set<string>(),groups=new Set<string>();
 for(const q of publishedNewQuestionsV52) {
  assert.ok(/^q52-(vakif|sadaka|zekat|fitre|kurban)-\d{3}$/.test(q.id));
  assert.equal(q.categoryId,"general");
  assert.equal(q.reviewStatus,"approved");
  assert.ok(!knownQuestion(51,q.id));assert.ok(knownQuestion(52,q.id));
  assert.equal(q.options.length,4);
  assert.equal(new Set(q.options.map(o=>o.id)).size,4);
  assert.equal(new Set(q.options.map(o=>o.text)).size,4);
  assert.ok(q.options.some(o=>o.id===q.correctOptionId));
  assert.ok(q.explanation.length>=75);
  assert.equal(q.sources.length,1);
  assert.ok(q.sources[0]!.url.startsWith("https://islamansiklopedisi.org.tr/"));
  assert.equal(q.sources[0]!.checkStatus,"supported");
  const prompt=q.question.normalize("NFKC").toLocaleLowerCase("tr-TR");
  assert.ok(!oldPrompts.has(prompt));assert.ok(!newPrompts.has(prompt));
  newPrompts.add(prompt);groups.add(q.conceptGroup);
  assert.ok(selectionConceptKeys(q).includes("concept:"+q.conceptGroup));
  const order=q.options.map(o=>o.id);
  const view=gameQuestion({bankVersion:52,optionOrders:{[q.id]:order}},q.id);
  assert.equal(view?.correct,order.indexOf(q.correctOptionId));
 }
 assert.equal(groups.size,5);
});
