import assert from "node:assert/strict";
import test from "node:test";
import { playableQuestions } from "../src/content/questions";
import { bankV66 as questions } from "../src/content/questions/archive/bank-v66";
import { bankV65 } from "../src/content/questions/archive/bank-v65";
import { publishedNewQuestionsV66 } from "../src/content/questions/published-v66";
import { knownQuestion, gameQuestion } from "../src/content/questions/registry";
const norm=(s:string)=>s.normalize("NFKC").toLocaleLowerCase("tr-TR").replace(/[^\p{L}\p{N}]+/gu," ").trim();
test("v66 preserves 1231 historical questions and adds 52",()=>{
 assert.equal(bankV65.length,1231);
 assert.equal(questions.length,1283);assert.equal(playableQuestions("production",questions).length,1283);
 assert.equal(publishedNewQuestionsV66.length,52);
 for(const [i,q] of bankV65.entries())assert.deepEqual(questions[i],q);
 assert.equal(new Set(questions.map(q=>q.id)).size,1283);
});
test("v66 Quran story questions have source locators and unambiguous answers",()=>{
 const older=new Set(bankV65.map(q=>norm(q.question))),seen=new Set<string>(),cats:Record<string,number>={};
 for(const q of publishedNewQuestionsV66){
  const surah=q.id.split("-")[1]!;cats[surah]=(cats[surah]??0)+1;
  assert.equal(q.categoryId,"quran");assert.equal(q.reviewStatus,"approved");
  assert.equal(knownQuestion(65,q.id),false);assert.equal(knownQuestion(66,q.id),true);
  assert.equal(q.options.length,4);assert.equal(new Set(q.options.map(o=>o.id)).size,4);
  assert.equal(new Set(q.options.map(o=>norm(o.text))).size,4);
  assert.ok(q.options.some(o=>o.id===q.correctOptionId));
  assert.ok(q.explanation.length>=70);
  assert.equal(q.sources.length,1);
  assert.ok(q.sources[0]!.url.startsWith("https://kuran.diyanet.gov.tr/kuran?ayet="));
  assert.equal(q.sources[0]!.checkStatus,"supported");
  const p=norm(q.question);assert.ok(!seen.has(p),q.id);assert.ok(!older.has(p),q.id);seen.add(p);
  const options=q.options.map(o=>o.id);
  assert.equal(gameQuestion({bankVersion:66,optionOrders:{[q.id]:options}},q.id)?.correct,options.indexOf(q.correctOptionId));
 }
 assert.deepEqual(cats,{kehf:25,neml:17,meryem:10});
 const name=publishedNewQuestionsV66.find(q=>q.id==="q66-neml-name");
 assert.ok(name);
 assert.ok(name!.sources[0]!.url.includes("ayet=18&mode=kuran-meal&sure=27"));
});
