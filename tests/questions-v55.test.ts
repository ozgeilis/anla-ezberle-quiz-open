import assert from "node:assert/strict";
import test from "node:test";
import { playableQuestions } from "../src/content/questions";
import { bankV55 as questions } from "../src/content/questions/archive/bank-v55";
import { bankV54 } from "../src/content/questions/archive/bank-v54";
import { publishedNewQuestionsV55 } from "../src/content/questions/published-v55";
import { gameQuestion,knownQuestion } from "../src/content/questions/registry";
import { selectionConceptKeys } from "../src/domain/game/engine";
test("v55 append-only 958 bank with 32 new Quran questions",()=>{
 assert.equal(bankV54.length,926);assert.equal(questions.length,958);
 assert.equal(playableQuestions("production",questions).length,958);assert.equal(publishedNewQuestionsV55.length,32);
 for(const [i,q] of bankV54.entries())assert.deepEqual(questions[i],q);
 assert.equal(new Set(questions.map(q=>q.id)).size,958);
});
test("v55 Diyanet source metadata and answer keys",()=>{
 const previous=new Set(bankV54.map(q=>q.question.normalize("NFKC").toLocaleLowerCase("tr-TR")));
 const seen=new Set<string>(),groups=new Set<string>();
 for(const q of publishedNewQuestionsV55){
  assert.ok(/^q55-(tekvir|infitar|insikak|kiyamet)-\d{3}$/.test(q.id));
  assert.equal(q.categoryId,"quran");assert.ok(!knownQuestion(54,q.id));assert.ok(knownQuestion(55,q.id));
  assert.equal(q.reviewStatus,"approved");assert.equal(q.options.length,4);
  assert.equal(new Set(q.options.map(o=>o.id)).size,4);assert.equal(new Set(q.options.map(o=>o.text)).size,4);
  assert.ok(q.options.some(o=>o.id===q.correctOptionId));assert.ok(q.explanation.length>=65);
  assert.equal(q.sources.length,1);assert.ok(q.sources[0]!.url.startsWith("https://kuran.diyanet.gov.tr/kuran?ayet="));
  assert.equal(q.sources[0]!.checkStatus,"supported");
  const prompt=q.question.normalize("NFKC").toLocaleLowerCase("tr-TR");
  assert.ok(!previous.has(prompt));assert.ok(!seen.has(prompt));seen.add(prompt);groups.add(q.conceptGroup);
  assert.ok(selectionConceptKeys(q).includes("concept:"+q.conceptGroup));
  const order=q.options.map(o=>o.id),view=gameQuestion({bankVersion:55,optionOrders:{[q.id]:order}},q.id);
  assert.equal(view?.correct,order.indexOf(q.correctOptionId));
 }
 assert.equal(groups.size,4);
});
