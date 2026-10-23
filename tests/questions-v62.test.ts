import assert from "node:assert/strict";
import test from "node:test";
import { playableQuestions } from "../src/content/questions";
import { bankV62 as questions } from "../src/content/questions/archive/bank-v62";
import { bankV61 } from "../src/content/questions/archive/bank-v61";
import { publishedNewQuestionsV62 } from "../src/content/questions/published-v62";
import { knownQuestion,gameQuestion } from "../src/content/questions/registry";
const norm=(s:string)=>s.normalize("NFKC").toLocaleLowerCase("tr-TR").replace(/[^\p{L}\p{N}]+/gu," ").trim();

test("v62 preserves 1105 prior questions and has 1134 playable questions",()=>{
 assert.equal(bankV61.length,1105);
 assert.equal(questions.length,1134);assert.equal(playableQuestions("production",questions).length,1134);
 assert.equal(publishedNewQuestionsV62.length,29);
 assert.equal(new Set(questions.map(q=>q.id)).size,1134);
 for(const [i,q] of bankV61.entries())assert.deepEqual(questions[i],q);
});
test("v62 worship and charity source records are complete",()=>{
 const prior=new Set(bankV61.map(q=>norm(q.question))),seen=new Set<string>();
 for(const q of publishedNewQuestionsV62){
  assert.equal(q.categoryId,"general");assert.equal(q.reviewStatus,"approved");
  assert.ok(q.id.startsWith("q62-"));assert.ok(!knownQuestion(61,q.id));
  assert.ok(knownQuestion(62,q.id));assert.equal(q.options.length,4);
  assert.equal(new Set(q.options.map(o=>o.id)).size,4);
  assert.equal(new Set(q.options.map(o=>norm(o.text))).size,4);
  assert.ok(q.options.some(o=>o.id===q.correctOptionId));
  assert.ok(q.explanation.length>=72);assert.equal(q.sources.length,1);
  assert.ok(q.sources[0]!.url.startsWith("https://islamansiklopedisi.org.tr/"));
  assert.equal(q.sources[0]!.checkStatus,"supported");
  const p=norm(q.question);assert.ok(!prior.has(p),q.id);assert.ok(!seen.has(p),q.id);seen.add(p);
  const order=q.options.map(o=>o.id);
  assert.equal(gameQuestion({bankVersion:62,optionOrders:{[q.id]:order}},q.id)?.correct,order.indexOf(q.correctOptionId));
 }
});
