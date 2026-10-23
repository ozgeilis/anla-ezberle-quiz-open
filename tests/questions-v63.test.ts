import assert from "node:assert/strict";
import test from "node:test";
import { playableQuestions } from "../src/content/questions";
import { bankV63 as questions } from "../src/content/questions/archive/bank-v63";
import { bankV62 } from "../src/content/questions/archive/bank-v62";
import { publishedNewQuestionsV63 } from "../src/content/questions/published-v63";
import { knownQuestion,gameQuestion } from "../src/content/questions/registry";
const norm=(s:string)=>s.normalize("NFKC").toLocaleLowerCase("tr-TR").replace(/[^\p{L}\p{N}]+/gu," ").trim();

test("v63 preserves 1134 historical questions and appends 25 new items",()=>{

 assert.equal(bankV62.length,1134);assert.equal(questions.length,1159);
 assert.equal(playableQuestions("production",questions).length,1159);assert.equal(publishedNewQuestionsV63.length,25);
 assert.equal(new Set(questions.map(q=>q.id)).size,1159);
 for(const [i,q] of bankV62.entries())assert.deepEqual(questions[i],q);
});
test("v63 sourced architecture and medrese content is complete and unique",()=>{
 const previous=new Set(bankV62.map(q=>norm(q.question))),seen=new Set<string>();
 const categories:Record<string,number>={};
 for(const q of publishedNewQuestionsV63){
  categories[q.categoryId]=(categories[q.categoryId]??0)+1;
  assert.equal(q.reviewStatus,"approved");
  assert.ok(q.id.startsWith("q63-"));assert.ok(!knownQuestion(62,q.id));
  assert.ok(knownQuestion(63,q.id));
  assert.equal(q.options.length,4);
  assert.equal(new Set(q.options.map(o=>o.id)).size,4);
  assert.equal(new Set(q.options.map(o=>norm(o.text))).size,4);
  assert.ok(q.options.some(o=>o.id===q.correctOptionId));
  assert.ok(q.explanation.length>=65);
  assert.equal(q.sources.length,1);assert.equal(q.sources[0]!.checkStatus,"supported");
  assert.ok(q.sources[0]!.url.startsWith("https://islamansiklopedisi.org.tr/"));
  const text=norm(q.question);assert.ok(!seen.has(text),q.id);assert.ok(!previous.has(text),q.id);seen.add(text);
  const optionOrder=q.options.map(o=>o.id);
  assert.equal(gameQuestion({bankVersion:63,optionOrders:{[q.id]:optionOrder}},q.id)?.correct,optionOrder.indexOf(q.correctOptionId));
 }
 assert.deepEqual(categories,{history:18,general:7});
});
