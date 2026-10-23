import assert from "node:assert/strict";
import test from "node:test";
import {playableQuestions} from "../src/content/questions";
import {bankV65 as questions} from "../src/content/questions/archive/bank-v65";
import {bankV64} from "../src/content/questions/archive/bank-v64";
import {publishedNewQuestionsV65} from "../src/content/questions/published-v65";
import {knownQuestion,gameQuestion} from "../src/content/questions/registry";
const norm=(s:string)=>s.normalize("NFKC").toLocaleLowerCase("tr-TR").replace(/[^\p{L}\p{N}]+/gu," ").trim();
test("v65: preserves 1191 earlier questions, appends 40",()=>{
 assert.equal(bankV64.length,1191);
 assert.equal(questions.length,1231);assert.equal(playableQuestions("production",questions).length,1231);
 assert.equal(publishedNewQuestionsV65.length,40);
 assert.equal(new Set(questions.map(q=>q.id)).size,1231);
 for(const [i,q] of bankV64.entries()) assert.deepEqual(questions[i],q);
});
test("v65: Quran source locators, answers and prompt uniqueness",()=>{
 const prior=new Set(bankV64.map(q=>norm(q.question))),seen=new Set<string>();
 const groups:Record<string,number>={};
 for(const q of publishedNewQuestionsV65){
  const surah=q.id.split("-")[1]!;groups[surah]=(groups[surah]??0)+1;
  assert.ok(!knownQuestion(64,q.id));assert.ok(knownQuestion(65,q.id));
  assert.equal(q.categoryId,"quran");assert.equal(q.reviewStatus,"approved");
  assert.equal(q.options.length,4);
  assert.equal(new Set(q.options.map(o=>o.id)).size,4);
  assert.equal(new Set(q.options.map(o=>norm(o.text))).size,4);
  assert.ok(q.options.some(o=>o.id===q.correctOptionId));
  assert.ok(q.explanation.length>=65);assert.equal(q.sources.length,1);
  assert.ok(q.sources[0]!.url.startsWith("https://kuran.diyanet.gov.tr/kuran?ayet="));
  assert.equal(q.sources[0]!.checkStatus,"supported");
  const p=norm(q.question);assert.ok(!prior.has(p),q.id);assert.ok(!seen.has(p),q.id);seen.add(p);
  const order=q.options.map(o=>o.id);
  assert.equal(gameQuestion({bankVersion:65,optionOrders:{[q.id]:order}},q.id)?.correct,order.indexOf(q.correctOptionId));
 }
 assert.deepEqual(groups,{isra:12,furkan:11,hucurat:10,hadid:7});
});
