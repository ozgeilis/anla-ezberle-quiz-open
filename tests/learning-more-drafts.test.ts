import assert from "node:assert/strict";
import { test } from "node:test";
import { bankV14 } from "../src/content/questions/archive/bank-v14";
import { learningDraftQuestions } from "../src/content/questions/learning-drafts-v1";
import { learningMoreDraftQuestionsV2 } from "../src/content/questions/learning-more-drafts-v2";
import { learningVerseDraftQuestionsV2 } from "../src/content/questions/learning-verse-drafts-v2";
import { learningHistoryDraftQuestionsV2 } from "../src/content/questions/learning-history-drafts-v2";

const toKey = (v: string) => v.normalize("NFKC").toLocaleLowerCase("tr-TR").replace(/[\\s\\p{P}\\p{S}]+/gu," ").trim();

test("80 yeni taslak, önceki 20 taslak ve mevcut 500 soru arasında eşsizdir; yayımlanmaz", () => {
  const extra = [...learningMoreDraftQuestionsV2,...learningVerseDraftQuestionsV2,...learningHistoryDraftQuestionsV2];
  const all = [...bankV14,...learningDraftQuestions,...extra];
  assert.equal(bankV14.length,500);
  assert.equal(learningDraftQuestions.length,20);
  assert.equal(extra.length,80);
  assert.equal(learningMoreDraftQuestionsV2.length,20);
  assert.equal(learningVerseDraftQuestionsV2.length,40);
  assert.equal(learningHistoryDraftQuestionsV2.length,20);
  assert.equal(new Set(all.map(q=>q.id)).size,600);
  assert.equal(new Set(all.map(q=>toKey(q.question))).size,600);
  for(const q of extra) {
    assert.equal(q.reviewStatus,"draft");
    assert.equal(q.sources.length,1);
    assert.equal(q.sources[0]!.checkStatus,"unverified");
    assert.ok(q.sources[0]!.url.startsWith("https://"));
    assert.ok(q.sources[0]!.locator.length>=3);
    assert.equal(q.options.length,4);
    assert.equal(new Set(q.options.map(o=>o.id)).size,4);
    assert.equal(new Set(q.options.map(o=>toKey(o.text))).size,4);
    assert.ok(q.options.some(o=>o.id===q.correctOptionId));
    assert.ok(q.explanation.length>=25);
    assert.ok(q.conceptGroup.length>4);
  }
  const current = new Set(bankV14.map(q=>q.id));
  assert.ok(extra.every(q=>!current.has(q.id)));
});
