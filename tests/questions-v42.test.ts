import assert from "node:assert/strict";
import test from "node:test";
import { bankV42 as questions } from "../src/content/questions/archive/bank-v42";
import { bankV41 } from "../src/content/questions/archive/bank-v41";
import { publishedNewQuestionsV42 } from "../src/content/questions/published-v42";
import { knownQuestion, gameQuestion } from "../src/content/questions/registry";
import { selectionConceptKeys } from "../src/domain/game/engine";

test("v42: previous 600 questions keep their historical IDs and answer content", () => {
  assert.equal(bankV41.length, 600);
  assert.equal(questions.length, 608);
  for (let i = 0; i < bankV41.length; i++) {
    assert.deepEqual(questions[i], bankV41[i]);
  }
  assert.equal(new Set(questions.map((q) => q.id)).size, 608);
});

test("v42: every new question has a unique answer and a specific Diyanet verse", () => {
  const verses = [16, 17, 20, 27, 28, 29, 31, 34];
  assert.equal(publishedNewQuestionsV42.length, verses.length);
  const existing = new Set(bankV41.map((q) => q.question.normalize("NFKC").toLocaleLowerCase("tr-TR")));
  const concepts = new Set<string>();
  for (const [i, q] of publishedNewQuestionsV42.entries()) {
    const verse = verses[i]!;
    assert.equal(q.id, `q42-lokman-${verse}`);
    assert.equal(q.reviewStatus, "approved");
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options.map((o) => o.id)).size, 4);
    assert.equal(new Set(q.options.map((o) => o.text)).size, 4);
    assert.ok(q.options.some((o) => o.id === q.correctOptionId));
    assert.ok(q.explanation.length >= 70);
    assert.ok(!existing.has(q.question.normalize("NFKC").toLocaleLowerCase("tr-TR")));
    assert.equal(q.sources.length, 1);
    assert.match(q.sources[0]!.url, new RegExp(`^https://kuran\\.diyanet\\.gov\\.tr/kuran\\?ayet=${verse}&mode=tefsir&sure=31$`));
    assert.equal(q.sources[0]!.locator, `Lokmân 31/${verse}`);
    assert.equal(q.sources[0]!.checkStatus, "supported");
    assert.equal(knownQuestion(41, q.id), false);
    assert.equal(knownQuestion(42, q.id), true);
    const visible = gameQuestion({bankVersion:42,optionOrders:{[q.id]:q.options.map((o)=>o.id)}}, q.id);
    assert.equal(visible?.correct,q.options.findIndex((o)=>o.id===q.correctOptionId));
    concepts.add(selectionConceptKeys(q)[0]!);
  }
  assert.equal(concepts.size,1,"Questions from the same surah may not overwhelm a single round");
});
