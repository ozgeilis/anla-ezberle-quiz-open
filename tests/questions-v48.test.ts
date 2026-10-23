import assert from "node:assert/strict";
import test from "node:test";
import { playableQuestions } from "../src/content/questions";
import { bankV48 as questions } from "../src/content/questions/archive/bank-v48";
import { bankV47 } from "../src/content/questions/archive/bank-v47";
import { publishedNewQuestionsV48 } from "../src/content/questions/published-v48";
import { gameQuestion,knownQuestion } from "../src/content/questions/registry";
import { selectionConceptKeys } from "../src/domain/game/engine";

test("v48 appends 42 sourced questions to immutable 719-question bank", () => {
 assert.equal(bankV47.length,719);
 assert.equal(questions.length,761);
 assert.equal(playableQuestions("production",questions).length,761);
 assert.equal(publishedNewQuestionsV48.length,42);
 for(const [i,q] of bankV47.entries())assert.deepEqual(questions[i],q);
 assert.equal(new Set(questions.map(q=>q.id)).size,761);
});
test("v48 sourced questions have valid options, references and concept diversity", () => {
 const counts={history:0,prophets:0,general:0,quran:0};
 const existing=new Set(bankV47.map(q=>q.question.normalize("NFKC").toLocaleLowerCase("tr-TR")));
 const seen=new Set<string>();
 const groups=new Set<string>();
 for(const q of publishedNewQuestionsV48){
  counts[q.categoryId]++;
  assert.ok(/^q48-[\w-]+-\d{3}$/.test(q.id));
  assert.ok(!knownQuestion(47,q.id));
  assert.ok(knownQuestion(48,q.id));
  assert.equal(q.reviewStatus,"approved");
  assert.equal(q.options.length,4);
  assert.equal(new Set(q.options.map(o=>o.id)).size,4);
  assert.equal(new Set(q.options.map(o=>o.text)).size,4);
  assert.ok(q.options.some(o=>o.id===q.correctOptionId));
  assert.ok(q.explanation.length>=72);
  assert.equal(q.sources.length,1);
  assert.ok(q.sources[0]!.url.startsWith("https://islamansiklopedisi.org.tr/"));
  assert.ok(q.sources[0]!.locator.length>5);
  assert.equal(q.sources[0]!.checkStatus,"supported");
  const t=q.question.normalize("NFKC").toLocaleLowerCase("tr-TR");
  assert.ok(!existing.has(t));
  assert.ok(!seen.has(t));
  seen.add(t);groups.add(q.conceptGroup);
  const order=q.options.map(o=>o.id);
  const view=gameQuestion({bankVersion:48,optionOrders:{[q.id]:order}},q.id);
  assert.equal(view?.correct,order.indexOf(q.correctOptionId));
  assert.ok(selectionConceptKeys(q).includes("concept:"+q.conceptGroup));
 }
 assert.deepEqual(counts,{history:28,prophets:7,general:7,quran:0});
 assert.equal(groups.size,6);
});
