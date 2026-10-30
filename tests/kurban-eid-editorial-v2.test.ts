import assert from "node:assert/strict";
import { test } from "node:test";
import {
  BANK_VERSION,
  questions,
  playableQuestions,
} from "../src/content/questions";
import { preparationFromParams } from "../src/features/categories/preparation";
import { seasonalQuestionsDraftsV1 } from "../src/content/questions/seasonal-questions-drafts-v1";
import { seasonalReviewCatalogV1 } from "../src/content/questions/seasonal-review-catalog-v1";
import { kurbanBayramiNewDraftsV2 } from "../src/content/questions/kurban-eid-drafts-v2";
import { kurbanBayramiEasyEditorialV2 } from "../src/content/questions/kurban-eid-editorial-v2";
import {
  assessDifficultyRound,
  selectDifficultyQuestions,
  selectionConceptKeys,
} from "../src/domain/game/engine";

const canon = (s: string) =>
  s
    .normalize("NFKC")
    .toLocaleLowerCase("tr-TR")
    .replace(/[\s\p{P}\p{S}]+/gu, " ")
    .trim();
const extraDrafts = [...seasonalQuestionsDraftsV1, ...kurbanBayramiNewDraftsV2];
const poolById = new Map(extraDrafts.map((q) => [q.id, q]));

test("Eid al-Adha ten-objective editorial pilot is complete, coherent, and remains locked", () => {
  const pilot = kurbanBayramiEasyEditorialV2;
  assert.equal(pilot.seasonId, "kurban_bayrami");
  assert.equal(pilot.status, "draft");
  assert.equal(pilot.published, false);
  assert.equal(pilot.level, "easy");
  assert.equal(pilot.intendedQuestionCount, 10);
  assert.equal(pilot.questionIds.length, 10);
  assert.equal(new Set(pilot.questionIds).size, 10);
  assert.equal(pilot.learningObjectives.length, 10);
  assert.equal(new Set(pilot.learningObjectives).size, 10);
  assert.ok(pilot.openQuestions.length >= 3);
  const selected = pilot.questionIds.map((id) => {
    const q = poolById.get(id);
    assert.ok(q, `Missing candidate ID ${id}`);
    assert.equal(q.reviewStatus, "draft");
    assert.equal(q.difficulty, "easy");
    return q;
  });
  const keys = selected.flatMap(selectionConceptKeys);
  assert.equal(
    new Set(keys).size,
    keys.length,
    "Question/fact concept keys overlap",
  );
  assert.deepEqual(assessDifficultyRound(selected, "easy"), {
    eligibleCount: 10,
    canStart: true,
  });
  const preview = selectDifficultyQuestions(selected, "easy", [], () => 0.5);
  assert.deepEqual(
    new Set(preview.map((q) => q.id)),
    new Set(pilot.questionIds),
  );
  assert.equal(
    preparationFromParams({ topic: "kurban_bayrami" }).topic,
    undefined,
  );
  assert.deepEqual(
    seasonalReviewCatalogV1.find((s) => s.id === "kurban_bayrami")
      ?.existingQuestionIds,
    [],
  );
});

test("Eight new drafts have traceable answers, sources and no overlap with published questions", () => {
  assert.equal(kurbanBayramiNewDraftsV2.length, 8);
  const publishedIds = new Set(questions.map((q) => q.id));
  const publishedPrompts = new Set(questions.map((q) => canon(q.question)));
  const previousDraftPrompts = new Set(
    seasonalQuestionsDraftsV1.map((q) => canon(q.question)),
  );
  const draftTexts = new Set<string>();
  const draftKeys = new Set<string>();
  for (const q of kurbanBayramiNewDraftsV2) {
    assert.match(q.id, /^special-sacrifice-/);
    assert.equal(q.version, 2);
    assert.equal(q.reviewStatus, "draft");
    assert.equal(q.difficulty, "easy");
    assert.equal(publishedIds.has(q.id), false);
    assert.equal(publishedPrompts.has(canon(q.question)), false);
    assert.equal(previousDraftPrompts.has(canon(q.question)), false);
    assert.equal(draftTexts.has(canon(q.question)), false);
    draftTexts.add(canon(q.question));
    assert.equal(draftKeys.has(q.conceptGroup), false);
    draftKeys.add(q.conceptGroup);
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options.map((o) => o.id)).size, 4);
    assert.equal(new Set(q.options.map((o) => canon(o.text))).size, 4);
    assert.ok(q.options.some((o) => o.id === q.correctOptionId));
    assert.ok(q.question.trim().endsWith("?"));
    assert.ok(q.explanation.trim().length > 80);
    assert.equal(
      q.sources.length,
      [
        "special-sacrifice-animal-types-002",
        "special-sacrifice-smallshare-002",
        "special-sacrifice-largeshare-002",
      ].includes(q.id)
        ? 2
        : 1,
    );
    const source = q.sources[0]!;
    assert.ok(
      /^https:\/\/(?:islamansiklopedisi\.org\.tr|kuran\.diyanet\.gov\.tr|kurul\.diyanet\.gov\.tr)\//.test(
        source.url,
      ),
    );
    assert.equal(source.checkStatus, "supported");
    assert.equal(source.checkedAt, "2026-10-21");
    assert.ok(source.locator.length >= 14);
    assert.ok(source.supports.length >= 45);
    assert.ok(q.reviewNotes.includes("uzman"));
  }
  assert.equal(BANK_VERSION, 73);
  assert.equal(questions.length, 1500);
  assert.equal(playableQuestions("production").length, 1500);
  assert.equal(playableQuestions("prototype").length, 1500);
  const published = new Set(playableQuestions("prototype").map((q) => q.id));
  assert.ok(kurbanBayramiNewDraftsV2.every((q) => !published.has(q.id)));
  assert.ok(seasonalQuestionsDraftsV1.every((q) => !published.has(q.id)));
});

test("High-risk fiqh and verse notes remain accurately source-aligned", () => {
  const byId = new Map(
    [...seasonalQuestionsDraftsV1, ...kurbanBayramiNewDraftsV2].map((q) => [
      q.id,
      q,
    ]),
  );
  const verse36 = byId.get("special-sacrifice-sharing-002")!;
  assert.equal(new URL(verse36.sources[0]!.url).searchParams.get("ayet"), "36");
  assert.ok(verse36.sources[0]!.locator.includes("22/36"));
  assert.equal(verse36.correctOptionId, "o2");
  const verse37 = byId.get("special-sacrifice-taqwa-002")!;
  assert.equal(new URL(verse37.sources[0]!.url).searchParams.get("ayet"), "37");
  assert.ok(verse37.sources[0]!.locator.includes("22/37"));
  const slaughter = byId.get("special-sacrifice-length-001")!;
  assert.match(slaughter.explanation, /Hanefî.*üçüncü/);
  assert.match(slaughter.explanation, /Şâfiî.*dördüncü/);
  const sheep = byId.get("special-sacrifice-smallshare-002")!;
  assert.match(sheep.explanation, /aile.*sevaba/);
  const cattle = byId.get("special-sacrifice-largeshare-002")!;
  assert.ok(cattle.explanation.includes("Mâlikî"));
});
