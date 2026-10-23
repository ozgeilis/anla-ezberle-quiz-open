import assert from "node:assert/strict";
import { test } from "node:test";
import {
  categories,
  playableQuestions,
  Question,
} from "../src/content/questions";
import {
  assessDifficultyRound,
  createSession,
  selectDifficultyQuestions,
  selectionConceptKeys,
} from "../src/domain/game/engine";
import {
  preparationFromParams,
  preparationStatus,
} from "../src/features/categories/preparation";

const bank = playableQuestions("prototype");
const random = (initial: number) => {
  let seed = initial;
  return () =>
    (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296;
};
function independent(questions: readonly Question[]) {
  assert.equal(new Set(questions.map((q) => q.id)).size, 10);
  const keys = questions.flatMap(selectionConceptKeys);
  assert.equal(
    new Set(keys).size,
    keys.length,
    "Every selected concept/template must be independent",
  );
}

test("both entry orders require two explicit choices, allow changes and handle invalid route values", () => {
  const byCategory = preparationFromParams({ category: "prophets" });
  const byDifficulty = preparationFromParams({ difficulty: "easy" });
  assert.equal(preparationStatus(bank, {}).canStart, false);
  assert.equal(preparationStatus(bank, byCategory).canStart, false);
  assert.equal(preparationStatus(bank, byDifficulty).canStart, false);
  const a = { ...byCategory, difficulty: "easy" as const };
  const b = { ...byDifficulty, topic: "peygamberler" as const };
  assert.deepEqual(a, b);
  assert.equal(a.topic, "peygamberler");
  assert.equal(a.category, undefined);
  assert.deepEqual(preparationStatus(bank, a), preparationStatus(bank, b));
  assert.equal(preparationStatus(bank, a).canStart, true);
  assert.equal(
    preparationStatus(bank, { ...a, category: "mixed" }).canStart,
    false, // Selecting two subjects simultaneously is invalid.
  );
  assert.equal(
    preparationStatus(bank, { ...a, category: "mixed", topic: undefined }).canStart,
    true, // The visible Karma control explicitly clears the old topic.
  );
  assert.equal(
    preparationStatus(bank, { ...a, difficulty: undefined }).canStart,
    false,
  );
  assert.deepEqual(
    preparationFromParams({ category: "foreign", difficulty: ["easy"] }),
    { category: undefined, difficulty: undefined },
  );
});

test("v14 preparation and actual selection agree for every category/difficulty and recent order", () => {
  const snapshot = JSON.stringify(bank);
  for (const difficulty of ["easy", "medium", "hard"] as const) {
    for (const category of [undefined, ...categories.map((c) => c.id)]) {
      const status = assessDifficultyRound(bank, difficulty, category);
      assert.equal(
        status.eligibleCount,
        bank.filter(
          (q) =>
            q.difficulty === difficulty &&
            (!category || q.categoryId === category),
        ).length,
      );
      for (let seed = 0; seed < 12; seed++) {
        if (!status.canStart) {
          assert.throws(
            () =>
              selectDifficultyQuestions(
                bank,
                difficulty,
                [],
                random(seed),
                category,
              ),
            /yeterli bağımsız soru/,
          );
          continue;
        }
        const selected = selectDifficultyQuestions(
          bank,
          difficulty,
          bank.slice(seed, seed + 25).map((q) => q.id),
          random(seed),
          category,
        );
        independent(selected);
        assert(
          selected.every(
            (q) =>
              q.difficulty === difficulty &&
              (!category || q.categoryId === category),
          ),
        );
        const session = createSession(
          category ? "focus" : "mixed",
          category,
          1234,
          { channel: "prototype", difficulty, random: random(seed) },
        );
        assert.equal(session.bankVersion, 72);
        independent(
          session.questionIds.map((id) => bank.find((q) => q.id === id)!),
        );
      }
    }
  }
  assert.equal(
    JSON.stringify(bank),
    snapshot,
    "Eligibility must never mutate bank/order/metadata",
  );
});

const sample = bank[0]!;
const fake = (id: string, question: string, conceptGroup = id): Question => ({
  ...sample,
  id,
  question,
  conceptGroup,
  categoryId: "quran",
  difficulty: "easy",
});

test("ten raw questions sharing a surah template do not enable a round or fall back outside filters", () => {
  const templates = Array.from({ length: 12 }, (_, i) =>
    fake(`template-${i}`, `Mushaf sıralamasında ${i + 1}. sûre hangisidir?`),
  );
  // Plenty of other questions exist, but outside the chosen level or category.
  const pool = [
    ...templates,
    ...Array.from({ length: 12 }, (_, i) => ({
      ...fake(`other-${i}`, `Bağımsız başka soru ${i}?`),
      categoryId: "history" as const,
    })),
    ...Array.from({ length: 12 }, (_, i) => ({
      ...fake(`hard-${i}`, `Bağımsız zor soru ${i}?`),
      difficulty: "hard" as const,
    })),
  ];
  const status = preparationStatus(pool, {
    category: "quran",
    difficulty: "easy",
  });
  assert.equal(status.eligibleCount, 12);
  assert.equal(status.canStart, false);
  assert.match(status.message, /Benzer soruları tekrarlamamak/);
  for (let seed = 0; seed < 8; seed++)
    assert.throws(
      () => selectDifficultyQuestions(pool, "easy", [], random(seed), "quran"),
      /yeterli bağımsız soru/,
    );
});

test("exact shared solver recovers a valid ten when greedy first choice would fail", () => {
  const pool = [
    fake(
      "bridge",
      "Mushaf sıralamasında 1. sûre hangisidir?",
      "bridge-concept",
    ),
    fake("left", "Mushaf sıralamasında 2. sûre hangisidir?", "left-concept"),
    fake("right", "Bağımsız köprü kavramı sorusu?", "bridge-concept"),
    ...Array.from({ length: 8 }, (_, i) =>
      fake(`single-${i}`, `Farklı konu sorusu ${i}?`),
    ),
  ];
  // bridge conflicts with both left and right; left/right are compatible.
  assert.equal(assessDifficultyRound(pool, "easy", "quran").canStart, true);
  for (let seed = 0; seed < 20; seed++) {
    const selected = selectDifficultyQuestions(
      pool,
      "easy",
      [],
      random(seed),
      "quran",
    );
    independent(selected);
    assert.equal(
      selected.some((q) => q.id === "bridge"),
      false,
    );
  }
  // Assessment has no RNG dependency and does not create sessions.
  assert.deepEqual(
    assessDifficultyRound(pool, "easy", "quran"),
    assessDifficultyRound([...pool].reverse(), "easy", "quran"),
  );
});
