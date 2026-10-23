import assert from "node:assert/strict";
import test from "node:test";
import { playableQuestions } from "../src/content/questions";
import { bankV64 as questions } from "../src/content/questions/archive/bank-v64";
import { bankV63 } from "../src/content/questions/archive/bank-v63";
import { publishedNewQuestionsV64 } from "../src/content/questions/published-v64";
import { knownQuestion,gameQuestion } from "../src/content/questions/registry";
const norm=(s:string)=>s.normalize("NFKC").toLocaleLowerCase("tr-TR").replace(/[^\p{L}\p{N}]+/gu," ").trim();
test("v64 has 1191 published questions without rewriting v63 records",()=>{
 assert.equal(bankV63.length,1159);
 assert.equal(questions.length,1191);assert.equal(playableQuestions("production",questions).length,1191);
 assert.equal(publishedNewQuestionsV64.length,32);
 for(const [i,q] of bankV63.entries())assert.deepEqual(questions[i],q);
 assert.equal(new Set(questions.map(q=>q.id)).size,1191);
});
test("v64 siyer facts have checkable source and independent answers",()=>{
 const historical=new Set(bankV63.map(q=>norm(q.question))),added=new Set<string>(),counts:Record<string,number>={};
 for(const q of publishedNewQuestionsV64){
  counts[q.categoryId]=(counts[q.categoryId]??0)+1;
  assert.ok(q.id.startsWith("q64-"));
  assert.equal(q.reviewStatus,"approved");
  assert.ok(!knownQuestion(63,q.id));assert.ok(knownQuestion(64,q.id));
  assert.equal(q.options.length,4);assert.equal(new Set(q.options.map(o=>o.id)).size,4);
  assert.equal(new Set(q.options.map(o=>norm(o.text))).size,4);
  assert.ok(q.options.some(o=>o.id===q.correctOptionId));
  assert.ok(q.explanation.length>=65);assert.equal(q.sources.length,1);
  assert.equal(q.sources[0]!.checkStatus,"supported");
  assert.ok(q.sources[0]!.url.startsWith("https://islamansiklopedisi.org.tr/"));
  const t=norm(q.question);assert.ok(!historical.has(t),q.id);assert.ok(!added.has(t),q.id);added.add(t);
  const o=q.options.map(x=>x.id);
  assert.equal(gameQuestion({bankVersion:64,optionOrders:{[q.id]:o}},q.id)?.correct,o.indexOf(q.correctOptionId));
 }
 assert.deepEqual(counts,{history:29,general:3});
});
