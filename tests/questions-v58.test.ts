import assert from "node:assert/strict";
import test from "node:test";
import { playableQuestions } from "../src/content/questions";
import { bankV58 as questions } from "../src/content/questions/archive/bank-v58";
import { bankV57 } from "../src/content/questions/archive/bank-v57";
import { publishedNewQuestionsV58 } from "../src/content/questions/published-v58";
import { knownQuestion,gameQuestion } from "../src/content/questions/registry";
const norm=(s:string)=>s.normalize("NFKC").toLocaleLowerCase("tr-TR").replace(/[^\p{L}\p{N}]+/gu," ").trim();
test("v58 stores 1031 published questions without changing v57",()=>{
 assert.equal(bankV57.length,1007);assert.equal(questions.length,1031);
 assert.equal(playableQuestions("production",questions).length,1031);assert.equal(publishedNewQuestionsV58.length,24);
 assert.equal(new Set(questions.map(q=>q.id)).size,1031);
 for(const [i,prior] of bankV57.entries())assert.deepEqual(questions[i],prior);
});
test("v58 validates 12 history and 12 general source-linked questions",()=>{
 const prior=new Set(bankV57.map(q=>norm(q.question))),seen=new Set<string>();
 const cats:Record<string,number>={};
 for(const q of publishedNewQuestionsV58){
  cats[q.categoryId]=(cats[q.categoryId]??0)+1;
  assert.ok(q.id.startsWith("q58-"));assert.equal(q.reviewStatus,"approved");
  assert.ok(!knownQuestion(57,q.id));assert.ok(knownQuestion(58,q.id));
  assert.equal(q.options.length,4);assert.equal(new Set(q.options.map(o=>o.id)).size,4);
  assert.equal(new Set(q.options.map(o=>norm(o.text))).size,4);
  assert.ok(q.options.some(o=>o.id===q.correctOptionId));
  assert.ok(q.explanation.length>=60);assert.equal(q.sources.length,1);
  assert.ok(q.sources[0]!.url.startsWith("https://islamansiklopedisi.org.tr/"));
  assert.equal(q.sources[0]!.checkStatus,"supported");
  const prompt=norm(q.question);assert.ok(!prior.has(prompt),q.id);
  assert.ok(!seen.has(prompt),q.id);seen.add(prompt);
  const order=q.options.map(o=>o.id);
  assert.equal(gameQuestion({bankVersion:58,optionOrders:{[q.id]:order}},q.id)?.correct,order.indexOf(q.correctOptionId));
 }
 assert.deepEqual(cats,{history:12,general:12});
});
