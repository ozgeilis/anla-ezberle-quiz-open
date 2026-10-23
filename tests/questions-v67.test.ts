import assert from "node:assert/strict";
import test from "node:test";
import { playableQuestions } from "../src/content/questions";
import { bankV67 as questions } from "../src/content/questions/archive/bank-v67";
import { bankV66 } from "../src/content/questions/archive/bank-v66";
import { publishedNewQuestionsV67 } from "../src/content/questions/published-v67";
import { knownQuestion, gameQuestion } from "../src/content/questions/registry";
const norm=(s:string)=>s.normalize("NFKC").toLocaleLowerCase("tr-TR").replace(/[^\p{L}\p{N}]+/gu," ").trim();
test("v67: preserves 1283 historical items and adds 59",()=>{
 assert.equal(bankV66.length,1283);
 assert.equal(questions.length,1342);assert.equal(playableQuestions("production",questions).length,1342);
 assert.equal(publishedNewQuestionsV67.length,59);
 for(const [i,q] of bankV66.entries())assert.deepEqual(questions[i],q);
 assert.equal(new Set(questions.map(q=>q.id)).size,1342);
});
test("v67: verse locators and four-option answer metadata are consistent",()=>{
 const past=new Set(bankV66.map(q=>norm(q.question))),added=new Set<string>(),surahs:Record<string,number>={};
 for(const q of publishedNewQuestionsV67){
  const slug=q.id.split("-")[1]!;surahs[slug]=(surahs[slug]??0)+1;
  assert.equal(q.categoryId,"quran");assert.equal(q.reviewStatus,"approved");
  assert.ok(!knownQuestion(66,q.id));assert.ok(knownQuestion(67,q.id));
  assert.equal(q.options.length,4);assert.equal(new Set(q.options.map(o=>o.id)).size,4);
  assert.equal(new Set(q.options.map(o=>norm(o.text))).size,4);
  assert.ok(q.options.some(o=>o.id===q.correctOptionId));
  assert.ok(q.explanation.length>=65);
  assert.equal(q.sources.length,1);assert.equal(q.sources[0]!.checkStatus,"supported");
  assert.ok(q.sources[0]!.url.startsWith("https://kuran.diyanet.gov.tr/kuran?ayet="));
  const p=norm(q.question);assert.ok(!past.has(p),q.id);assert.ok(!added.has(p),q.id);added.add(p);
  const ids=q.options.map(o=>o.id);
  assert.equal(gameQuestion({bankVersion:67,optionOrders:{[q.id]:ids}},q.id)?.correct,ids.indexOf(q.correctOptionId));
 }
 assert.deepEqual(surahs,{kasas:24,ankebut:17,rum:18});
});
