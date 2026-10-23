import assert from "node:assert/strict";
import test from "node:test";
import { playableQuestions } from "../src/content/questions";
import { bankV47 as questions } from "../src/content/questions/archive/bank-v47";
import { bankV46 } from "../src/content/questions/archive/bank-v46";
import { publishedNewQuestionsV47 } from "../src/content/questions/published-v47";
import { knownQuestion, gameQuestion } from "../src/content/questions/registry";
import { selectionConceptKeys } from "../src/domain/game/engine";

test("v47: all previous 669 questions remain unchanged, 50 new TDV questions playable", () => {
 assert.equal(bankV46.length,669);
 assert.equal(questions.length,719);
 assert.equal(playableQuestions("production",questions).length,719);
 assert.equal(publishedNewQuestionsV47.length,50);
 for(const [i,q] of bankV46.entries())assert.deepEqual(questions[i],q);
 assert.equal(new Set(questions.map(q=>q.id)).size,719);
});
test("v47: categories, answer keys, source links and semantic groups validated", () => {
 const counts={history:0,prophets:0,general:0,quran:0};
 const oldPrompts=new Set(bankV46.map(q=>q.question.normalize("NFKC").toLocaleLowerCase("tr-TR")));
 const local=new Set<string>();
 const groups=new Set<string>();
 for(const q of publishedNewQuestionsV47){
  counts[q.categoryId]++;
  assert.ok(/^q47-[\p{L}\w-]+-\d{3}$/u.test(q.id));
  assert.ok(!knownQuestion(46,q.id));
  assert.ok(knownQuestion(47,q.id));
  assert.equal(q.reviewStatus,"approved");
  assert.equal(q.options.length,4);
  assert.equal(new Set(q.options.map(o=>o.id)).size,4);
  assert.equal(new Set(q.options.map(o=>o.text)).size,4);
  assert.ok(q.options.some(o=>o.id===q.correctOptionId));
  assert.ok(q.explanation.length>=75);
  assert.equal(q.sources.length,1);
  assert.ok(q.sources[0]!.url.startsWith("https://islamansiklopedisi.org.tr/"));
  assert.ok(q.sources[0]!.locator.length>3);
  assert.equal(q.sources[0]!.checkStatus,"supported");
  const prompt=q.question.normalize("NFKC").toLocaleLowerCase("tr-TR");
  assert.ok(!oldPrompts.has(prompt));
  assert.ok(!local.has(prompt));
  local.add(prompt);
  const order=q.options.map(o=>o.id);
  const view=gameQuestion({bankVersion:47,optionOrders:{[q.id]:order}},q.id);
  assert.equal(view?.correct,order.indexOf(q.correctOptionId));
  assert.ok(selectionConceptKeys(q).includes("concept:"+q.conceptGroup));
  groups.add(q.conceptGroup);
 }
 assert.deepEqual(counts,{history:18,prophets:16,general:16,quran:0});
 assert.equal(groups.size,11,"Each source topic should share a no-repetition concept group");
});
