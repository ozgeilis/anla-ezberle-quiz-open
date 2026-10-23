import assert from "node:assert/strict";
import test from "node:test";
import { playableQuestions } from "../src/content/questions";
import { bankV59 as questions } from "../src/content/questions/archive/bank-v59";
import { bankV58 } from "../src/content/questions/archive/bank-v58";
import { publishedNewQuestionsV59 } from "../src/content/questions/published-v59";
import { knownQuestion,gameQuestion } from "../src/content/questions/registry";
const normalize=(s:string)=>s.normalize("NFKC").toLocaleLowerCase("tr-TR").replace(/[^\p{L}\p{N}]+/gu," ").trim();
test("v59: all 1031 v58 questions are immutable and 28 questions added",()=>{
 assert.equal(bankV58.length,1031);assert.equal(questions.length,1059);
 assert.equal(playableQuestions("production",questions).length,1059);assert.equal(publishedNewQuestionsV59.length,28);
 for(const [i,q] of bankV58.entries())assert.deepEqual(questions[i],q);
 assert.equal(new Set(questions.map(q=>q.id)).size,1059);
});
test("v59: science, heritage and travel questions have distinct prompts and sources",()=>{
 const older=new Set(bankV58.map(q=>normalize(q.question))),seen=new Set<string>();
 const totals:Record<string,number>={};
 for(const q of publishedNewQuestionsV59){
  totals[q.categoryId]=(totals[q.categoryId]??0)+1;
  assert.ok(q.id.startsWith("q59-"));assert.equal(q.reviewStatus,"approved");
  assert.equal(knownQuestion(58,q.id),false);assert.equal(knownQuestion(59,q.id),true);
  assert.equal(q.options.length,4);assert.equal(new Set(q.options.map(o=>o.id)).size,4);
  assert.equal(new Set(q.options.map(o=>normalize(o.text))).size,4);
  assert.ok(q.options.some(o=>o.id===q.correctOptionId));
  assert.ok(q.explanation.length>=65);assert.equal(q.sources.length,1);
  assert.equal(q.sources[0]!.checkStatus,"supported");
  assert.ok(q.sources[0]!.url.startsWith("https://islamansiklopedisi.org.tr/"));
  const prompt=normalize(q.question);assert.ok(!seen.has(prompt),q.id);assert.ok(!older.has(prompt),q.id);seen.add(prompt);
  const order=q.options.map(o=>o.id);
  assert.equal(gameQuestion({bankVersion:59,optionOrders:{[q.id]:order}},q.id)?.correct,order.indexOf(q.correctOptionId));
 }
 assert.deepEqual(totals,{general:15,history:13});
});
