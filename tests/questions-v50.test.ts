import assert from "node:assert/strict";
import test from "node:test";
import { playableQuestions } from "../src/content/questions";
import { bankV50 as questions } from "../src/content/questions/archive/bank-v50";
import { bankV49 } from "../src/content/questions/archive/bank-v49";
import { publishedNewQuestionsV50 } from "../src/content/questions/published-v50";
import { gameQuestion, knownQuestion } from "../src/content/questions/registry";
import { selectionConceptKeys } from "../src/domain/game/engine";

test("v50 adds 23 prophets questions without changing any previous question", () => {
  assert.equal(bankV49.length,793);
  assert.equal(questions.length,816);
  assert.equal(playableQuestions("production",questions).length,816);
  assert.equal(publishedNewQuestionsV50.length,23);
  for(const [i,old] of bankV49.entries())assert.deepEqual(questions[i],old);
  assert.equal(new Set(questions.map(q=>q.id)).size,816);
});
test("v50 prophets questions use checked TDV locators, unique answers and topic separation", () => {
  const prior=new Set(bankV49.map(q=>q.question.normalize("NFKC").toLocaleLowerCase("tr-TR")));
  const newer=new Set<string>();const groups=new Set<string>();
  for(const q of publishedNewQuestionsV50) {
    assert.ok(/^q50-(hud|suayb|lut|zekeriyya)-\d{3}$/.test(q.id));
    assert.equal(q.categoryId,"prophets");
    assert.equal(q.reviewStatus,"approved");
    assert.ok(!knownQuestion(49,q.id));
    assert.ok(knownQuestion(50,q.id));
    assert.equal(q.options.length,4);
    assert.equal(new Set(q.options.map(o=>o.id)).size,4);
    assert.equal(new Set(q.options.map(o=>o.text)).size,4);
    assert.ok(q.options.some(o=>o.id===q.correctOptionId));
    assert.ok(q.explanation.length>=72);
    assert.equal(q.sources.length,1);
    assert.ok(q.sources[0]!.url.startsWith("https://islamansiklopedisi.org.tr/"));
    assert.ok(q.sources[0]!.locator.length>4);
    assert.equal(q.sources[0]!.checkStatus,"supported");
    const prompt=q.question.normalize("NFKC").toLocaleLowerCase("tr-TR");
    assert.ok(!prior.has(prompt));
    assert.ok(!newer.has(prompt));
    newer.add(prompt);groups.add(q.conceptGroup);
    assert.ok(selectionConceptKeys(q).includes("concept:"+q.conceptGroup));
    const order=q.options.map(o=>o.id);
    const display=gameQuestion({bankVersion:50,optionOrders:{[q.id]:order}},q.id);
    assert.equal(display?.correct,order.indexOf(q.correctOptionId));
  }
  assert.equal(groups.size,4);
});
