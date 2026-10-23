import { questions1500 as questions } from "../src/content/questions/questions-1500";
import assert from "node:assert/strict";
import test from "node:test";
import { BANK_VERSION, playableQuestions } from "../src/content/questions";
import { bankV70 } from "../src/content/questions/archive/bank-v70";
import { publishedNewQuestionsV71 } from "../src/content/questions/published-v71";
import { knownQuestion, gameQuestion } from "../src/content/questions/registry";
const normalize=(s:string)=>s.normalize("NFKC").toLocaleLowerCase("tr-TR").replace(/[^\p{L}\p{N}]+/gu," ").trim();

test("v71: preserves 1468 previous records and has 1500 questions",()=>{
  assert.equal(BANK_VERSION, 72);
  assert.equal(playableQuestions().length,1500);
  assert.equal(bankV70.length,1468);
  assert.equal(questions.length,1500);
  assert.equal(publishedNewQuestionsV71.length,32);
  assert.equal(new Set(questions.map(q=>q.id)).size,1500);
  for(const [index,prev] of bankV70.entries())assert.deepEqual(questions[index],prev);
});

test("v71: distinct sourced prompts, four options and correct answer keys",()=>{
  const prior=new Set(bankV70.map(q=>normalize(q.question)));
  const seen=new Set<string>(),cats:Record<string,number>={};
  for(const q of publishedNewQuestionsV71){
    cats[q.categoryId]=(cats[q.categoryId]??0)+1;
    assert.ok(q.id.startsWith("q71-"));
    assert.equal(q.reviewStatus,"approved");
    assert.equal(knownQuestion(70,q.id),false);
    assert.equal(knownQuestion(71,q.id),true);
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
    assert.equal(gameQuestion({bankVersion:71,optionOrders:{[q.id]:order}},q.id)?.correct,order.indexOf(q.correctOptionId));
  }
  assert.deepEqual(cats,{"quran":8,"prophets":8,"history":8,"general":8});
});
