import assert from "node:assert/strict";
import test from "node:test";
import { playableQuestions } from "../src/content/questions";
import { bankV61 as questions } from "../src/content/questions/archive/bank-v61";
import { bankV60 } from "../src/content/questions/archive/bank-v60";
import { publishedNewQuestionsV61 } from "../src/content/questions/published-v61";
import { knownQuestion, gameQuestion } from "../src/content/questions/registry";
const norm=(s:string)=>s.normalize("NFKC").toLocaleLowerCase("tr-TR").replace(/[^\p{L}\p{N}]+/gu," ").trim();

test("v61: preserves 1080 old questions and appends 25",()=>{

 assert.equal(bankV60.length,1080);
 assert.equal(questions.length,1105);
 assert.equal(playableQuestions("production",questions).length,1105);
 assert.equal(publishedNewQuestionsV61.length,25);
 assert.equal(new Set(questions.map(q=>q.id)).size,1105);
 for(const [i,q] of bankV60.entries()) assert.deepEqual(questions[i],q);
});
test("v61: correct answer, source locator and unique question for each prophet",()=>{
 const old=new Set(bankV60.map(q=>norm(q.question))),added=new Set<string>();
 for(const q of publishedNewQuestionsV61){
  assert.equal(q.categoryId,"prophets");assert.equal(q.reviewStatus,"approved");
  assert.ok(q.id.startsWith("q61-"));
  assert.equal(knownQuestion(60,q.id),false);
  assert.equal(knownQuestion(61,q.id),true);
  assert.equal(q.options.length,4);
  assert.equal(new Set(q.options.map(o=>o.id)).size,4);
  assert.equal(new Set(q.options.map(o=>norm(o.text))).size,4);
  assert.ok(q.options.some(o=>o.id===q.correctOptionId));
  assert.ok(q.explanation.length>=70);
  assert.equal(q.sources.length,1);
  assert.ok(q.sources[0]!.locator.length>8);
  assert.equal(q.sources[0]!.checkStatus,"supported");
  assert.ok(q.sources[0]!.url.startsWith("https://islamansiklopedisi.org.tr/"));
  const p=norm(q.question);assert.ok(!old.has(p),q.id);assert.ok(!added.has(p),q.id);added.add(p);
  const order=q.options.map(o=>o.id);
  assert.equal(gameQuestion({bankVersion:61,optionOrders:{[q.id]:order}},q.id)?.correct,order.indexOf(q.correctOptionId));
 }
});
