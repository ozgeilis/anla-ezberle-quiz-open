import assert from "node:assert/strict";
import test from "node:test";
import { playableQuestions } from "../src/content/questions";
import { bankV54 as questions } from "../src/content/questions/archive/bank-v54";
import { bankV53 } from "../src/content/questions/archive/bank-v53";
import { publishedNewQuestionsV54 } from "../src/content/questions/published-v54";
import { gameQuestion,knownQuestion } from "../src/content/questions/registry";
import { selectionConceptKeys } from "../src/domain/game/engine";

test("v54 append-only Quran bank with 926 playable items",()=>{
assert.equal(bankV53.length,902);assert.equal(questions.length,926);
 assert.equal(playableQuestions("production",questions).length,926);assert.equal(publishedNewQuestionsV54.length,24);
 for(const [i,q] of bankV53.entries())assert.deepEqual(questions[i],q);
 assert.equal(new Set(questions.map(q=>q.id)).size,926);
});
test("v54 answer, explanation, source and concept quality",()=>{
 const old=new Set(bankV53.map(q=>q.question.normalize("NFKC").toLocaleLowerCase("tr-TR")));
 const seen=new Set<string>(),groups=new Set<string>();
 for(const q of publishedNewQuestionsV54){
  assert.ok(/^q54-(buruc|tarik|ala)-\d{3}$/.test(q.id));assert.equal(q.categoryId,"quran");
  assert.ok(!knownQuestion(53,q.id));assert.ok(knownQuestion(54,q.id));
  assert.equal(q.reviewStatus,"approved");assert.equal(q.options.length,4);
  assert.equal(new Set(q.options.map(o=>o.id)).size,4);assert.equal(new Set(q.options.map(o=>o.text)).size,4);
  assert.ok(q.options.some(o=>o.id===q.correctOptionId));assert.ok(q.explanation.length>=55);
  assert.equal(q.sources.length,1);
  assert.ok(q.sources[0]!.url.startsWith("https://kuran.diyanet.gov.tr/kuran?ayet="));
  assert.equal(q.sources[0]!.checkStatus,"supported");
  const text=q.question.normalize("NFKC").toLocaleLowerCase("tr-TR");
  assert.ok(!old.has(text));assert.ok(!seen.has(text));seen.add(text);groups.add(q.conceptGroup);
  assert.ok(selectionConceptKeys(q).includes("concept:"+q.conceptGroup));
  const order=q.options.map(o=>o.id);
  const display=gameQuestion({bankVersion:54,optionOrders:{[q.id]:order}},q.id);
  assert.equal(display?.correct,order.indexOf(q.correctOptionId));
 }
 assert.equal(groups.size,3);
});
