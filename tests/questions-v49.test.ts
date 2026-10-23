import assert from "node:assert/strict";
import test from "node:test";
import { playableQuestions } from "../src/content/questions";
import { bankV49 as questions } from "../src/content/questions/archive/bank-v49";
import { bankV48 } from "../src/content/questions/archive/bank-v48";
import { publishedNewQuestionsV49 } from "../src/content/questions/published-v49";
import { gameQuestion, knownQuestion } from "../src/content/questions/registry";
import { selectionConceptKeys } from "../src/domain/game/engine";

test("v49 appends 32 questions while preserving 761 older question objects", () => {
  assert.equal(bankV48.length, 761);
  assert.equal(questions.length, 793);
  assert.equal(playableQuestions("production",questions).length, 793);
  assert.equal(publishedNewQuestionsV49.length, 32);
  for(const [i,q] of bankV48.entries())assert.deepEqual(questions[i],q);
  assert.equal(new Set(questions.map(q=>q.id)).size,793);
});
test("v49 questions have correct keys, TDV locators and balanced topic groups", () => {
  const existing = new Set(bankV48.map(q=>q.question.normalize("NFKC").toLocaleLowerCase("tr-TR")));
  const seen = new Set<string>();
  const groups = new Set<string>();
  const counts = { general:0,history:0,prophets:0,quran:0 };
  for(const q of publishedNewQuestionsV49) {
    counts[q.categoryId]++;
    assert.ok(/^q49-(biruni|taberi|ihya|kutub)-\d{3}$/.test(q.id));
    assert.ok(!knownQuestion(48,q.id));
    assert.ok(knownQuestion(49,q.id));
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
    const prompt=q.question.normalize("NFKC").toLocaleLowerCase("tr-TR");
    assert.ok(!existing.has(prompt));
    assert.ok(!seen.has(prompt));
    seen.add(prompt);
    groups.add(q.conceptGroup);
    assert.ok(selectionConceptKeys(q).includes("concept:"+q.conceptGroup));
    const order=q.options.map(o=>o.id);
    const visible=gameQuestion({bankVersion:49,optionOrders:{[q.id]:order}},q.id);
    assert.equal(visible?.correct,order.indexOf(q.correctOptionId));
  }
  assert.deepEqual(counts,{general:24,history:8,prophets:0,quran:0});
  assert.equal(groups.size,4);
});
