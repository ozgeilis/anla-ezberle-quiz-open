import assert from "node:assert/strict";
import { test } from "node:test";
import { bankV14 } from "../src/content/questions/archive/bank-v14";
import { bankV41 } from "../src/content/questions/archive/bank-v41";
import { questions } from "../src/content/questions";
import { learningDraftQuestions, learningDraftTopics } from "../src/content/questions/learning-drafts-v1";
import {
  learningTopicsV1, primaryTopicQuestionIdsV1,
  primaryTopicByQuestionIdV1, learningThemeSetsV1,
  childrenCandidateQuestionIdsV1,
} from "../src/content/questions/learning-topics-v1";

const existing = new Map(bankV14.map(q => [q.id,q]));
const draft = new Map(learningDraftQuestions.map(q => [q.id,q]));

test("yeni konular mevcut 500 sorunun her birini bir ve yalnız bir ana başlığa bağlar", () => {
  assert.equal(bankV14.length, 500);
  assert.equal(questions.length, 1500);
  assert.equal(learningTopicsV1.length, 10);
  const allIds = learningTopicsV1.flatMap(topic => {
    const ids = primaryTopicQuestionIdsV1[topic.id];
    assert.ok(ids.length >= 10, `${topic.title}: en az 10 aday`);
    for(const id of ids) {
      assert.ok(existing.has(id), `Bilinmeyen eski ID: ${id}`);
      assert.equal(primaryTopicByQuestionIdV1[id], topic.id);
    }
    return ids;
  });
  assert.equal(allIds.length, 500);
  assert.equal(new Set(allIds).size, 500);
  assert.deepEqual(new Set(allIds), new Set(existing.keys()));
});

test("orijinal 20 aday, v14'te bulunmayan eşsiz metinlerdir; v15 kaynak-onaylı kopyalar ayrıca yayımlanır", () => {
  assert.equal(learningDraftQuestions.length, 20);
  assert.equal(draft.size, 20);
  assert.deepEqual(
    learningDraftQuestions.reduce((counts,q) => {
      counts[learningDraftTopics[q.id]!] += 1;
      return counts;
    }, { sahaba: 0, dualar: 0 }),
    { sahaba: 10, dualar: 10 },
  );
  const normalized = new Set(bankV14.map(q => q.question.normalize("NFKC").toLocaleLowerCase("tr-TR")));
  for(const q of learningDraftQuestions) {
    assert.equal(existing.has(q.id), false);
    assert.equal(q.reviewStatus, "draft");
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options.map(x => x.id)).size, 4);
    assert.equal(new Set(q.options.map(x => x.text)).size, 4);
    assert.ok(q.options.some(x => x.id === q.correctOptionId));
    assert.ok(q.explanation.length >= 35);
    assert.equal(q.sources.length, 1);
    assert.equal(q.sources[0]!.checkStatus, "supported");
    assert.ok(q.sources[0]!.url.startsWith("https://"));
    assert.ok(q.sources[0]!.locator.length >= 12);
    assert.ok(q.reviewNotes.includes("bağımsız dinî uzman"));
    assert.equal(normalized.has(q.question.normalize("NFKC").toLocaleLowerCase("tr-TR")), false);
    normalized.add(q.question.normalize("NFKC").toLocaleLowerCase("tr-TR"));
  }
});

test("tematik setler ve çocuk adayları sağlam kimliklere işaret eder; henüz yayına açılmaz", () => {
  assert.equal(learningThemeSetsV1.length, 3);
  const setIds = new Set(learningThemeSetsV1.map(s => s.id));
  assert.deepEqual(setIds, new Set(["ramazan","peygamberimizin_hayati","kadin_sahabeler"]));
  for(const set of learningThemeSetsV1) {
    assert.equal(set.publicationStatus,"draft");
    assert.equal(new Set(set.existingQuestionIds).size,set.existingQuestionIds.length);
    assert.ok(set.existingQuestionIds.every(id => existing.has(id)));
    assert.ok(set.draftQuestionIds.every(id => draft.has(id)));
    if(set.id === "kadin_sahabeler") {
      assert.ok(set.existingQuestionIds.length < 10);
      assert.equal(set.draftQuestionIds.length,10);
      assert.ok(set.draftQuestionIds.every(id => learningDraftTopics[id] === "sahaba"));
    } else {
      assert.ok(set.existingQuestionIds.length >= 10);
      assert.equal(set.draftQuestionIds.length,0);
    }
  }
  assert.equal(childrenCandidateQuestionIdsV1.length, 32);
  assert.equal(new Set(childrenCandidateQuestionIdsV1).size, 32);
  for(const id of childrenCandidateQuestionIdsV1) {
    assert.equal(existing.get(id)?.difficulty, "easy", `Çocuk adayı Kolay değil: ${id}`);
  }
  // The draft question pool remains an unreferenced module, not part of bankV14.
  assert.equal(bankV41.filter(q => q.id.startsWith("learn-")).length,94);
});
