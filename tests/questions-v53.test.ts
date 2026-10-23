import assert from "node:assert/strict";
import test from "node:test";
import { playableQuestions } from "../src/content/questions";
import { bankV53 as questions } from "../src/content/questions/archive/bank-v53";
import { bankV52 } from "../src/content/questions/archive/bank-v52";
import { publishedNewQuestionsV53 } from "../src/content/questions/published-v53";
import { gameQuestion, knownQuestion } from "../src/content/questions/registry";
import { selectionConceptKeys } from "../src/domain/game/engine";
test("v53 adds 37 Quran questions while preserving existing 865 exactly",()=>{
assert.equal(bankV52.length,865);assert.equal(questions.length,902);
 assert.equal(playableQuestions("production",questions).length,902);assert.equal(publishedNewQuestionsV53.length,37);
 for(const [i,q] of bankV52.entries())assert.deepEqual(questions[i],q);
 assert.equal(new Set(questions.map(q=>q.id)).size,902);
});
test("v53: Diyanet URL, verse, answer key, explanation and groups",()=>{
 const old=new Set(bankV52.map(q=>q.question.normalize("NFKC").toLocaleLowerCase("tr-TR")));
 const seen=new Set<string>();const groups=new Set<string>();
 for(const q of publishedNewQuestionsV53){
  assert.ok(/^q53-(fecr|beled|sems|gasiye)-\d{3}$/.test(q.id));
  assert.equal(q.categoryId,"quran");assert.equal(q.reviewStatus,"approved");
  assert.ok(!knownQuestion(52,q.id));assert.ok(knownQuestion(53,q.id));
  assert.equal(q.options.length,4);assert.equal(new Set(q.options.map(o=>o.id)).size,4);
  assert.equal(new Set(q.options.map(o=>o.text)).size,4);
  assert.ok(q.options.some(o=>o.id===q.correctOptionId));assert.ok(q.explanation.length>=65);
  assert.equal(q.sources.length,1);
  assert.ok(q.sources[0]!.url.startsWith("https://kuran.diyanet.gov.tr/kuran?ayet="));
  assert.equal(q.sources[0]!.checkStatus,"supported");
  const prompt=q.question.normalize("NFKC").toLocaleLowerCase("tr-TR");
  assert.ok(!old.has(prompt));assert.ok(!seen.has(prompt));seen.add(prompt);groups.add(q.conceptGroup);
  const order=q.options.map(o=>o.id),view=gameQuestion({bankVersion:53,optionOrders:{[q.id]:order}},q.id);
  assert.equal(view?.correct,order.indexOf(q.correctOptionId));assert.ok(selectionConceptKeys(q).includes("concept:"+q.conceptGroup));
 }
 assert.equal(groups.size,4);
});
