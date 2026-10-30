import assert from "node:assert/strict";
import { test } from "node:test";
import {
  BANK_VERSION,
  questions,
  playableQuestions,
} from "../src/content/questions";
import {
  assessDifficultyRound,
  selectionConceptKeys,
} from "../src/domain/game/engine";
import { preparationFromParams } from "../src/features/categories/preparation";
import { specialTimes } from "../src/features/categories/category-visuals";
import { seasonalReviewCatalogV1 } from "../src/content/questions/seasonal-review-catalog-v1";
import {
  seasonalDraftRowsV1,
  seasonalQuestionsDraftsV1,
} from "../src/content/questions/seasonal-questions-drafts-v1";

const canon = (text: string) =>
  text
    .normalize("NFKC")
    .toLocaleLowerCase("tr-TR")
    .replace(/[\s\p{P}\p{S}]+/gu, " ")
    .trim();
const byId = new Map(questions.map((q) => [q.id, q]));
const levels = ["easy", "medium", "hard"] as const;

test("All five other seasonal cards map to distinct, locked editorial catalogs", () => {
  const expected = [
    "kadir_gecesi",
    "ramazan_bayrami",
    "kurban_bayrami",
    "hac_mevsimi",
    "muharrem_asura",
  ];
  assert.deepEqual(
    seasonalReviewCatalogV1.map((s) => s.id),
    expected,
  );
  assert.deepEqual(
    specialTimes.slice(1).map((s) => s.id),
    expected,
  );
  for (const category of seasonalReviewCatalogV1) {
    assert.equal(
      preparationFromParams({ topic: category.id }).topic,
      undefined,
    );
    assert.equal(
      new Set(category.existingQuestionIds).size,
      category.existingQuestionIds.length,
    );
    assert.ok(category.editorialWarnings.length);
    for (const id of category.existingQuestionIds) {
      assert.ok(byId.has(id), `Unknown v31 ID: ${category.id}/${id}`);
      assert.equal(byId.get(id)?.reviewStatus, "approved");
    }
  }
  assert.deepEqual(
    seasonalReviewCatalogV1
      .find((s) => s.id === "hac_mevsimi")
      ?.existingQuestionIds.filter((id) => id.includes("quran-")),
    [],
  );
  const hajj = seasonalReviewCatalogV1.find((s) => s.id === "hac_mevsimi")!;
  for (const falsePositive of [
    "e150-quran-039",
    "e150-quran-040",
    "learn-akaid-008",
  ]) {
    assert.equal(
      hajj.existingQuestionIds.includes(falsePositive as never),
      false,
    );
  }
});

test("All nine seasonal questions are sourced, distinctly worded, and unpublished", () => {
  assert.equal(seasonalDraftRowsV1.length, 9);
  assert.equal(seasonalQuestionsDraftsV1.length, 9);
  const countBySeason = Object.fromEntries(
    seasonalReviewCatalogV1.map((s) => [
      s.id,
      seasonalDraftRowsV1.filter((q) => q.season === s.id).length,
    ]),
  );
  assert.deepEqual(countBySeason, {
    kadir_gecesi: 1,
    ramazan_bayrami: 2,
    kurban_bayrami: 2,
    hac_mevsimi: 2,
    muharrem_asura: 2,
  });
  const existingTexts = new Set(questions.map((q) => canon(q.question)));
  const newIds = new Set<string>();
  const draftTexts = new Set<string>();
  for (const draft of seasonalQuestionsDraftsV1) {
    assert.equal(draft.reviewStatus, "draft");
    assert.equal(
      draft.version,
      ["special-sacrifice-length-001", "special-kadir-dawn-001"].includes(
        draft.id,
      )
        ? 2
        : 1,
    );
    assert.ok(draft.id.startsWith("special-"));
    assert.equal(byId.has(draft.id), false);
    assert.equal(newIds.has(draft.id), false);
    newIds.add(draft.id);
    assert.equal(draftTexts.has(canon(draft.question)), false);
    assert.equal(
      existingTexts.has(canon(draft.question)),
      false,
      "Verbatim question in approved bank",
    );
    draftTexts.add(canon(draft.question));
    assert.equal(draft.options.length, 4);
    assert.equal(new Set(draft.options.map((o) => o.id)).size, 4);
    assert.equal(new Set(draft.options.map((o) => canon(o.text))).size, 4);
    assert.ok(draft.options.some((o) => o.id === draft.correctOptionId));
    assert.ok(draft.explanation.trim().length >= 85);
    assert.ok(draft.reviewNotes.includes("uzmanı"));
    assert.equal(
      draft.sources.length,
      draft.id === "special-sacrifice-length-001" ? 2 : 1,
    );
    const source = draft.sources[0]!;
    assert.match(
      source.url,
      /^https:\/\/(?:islamansiklopedisi\.org\.tr|kuran\.diyanet\.gov\.tr)\//,
    );
    assert.equal(source.checkStatus, "supported");
    assert.equal(source.checkedAt, "2026-10-21");
    assert.ok(
      source.locator.length >= 8,
      "Verse locators such as Kadr 97/5 are precise even when short",
    );
    assert.ok(source.supports.length >= 30);
  }
  assert.equal(
    new Set(seasonalQuestionsDraftsV1.map((q) => q.conceptGroup)).size,
    9,
  );
  assert.equal(BANK_VERSION, 73);
  assert.equal(questions.length, 1500);
  assert.equal(playableQuestions("production").length, 1500);
  assert.equal(playableQuestions("prototype").length, 1500);
  assert.ok(
    seasonalQuestionsDraftsV1.every(
      (q) => !playableQuestions("prototype").some((p) => p.id === q.id),
    ),
  );
});

test("Seasonal preview feasibility cannot be interpreted as publication authorization", () => {
  const seasons = new Map(
    seasonalDraftRowsV1.map((row) => [row.id, row.season]),
  );
  for (const category of seasonalReviewCatalogV1) {
    const approved = category.existingQuestionIds.map((id) => byId.get(id)!);
    const unpublished = seasonalQuestionsDraftsV1.filter(
      (q) => seasons.get(q.id) === category.id,
    );
    const preview = [...approved, ...unpublished];
    for (const level of levels) {
      const status = assessDifficultyRound(preview, level);
      assert.ok(status.eligibleCount >= 0);
      if (status.eligibleCount < 10) assert.equal(status.canStart, false);
    }
    // Selection keys are diagnostic, never a replacement for editorial meaning review.
    const keys = unpublished.flatMap(selectionConceptKeys);
    assert.equal(new Set(keys).size, keys.length);
    assert.ok(unpublished.every((q) => !byId.has(q.id)));
    assert.equal(
      preparationFromParams({ topic: category.id }).topic,
      undefined,
    );
  }
});
