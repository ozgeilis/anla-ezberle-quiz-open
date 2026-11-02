import assert from "node:assert/strict";
import { test } from "node:test";
import { playableQuestions } from "../src/content/questions";
import {
  playCategories,
  categoryPool,
  childrenCategory,
} from "../src/domain/game/play-categories";
import {
  categoryOptions,
  visibleCategoryOptions,
  upcomingCollections,
} from "../src/features/categories/learning-options";
import {
  broadPreparationFromParams,
  preparationStatus,
  unavailablePreparationLink,
} from "../src/features/categories/preparation";
import { specialTimes } from "../src/features/categories/category-visuals";

const bank = playableQuestions("production");
test("catalogue exposes only reviewed, independently playable categories in every difficulty", () => {
  const snapshot = JSON.stringify(bank);
  for (const difficulty of [undefined, "easy", "medium", "hard"] as const) {
    const cards = visibleCategoryOptions(bank, difficulty);
    assert.deepEqual(
      cards.map((c) => c.id),
      categoryOptions(bank, difficulty)
        .filter((c) => c.available)
        .map((c) => c.id),
    );
    for (const card of cards) {
      assert(card.available);
      for (const level of difficulty
        ? [difficulty]
        : (["easy", "medium", "hard"] as const).filter((level) =>
            categoryOptions(bank, level).some(
              (c) => c.id === card.id && c.available,
            ),
          ))
        assert.equal(
          preparationStatus(bank, { playCategory: card.id, difficulty: level })
            .canStart,
          true,
        );
    }
  }
  assert.equal(bank.length, 1500);
  assert.equal(JSON.stringify(bank), snapshot);
});
test("empty or insufficient pools leave no disabled catalogue cards and restore only with playable content", () => {
  assert.deepEqual(visibleCategoryOptions([]), []);
  const quran = categoryPool(bank, "quran_dualar");
  const partial = quran.filter((q) => q.difficulty === "easy").slice(0, 3);
  assert.equal(categoryOptions(partial, "easy")[0]!.available, false);
  assert.deepEqual(visibleCategoryOptions(partial, "easy"), []);
  assert.deepEqual(
    visibleCategoryOptions(quran, "easy").map((c) => c.id),
    ["quran_dualar"],
  );
  assert.deepEqual(
    visibleCategoryOptions(quran, "hard").map((c) => c.id),
    ["quran_dualar"],
  );
});
test("unpublished seasonal and child links cannot become a mixed round; valid historical links still resolve", () => {
  const hidden = [
    ...specialTimes.map((s) => s.id),
    ...upcomingCollections.map((c) => c.id),
    childrenCategory.id,
  ];
  for (const id of hidden) {
    assert(unavailablePreparationLink({ playCategory: id }));
    assert(unavailablePreparationLink({ topic: id }));
    assert(unavailablePreparationLink({ category: id }));
  }
  assert.equal(unavailablePreparationLink({}), false);
  assert.equal(unavailablePreparationLink({ category: "mixed" }), false);
  for (const id of ["quran", "prophets", "history", "general"]) {
    assert.equal(unavailablePreparationLink({ category: id }), false);
    assert(broadPreparationFromParams({ category: id }).playCategory);
  }
  assert.equal(
    preparationStatus(bank, { playCategory: "children", difficulty: "easy" })
      .canStart,
    false,
  );
  // Publication remains explicit: artwork/review manifests never participate in eligibility.
  assert.equal(childrenCategory.available, false);
  assert(upcomingCollections.every((c) => c.status === "Hazırlanıyor"));
  assert.deepEqual(
    visibleCategoryOptions(bank).map((c) => c.id),
    playCategories.map((c) => c.id),
  );
});
