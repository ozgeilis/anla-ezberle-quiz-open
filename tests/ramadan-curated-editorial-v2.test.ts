import assert from "node:assert/strict";
import { test } from "node:test";
import {
  questions,
  playableQuestions,
} from "../src/content/questions";
import {
  learningThemeSetsV1,
} from "../src/content/questions/learning-topics-v1";
import {
  assessDifficultyRound,
  selectDifficultyQuestions,
  selectionConceptKeys,
} from "../src/domain/game/engine";
import { preparationFromParams } from "../src/features/categories/preparation";
import { ramadanEasyCuratedV2 } from "../src/content/questions/ramadan-curated-editorial-v2";
import { ramadanSeasonalDraftsV2 } from "../src/content/questions/ramadan-seasonal-drafts-v2";

test("Ramadan pilot is ten distinct objectives, nine historical approvals, one isolated draft", () => {
  const pilot = ramadanEasyCuratedV2;
  const historical = learningThemeSetsV1.find((set) => set.id === "ramazan")!;
  const publishedIds = new Set(questions.map((q) => q.id));
  const bank = new Map(questions.map((q) => [q.id, q]));
  const newDrafts = new Map(ramadanSeasonalDraftsV2.map((q) => [q.id, q]));
  assert.equal(pilot.published, false);
  assert.equal(pilot.level, "easy");
  assert.equal(historical.publicationStatus, "draft");
  assert.equal(pilot.questionIds.length, 10);
  assert.equal(pilot.learningObjectives.length, 10);
  assert.equal(new Set(pilot.learningObjectives).size, 10);
  assert.equal(new Set(pilot.questionIds).size, 10);
  assert.deepEqual(
    pilot.questionIds.filter((id) => !publishedIds.has(id)),
    ["ramadan-draft-shawwal-001"],
  );
  assert.equal(newDrafts.size, 1);
  assert.deepEqual(
    pilot.questionIds.filter((id) => !historical.existingQuestionIds.includes(id)),
    ["v7-quran-004", "ramadan-draft-shawwal-001"],
  );
  assert.deepEqual(
    pilot.removedFromV1Review,
    ["general-007", "v11-quran-005"],
  );
  for (const id of pilot.questionIds) {
    const question = bank.get(id) ?? newDrafts.get(id);
    assert.ok(question, `Curated question not found: ${id}`);
    assert.equal(question.difficulty, "easy");
    assert.equal(question.sources.length > 0, true);
    assert.ok(question.sources.every((source) => source.url.startsWith("https://")));
    if (publishedIds.has(id)) assert.equal(question.reviewStatus, "approved");
    else assert.equal(question.reviewStatus, "draft");
  }
  const published = playableQuestions("production");
  assert.equal(published.length, 1500);
  assert.equal(questions.length, 1500);
  assert.equal(publishedIds.has("ramadan-draft-shawwal-001"), false);
  assert.equal(published.some((q) => q.id === "ramadan-draft-shawwal-001"), false);
  assert.equal(preparationFromParams({ topic: "ramazan" }).topic, undefined);
});

test("The future pilot can technically select all ten unique concepts but remains unplayable", () => {
  const bank = new Map(questions.map((q) => [q.id, q]));
  const preview = ramadanEasyCuratedV2.questionIds.map((id) => {
    const q = bank.get(id) ?? ramadanSeasonalDraftsV2.find((candidate) => candidate.id === id);
    assert.ok(q);
    return q;
  });
  const raw = preview.flatMap(selectionConceptKeys);
  assert.equal(new Set(raw).size, raw.length, "Distinct ID/concept/wording must not collide");
  const stats = assessDifficultyRound(preview, "easy");
  assert.deepEqual(stats, { eligibleCount: 10, canStart: true });
  const selected = selectDifficultyQuestions(preview, "easy", [], () => 0.5);
  assert.deepEqual(
    new Set(selected.map((q) => q.id)),
    new Set(ramadanEasyCuratedV2.questionIds),
  );
  const source = ramadanSeasonalDraftsV2[0]!;
  assert.equal(source.id, "ramadan-draft-shawwal-001");
  assert.equal(source.reviewStatus, "draft");
  assert.equal(source.correctOptionId, "o2");
  assert.equal(source.options.find((o) => o.id === "o2")!.text, "Şevval");
  assert.equal(source.sources[0]!.url, "https://islamansiklopedisi.org.tr/sevval");
  assert.equal(source.sources[0]!.checkStatus, "supported");
  assert.equal(new Set(source.options.map((o) => o.text)).size, 4);
  assert.ok(source.explanation.length >= 60);
});
