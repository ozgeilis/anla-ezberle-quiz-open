import assert from "node:assert/strict";
import test from "node:test";
import { playableQuestions } from "../src/content/questions";
import { bankV57 as questions } from "../src/content/questions/archive/bank-v57";
import { bankV56 } from "../src/content/questions/archive/bank-v56";
import { publishedNewQuestionsV57 } from "../src/content/questions/published-v57";
import { gameQuestion,knownQuestion } from "../src/content/questions/registry";
import { selectionConceptKeys } from "../src/domain/game/engine";
const norm=(s:string)=>s.normalize("NFKC").toLocaleLowerCase("tr-TR").replace(/[^\p{L}\p{N}]+/gu," ").trim();

test("v57 keeps the complete v56 catalogue and adds 41 independent IDs",()=>{
 assert.equal(bankV56.length,966);assert.equal(questions.length,1007);
 assert.equal(playableQuestions("production",questions).length,1007);assert.equal(publishedNewQuestionsV57.length,41);
 for(const [i,prior] of bankV56.entries()) assert.deepEqual(questions[i],prior);
 assert.equal(new Set(questions.map(q=>q.id)).size,1007);
});
test("v57 source-matched answers, explanations and distinct prompts",()=>{
 const prior=new Set(bankV56.map(q=>norm(q.question)));
 const seen=new Set<string>();
 const cats:Record<string,number>={};
 for(const q of publishedNewQuestionsV57){
  cats[q.categoryId]=(cats[q.categoryId]??0)+1;
  assert.ok(q.id.startsWith("q57-"));assert.ok(!knownQuestion(56,q.id));
  assert.ok(knownQuestion(57,q.id));assert.equal(q.reviewStatus,"approved");
  assert.equal(q.options.length,4);assert.equal(new Set(q.options.map(o=>o.id)).size,4);
  assert.equal(new Set(q.options.map(o=>norm(o.text))).size,4);
  assert.ok(q.options.some(o=>o.id===q.correctOptionId));
  assert.ok(q.explanation.length>=60);assert.equal(q.sources.length,1);
  assert.ok(q.sources[0]!.url.startsWith("https://islamansiklopedisi.org.tr/"));
  assert.equal(q.sources[0]!.checkStatus,"supported");
  assert.ok(q.sources[0]!.locator.length>=7);
  const prompt=norm(q.question);assert.ok(!prior.has(prompt),q.id+": prior prompt");
  assert.ok(!seen.has(prompt),q.id+": new duplicate");seen.add(prompt);
  const ids=q.options.map(o=>o.id);
  const shown=gameQuestion({bankVersion:57,optionOrders:{[q.id]:ids}},q.id);
  assert.equal(shown?.correct,ids.indexOf(q.correctOptionId));
  assert.ok(selectionConceptKeys(q).includes("concept:"+q.conceptGroup));
 }
 assert.deepEqual(cats,{prophets:21,history:10,general:10});
});
