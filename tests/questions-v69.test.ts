import assert from "node:assert/strict";
import test from "node:test";
import { playableQuestions } from "../src/content/questions";
import { bankV69 as questions } from "../src/content/questions/archive/bank-v69";
import { bankV68 } from "../src/content/questions/archive/bank-v68";
import { publishedNewQuestionsV69 } from "../src/content/questions/published-v69";
import { knownQuestion, gameQuestion } from "../src/content/questions/registry";
const normalize=(s:string)=>s.normalize("NFKC").toLocaleLowerCase("tr-TR").replace(/[^\p{L}\p{N}]+/gu," ").trim();

test("v69: preserves 1388 previous records and has 1435 questions",()=>{
  assert.equal(playableQuestions("production",questions).length,1435);
  assert.equal(bankV68.length,1388);
  assert.equal(questions.length,1435);
  assert.equal(publishedNewQuestionsV69.length,47);
  assert.equal(new Set(questions.map(q=>q.id)).size,1435);
  for(const [index,prev] of bankV68.entries())assert.deepEqual(questions[index],prev);
});

test("v69: distinct sourced prompts, four options and correct answer keys",()=>{
  const prior=new Set(bankV68.map(q=>normalize(q.question)));
  const seen=new Set<string>(),cats:Record<string,number>={};
  for(const q of publishedNewQuestionsV69){
    cats[q.categoryId]=(cats[q.categoryId]??0)+1;
    assert.ok(q.id.startsWith("q69-"));
    assert.equal(q.reviewStatus,"approved");
    assert.equal(knownQuestion(68,q.id),false);
    assert.equal(knownQuestion(69,q.id),true);
    assert.equal(q.options.length,4);
    assert.equal(new Set(q.options.map(o=>o.id)).size,4);
    assert.equal(new Set(q.options.map(o=>normalize(o.text))).size,4);
    assert.ok(q.options.some(o=>o.id===q.correctOptionId));
    assert.ok(q.explanation.length>=65);
    assert.equal(q.sources.length,1);
    assert.ok(q.sources[0]!.url.startsWith("https://islamansiklopedisi.org.tr/"));
    assert.equal(q.sources[0]!.checkStatus,"supported");
    assert.ok(q.sources[0]!.locator.length>5);
    const p=normalize(q.question);
    assert.ok(!prior.has(p),q.id+": historical prompt");
    assert.ok(!seen.has(p),q.id+": repeated prompt");
    seen.add(p);
    const order=q.options.map(o=>o.id);
    assert.equal(gameQuestion({bankVersion:69,optionOrders:{[q.id]:order}},q.id)?.correct,order.indexOf(q.correctOptionId));
  }
  assert.deepEqual(cats,{"history":47});
});
