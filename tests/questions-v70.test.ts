import assert from "node:assert/strict";
import test from "node:test";
import { playableQuestions } from "../src/content/questions";
import { bankV70 as questions } from "../src/content/questions/archive/bank-v70";
import { bankV69 } from "../src/content/questions/archive/bank-v69";
import { publishedNewQuestionsV70 } from "../src/content/questions/published-v70";
import { knownQuestion, gameQuestion } from "../src/content/questions/registry";
const normalize=(s:string)=>s.normalize("NFKC").toLocaleLowerCase("tr-TR").replace(/[^\p{L}\p{N}]+/gu," ").trim();

test("v70: preserves 1435 previous records and has 1468 questions",()=>{
  assert.equal(playableQuestions("production",questions).length,1468);
  assert.equal(bankV69.length,1435);
  assert.equal(questions.length,1468);
  assert.equal(publishedNewQuestionsV70.length,33);
  assert.equal(new Set(questions.map(q=>q.id)).size,1468);
  for(const [index,prev] of bankV69.entries())assert.deepEqual(questions[index],prev);
});

test("v70: distinct sourced prompts, four options and correct answer keys",()=>{
  const prior=new Set(bankV69.map(q=>normalize(q.question)));
  const seen=new Set<string>(),cats:Record<string,number>={};
  for(const q of publishedNewQuestionsV70){
    cats[q.categoryId]=(cats[q.categoryId]??0)+1;
    assert.ok(q.id.startsWith("q70-"));
    assert.equal(q.reviewStatus,"approved");
    assert.equal(knownQuestion(69,q.id),false);
    assert.equal(knownQuestion(70,q.id),true);
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
    assert.equal(gameQuestion({bankVersion:70,optionOrders:{[q.id]:order}},q.id)?.correct,order.indexOf(q.correctOptionId));
  }
  assert.deepEqual(cats,{"general":33});
});
