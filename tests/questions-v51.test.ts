import assert from "node:assert/strict";
import test from "node:test";
import { playableQuestions } from "../src/content/questions";
import { bankV51 as questions } from "../src/content/questions/archive/bank-v51";
import { bankV50 } from "../src/content/questions/archive/bank-v50";
import { publishedNewQuestionsV51 } from "../src/content/questions/published-v51";
import { gameQuestion,knownQuestion } from "../src/content/questions/registry";
import { selectionConceptKeys } from "../src/domain/game/engine";

test("v51 appends 24 distinct questions to a frozen 816-question bank", () => {
  assert.equal(bankV50.length,816);
  assert.equal(questions.length,840);
  assert.equal(playableQuestions("production",questions).length,840);
  assert.equal(publishedNewQuestionsV51.length,24);
  for(const [i,q] of bankV50.entries())assert.deepEqual(questions[i],q);
  assert.equal(new Set(questions.map(q=>q.id)).size,840);
});
test("v51 question metadata, TDV sources, categories and topic groups", () => {
  const oldPrompts=new Set(bankV50.map(q=>q.question.normalize("NFKC").toLocaleLowerCase("tr-TR")));
  const local=new Set<string>(); const groups=new Set<string>();
  const counts={history:0,prophets:0,general:0,quran:0};
  for(const q of publishedNewQuestionsV51){
    counts[q.categoryId]++;
    assert.ok(/^q51-(ensar|muahat|suffe)-\d{3}$/.test(q.id));
    assert.ok(!knownQuestion(50,q.id));
    assert.ok(knownQuestion(51,q.id));
    assert.equal(q.reviewStatus,"approved");
    assert.equal(q.options.length,4);
    assert.equal(new Set(q.options.map(o=>o.id)).size,4);
    assert.equal(new Set(q.options.map(o=>o.text)).size,4);
    assert.ok(q.options.some(o=>o.id===q.correctOptionId));
    assert.ok(q.explanation.length>=72);
    assert.equal(q.sources.length,1);
    assert.ok(q.sources[0]!.url.startsWith("https://islamansiklopedisi.org.tr/"));
    assert.equal(q.sources[0]!.checkStatus,"supported");
    const prompt=q.question.normalize("NFKC").toLocaleLowerCase("tr-TR");
    assert.ok(!oldPrompts.has(prompt));
    assert.ok(!local.has(prompt));
    local.add(prompt);groups.add(q.conceptGroup);
    assert.ok(selectionConceptKeys(q).includes("concept:"+q.conceptGroup));
    const order=q.options.map(o=>o.id);
    const visible=gameQuestion({bankVersion:51,optionOrders:{[q.id]:order}},q.id);
    assert.equal(visible?.correct,order.indexOf(q.correctOptionId));
  }
  assert.deepEqual(counts,{history:16,prophets:0,general:8,quran:0});
  assert.equal(groups.size,3);
});
