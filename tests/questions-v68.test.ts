import assert from "node:assert/strict";
import test from "node:test";
import { playableQuestions } from "../src/content/questions";
import { bankV68 as questions } from "../src/content/questions/archive/bank-v68";
import { bankV67 } from "../src/content/questions/archive/bank-v67";
import { publishedNewQuestionsV68 } from "../src/content/questions/published-v68";
import { knownQuestion, gameQuestion } from "../src/content/questions/registry";
const norm=(s:string)=>s.normalize("NFKC").toLocaleLowerCase("tr-TR").replace(/[^\p{L}\p{N}]+/gu," ").trim();
test("v68 preserves 1342 question records and adds 46",()=>{
 assert.equal(bankV67.length,1342);
 assert.equal(questions.length,1388);assert.equal(playableQuestions("production",questions).length,1388);
 assert.equal(publishedNewQuestionsV68.length,46);
 for(const [i,q] of bankV67.entries())assert.deepEqual(questions[i],q);
 assert.equal(new Set(questions.map(q=>q.id)).size,1388);
});
test("v68 hadith science questions have valid answer and TDV metadata",()=>{
 const older=new Set(bankV67.map(q=>norm(q.question))),seen=new Set<string>();
 for(const q of publishedNewQuestionsV68){
  assert.equal(q.categoryId,"general");assert.equal(q.reviewStatus,"approved");
  assert.ok(q.id.startsWith("q68-"));assert.ok(!knownQuestion(67,q.id));assert.ok(knownQuestion(68,q.id));
  assert.equal(q.options.length,4);
  assert.equal(new Set(q.options.map(o=>o.id)).size,4);
  assert.equal(new Set(q.options.map(o=>norm(o.text))).size,4);
  assert.ok(q.options.some(o=>o.id===q.correctOptionId));
  assert.ok(q.explanation.length>=65);assert.equal(q.sources.length,1);
  assert.ok(q.sources[0]!.url.startsWith("https://islamansiklopedisi.org.tr/"));
  assert.equal(q.sources[0]!.checkStatus,"supported");
  const p=norm(q.question);assert.ok(!older.has(p),q.id);assert.ok(!seen.has(p),q.id);seen.add(p);
  const order=q.options.map(o=>o.id);
  assert.equal(gameQuestion({bankVersion:68,optionOrders:{[q.id]:order}},q.id)?.correct,order.indexOf(q.correctOptionId));
 }
});
