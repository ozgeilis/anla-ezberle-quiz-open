import assert from "node:assert/strict";
import test from "node:test";
import { playableQuestions } from "../src/content/questions";
import { bankV60 as questions } from "../src/content/questions/archive/bank-v60";
import { bankV59 } from "../src/content/questions/archive/bank-v59";
import { publishedNewQuestionsV60 } from "../src/content/questions/published-v60";
import { knownQuestion,gameQuestion } from "../src/content/questions/registry";
const norm=(s:string)=>s.normalize("NFKC").toLocaleLowerCase("tr-TR").replace(/[^\p{L}\p{N}]+/gu," ").trim();
test("v60: bank carries 1080 questions, v59 unchanged",()=>{
 assert.equal(bankV59.length,1059);
 assert.equal(questions.length,1080);assert.equal(playableQuestions("production",questions).length,1080);
 assert.equal(publishedNewQuestionsV60.length,21);
 for(const [i,q] of bankV59.entries()) assert.deepEqual(questions[i],q);
 assert.equal(new Set(questions.map(q=>q.id)).size,1080);
});
test("v60: education, mosque and early Islam source facts",()=>{
 const prior=new Set(bankV59.map(q=>norm(q.question))),seen=new Set<string>();
 const distribution:Record<string,number>={};
 for(const q of publishedNewQuestionsV60){
  distribution[q.categoryId]=(distribution[q.categoryId]??0)+1;
  assert.ok(q.id.startsWith("q60-"));assert.equal(q.reviewStatus,"approved");
  assert.equal(knownQuestion(59,q.id),false);assert.equal(knownQuestion(60,q.id),true);
  assert.equal(q.options.length,4);assert.equal(new Set(q.options.map(o=>o.id)).size,4);
  assert.equal(new Set(q.options.map(o=>norm(o.text))).size,4);
  assert.ok(q.options.some(o=>o.id===q.correctOptionId));
  assert.ok(q.explanation.length>=65);assert.equal(q.sources.length,1);
  assert.ok(q.sources[0]!.url.startsWith("https://islamansiklopedisi.org.tr/"));
  assert.equal(q.sources[0]!.checkStatus,"supported");
  const p=norm(q.question);assert.ok(!seen.has(p),q.id);assert.ok(!prior.has(p),q.id);seen.add(p);
  const o=q.options.map(x=>x.id);
  assert.equal(gameQuestion({bankVersion:60,optionOrders:{[q.id]:o}},q.id)?.correct,o.indexOf(q.correctOptionId));
 }
 assert.deepEqual(distribution,{history:13,general:8});
});
