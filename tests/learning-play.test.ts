import assert from "node:assert/strict";
import { test } from "node:test";
import { questions, playableQuestions } from "../src/content/questions";
import { bankV13 } from "../src/content/questions/archive/bank-v13";
import { bankV14 } from "../src/content/questions/archive/bank-v14";
import {
  learningTopicsV1,
  LearningTopicId,
} from "../src/content/questions/learning-topics-v1";
import { learningDraftQuestions } from "../src/content/questions/learning-drafts-v1";
import { learningMoreDraftQuestionsV2 } from "../src/content/questions/learning-more-drafts-v2";
import { learningVerseDraftQuestionsV2 } from "../src/content/questions/learning-verse-drafts-v2";
import { learningHistoryDraftQuestionsV2 } from "../src/content/questions/learning-history-drafts-v2";
import {
  answerQuestion,
  advanceQuestion,
  createSession,
  finishSession,
  selectionConceptKeys,
  stats,
} from "../src/domain/game/engine";
import {
  belongsToLearningTopic,
  learningTopicPool,
} from "../src/domain/game/learning";
import {
  learningOptions,
  upcomingCollections,
} from "../src/features/categories/learning-options";
import {
  preparationFromParams,
  preparationStatus,
} from "../src/features/categories/preparation";
import { appendGame, emptyData, parseData } from "../src/storage/schema";
import { progress } from "../src/domain/scoring/progress";

