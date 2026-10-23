import assert from "node:assert/strict";
import test from "node:test";
import { playableQuestions } from "../src/content/questions";
import { bankV56 as questions } from "../src/content/questions/archive/bank-v56";
import { bankV55 } from "../src/content/questions/archive/bank-v55";
import { publishedNewQuestionsV56 } from "../src/content/questions/published-v56";
import { gameQuestion, knownQuestion } from "../src/content/questions/registry";
test("v56 history topic expansion preserves all 958 previous questions", () => {
 assert.equal(bankV55.length,958);
 assert.equal(questions.length,966);assert.equal(playableQuestions("production",questions).length,966);
 assert.equal(publishedNewQuestionsV56.length,8);
 for (const [i,q] of bankV55.entries())assert.deepEqual(questions[i],q);
 assert.equal(new Set(questions.map(q=>q.id)).size,966);
});
test("v56 sourced Akabe and Hijra questions are valid and identifiable",()=>{
 const old=new Set(bankV55.map(q=>q.question.normalize("NFKC").toLocaleLowerCase("tr-TR")));
 const seen=new Set<string>();
 for(const q of publishedNewQuestionsV56){
  assert.ok(q.id.startsWith("q56-"));assert.equal(q.categoryId,"history");
  assert.equal(q.reviewStatus,"approved");assert.ok(!knownQuestion(55,q.id));
  assert.ok(knownQuestion(56,q.id));assert.equal(q.options.length,4);
  assert.equal(new Set(q.options.map(o=>o.id)).size,4);
  assert.equal(new Set(q.options.map(o=>o.text)).size,4);
  assert.ok(q.options.some(o=>o.id===q.correctOptionId));
  assert.ok(q.explanation.length>=70);assert.equal(q.sources.length,1);
  assert.ok(q.sources[0]!.url.startsWith("https://islamansiklopedisi.org.tr/"));
  assert.equal(q.sources[0]!.checkStatus,"supported");
  const prompt=q.question.normalize("NFKC").toLocaleLowerCase("tr-TR");
  assert.ok(!seen.has(prompt));assert.ok(!old.has(prompt));seen.add(prompt);
  const order=q.options.map(o=>o.id);
  const item=gameQuestion({bankVersion:56,optionOrders:{[q.id]:order}},q.id);
  assert.equal(item?.correct,order.indexOf(q.correctOptionId));
 }
});