const bank = playableQuestions("prototype");
const drafts = [
  ...learningDraftQuestions,
  ...learningMoreDraftQuestionsV2,
  ...learningVerseDraftQuestionsV2,
  ...learningHistoryDraftQuestionsV2,
];
const time = 1_800_000_000_000;
const random = (initial: number) => {
  let seed = initial;
  return () =>
    (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296;
};
function complete(session: ReturnType<typeof createSession>) {
  for (let i = 0; i < 10; i++) {
    session = answerQuestion(session, i % 4, time + (i + 1) * 1000);
    if (i < 9) session = advanceQuestion(session);
  }
  return finishSession(session);
}

test("learning topic and difficulty work in either order; legacy and topic choices never overlap", () => {
  const subjectFirst = preparationFromParams({ topic: "siyer" });
  const levelFirst = preparationFromParams({ difficulty: "easy" });
  assert.equal(preparationStatus(bank, subjectFirst).canStart, false);
  assert.equal(preparationStatus(bank, levelFirst).canStart, false);
  assert.deepEqual(
    preparationStatus(bank, { ...subjectFirst, difficulty: "easy" }),
    preparationStatus(bank, { ...levelFirst, topic: "siyer" }),
  );
  assert.equal(
    preparationStatus(bank, { topic: "siyer", difficulty: "easy" }).canStart,
    true,
  );
  assert.equal(
    preparationStatus(bank, {
      topic: "siyer",
      category: "history",
      difficulty: "easy",
    }).canStart,
    false,
  );
  assert.equal(
    preparationFromParams({ topic: "siyer", category: "quran" }).category,
    undefined,
  );
  for (const id of [
    "ramazan",
    "peygamberimizin_hayati",
    "kadin_sahabeler",
    "children",
    "foreign",
  ]) {
    assert.equal(preparationFromParams({ topic: id }).topic, undefined);
    assert.throws(
      () =>
        createSession("mixed", undefined, time, {
          difficulty: "easy",
          learningTopic: id as LearningTopicId,
        }),
      /geçerli bir konu/,
    );
  }
  assert.throws(
    () =>
      createSession("focus", "history", time, {
        difficulty: "easy",
        learningTopic: "siyer",
      }),
    /geçerli bir konu/,
  );
  assert.throws(
    () => createSession("mixed", undefined, time, { learningTopic: "siyer" }),
    /geçerli bir konu/,
  );
});

test("all 30 topic/level options use the real independent selector, without out-of-topic or level fallback", () => {
  const snapshot = JSON.stringify(bank);
  let blocked = 0,
    playable = 0;
  for (const difficulty of ["easy", "medium", "hard"] as const) {
    const options = learningOptions(bank, difficulty);
    for (const topic of options) {
      const status = preparationStatus(bank, { topic: topic.id, difficulty });
      assert.equal(topic.available, status.canStart);
      assert.equal(topic.count, status.eligibleCount);
      for (let seed = 1; seed <= 5; seed++) {
        const settings = {
          difficulty,
          learningTopic: topic.id,
          channel: "prototype" as const,
          random: random(seed),
          recentIds: bank.slice(seed, seed + 20).map((q) => q.id),
        };
        if (!topic.available) {
          assert.throws(
            () => createSession("mixed", undefined, time, settings),
            /yeterli bağımsız soru/,
          );
          continue;
        }
        const session = createSession("mixed", undefined, time, settings);
        assert.equal(session.learningTopic, topic.id);
        assert.equal(session.learningTopicVersion, 3);
        assert.equal(session.bankVersion, 72);
        assert.equal(session.focus, undefined);
        assert.equal(new Set(session.questionIds).size, 10);
        const selected = session.questionIds.map((id) =>
          bank.find((q) => q.id === id)!,
        );
        assert(
          selected.every(
            (q) =>
              q.difficulty === difficulty &&
              belongsToLearningTopic(q.id, topic.id),
          ),
        );
        const keys = selected.flatMap(selectionConceptKeys);
        assert.equal(new Set(keys).size, keys.length);
      }
      if (topic.available) playable++;
      else blocked++;
    }
  }
  assert.equal(playable + blocked, 30);
  assert(blocked > 0 && playable > 0);
  const hardQuran = learningOptions(bank, "hard").find(
    (t) => t.id === "quran",
  )!;
  assert.equal(
    hardQuran.count,
    bank.filter(
      (q) => q.difficulty === "hard" && belongsToLearningTopic(q.id, "quran"),
    ).length,
  );
  assert.equal(
    hardQuran.available,
    preparationStatus(bank, { topic: "quran", difficulty: "hard" }).canStart,
  );
  assert.equal(JSON.stringify(bank), snapshot);
  const beforeLevel = learningOptions(bank);
  for (const option of beforeLevel) {
    const possible = (["easy", "medium", "hard"] as const).some(
      (difficulty) =>
        preparationStatus(bank, { topic: option.id, difficulty }).canStart,
    );
    assert.equal(option.available, possible);
  }
  assert.equal(beforeLevel.find((t) => t.id === "dualar")!.available, true);
});

test("100 unpublished drafts never enter topic pools, even in prototype or alongside approved questions", () => {
  assert.equal(drafts.length, 100);
  assert.equal(questions.length, 1500);
  assert(drafts.every((q) => q.reviewStatus === "draft"));
  const combined = [...bank, ...drafts];
  for (const topic of learningTopicsV1) {
    assert.deepEqual(
      learningTopicPool(combined, topic.id),
      learningTopicPool(bank, topic.id),
    );
    // Even an accidentally downgraded mapped question is excluded.
    const q = learningTopicPool(bank, topic.id)[0]!;
    assert.equal(
      learningTopicPool([{ ...q, reviewStatus: "draft" }], topic.id).length,
      0,
    );
  }
  for (const difficulty of ["easy", "medium", "hard"] as const)
    assert.deepEqual(
      learningOptions(combined, difficulty),
      learningOptions(bank, difficulty),
    );
  assert.deepEqual(
    upcomingCollections.map((c) => c.id),
    ["ramazan", "peygamberimizin_hayati", "kadin_sahabeler"],
  );
  assert(
    upcomingCollections.every(
      (c) => c.status === "Hazırlanıyor" && c.reason.length > 20,
    ),
  );
});

test("topic results round-trip with a frozen taxonomy; foreign topic IDs/versions/questions are rejected", () => {
  const session = createSession("mixed", undefined, time, {
    learningTopic: "siyer",
    difficulty: "easy",
    channel: "prototype",
  });
  const record = complete(session);
  assert.deepEqual(
    parseData(JSON.stringify(appendGame(emptyData(), record))).games[0],
    record,
  );
  const replay = createSession(record.mode, record.focus, time + 60_000, {
    learningTopic: record.learningTopic,
    difficulty: record.difficulty,
  });
  assert.notEqual(replay.id, record.id);
  assert.equal(replay.learningTopic, "siyer");
  assert.equal(replay.difficulty, "easy");
  const rejects = (changed: unknown) =>
    assert.throws(
      () => parseData(JSON.stringify({ ...emptyData(), games: [changed] })),
      /doğrulanamadı/,
    );
  rejects({ ...record, learningTopic: "kadin_sahabeler" });
  rejects({ ...record, learningTopicVersion: 4 });
  rejects({ ...record, learningTopic: undefined });
  rejects({ ...record, learningTopicVersion: undefined });
  rejects({ ...record, bankVersion: 13 });
  rejects({ ...record, learningTopic: "quran" });
  rejects({ ...record, mode: "focus", focus: "history" });
  // Topic membership, not the historical broad category, is the constraint.
  assert(
    new Set(learningTopicPool(bank, "siyer").map((q) => q.categoryId)).size > 1,
  );
});

test("legacy v13/v14 games keep their bytes, scores and XP when learning-topic results are appended", () => {
  // Build real historical game records rather than relabelling a v15 game:
  // new IDs must never appear in v13/v14 stored answers.
  const archived = (bankVersion: 13 | 14, catalog: typeof bankV13) => {
    const selected = catalog.slice(0, 10);
    return {
      id: `quiz-legacy-${bankVersion}-learning-test`,
      bankVersion,
      mode: "mixed" as const,
      questionIds: selected.map((q) => q.id),
      optionOrders: Object.fromEntries(
        selected.map((q) => [q.id, q.options.map((o) => o.id)]),
      ),
      startedAt: time,
      completedAt: time + 10_000,
      answers: selected.map((q, i) => ({
        questionId: q.id,
        option: q.options.findIndex((o) => o.id === q.correctOptionId),
        at: time + (i + 1) * 1_000,
      })),
    };
  };
  const older = archived(13, bankV13);
  const legacy = archived(14, bankV14);
  const stored = { ...emptyData(), games: [older, legacy] };
  const before = JSON.stringify(stored);
  const beforeStats = stored.games.map(stats);
  const restored = parseData(before);
  assert.equal(JSON.stringify(restored), before);
  const next = complete(
    createSession("mixed", undefined, time + 100_000, {
      learningTopic: "siyer",
      difficulty: "easy",
    }),
  );
  const appended = parseData(JSON.stringify(appendGame(restored, next)));
  assert.deepEqual(appended.games.slice(0, 2), stored.games);
  assert.deepEqual(appended.games.slice(0, 2).map(stats), beforeStats);
  assert.deepEqual(
    progress(appended.games.slice(0, 2)),
    progress(stored.games),
  );
  assert.equal(JSON.stringify(stored), before);
});

test("all 1,500 approved current questions have exactly one playable learning topic", () => {
  assert.equal(bank.length, 1500);
  const covered: string[] = [];
  for (const topic of learningTopicsV1) {
    const assigned = learningTopicPool(bank, topic.id);
    for (const q of assigned) {
      assert.equal(belongsToLearningTopic(q.id, topic.id), true);
      covered.push(q.id);
    }
  }
  assert.equal(
    covered.length,
    1500,
    "Every approved question must appear in a subject card",
  );
  assert.equal(
    new Set(covered).size,
    1500,
    "A question must never appear in two learning topics",
  );
  assert.deepEqual(new Set(covered), new Set(bank.map((q) => q.id)));
  const displayedCounts = learningOptions(bank).map((topic) => topic.count);
  assert.equal(
    displayedCounts.reduce((sum, count) => sum + count, 0),
    1500,
  );
});
