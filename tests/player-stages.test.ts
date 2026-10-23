import assert from "node:assert/strict";
import { test } from "node:test";
import { availableQuestions, Question } from "../src/content/questions";
import {
  assessStageRound,
  createSession,
  selectStageQuestions,
  selectionConceptKeys,
  answerQuestion,
  advanceQuestion,
  finishSession,
} from "../src/domain/game/engine";
import { gameStages } from "../src/domain/game/stages";
import { learningTopicPool } from "../src/domain/game/learning";
import { learningTopicsV1 } from "../src/content/questions/learning-topics-v1";
import {
  preparationStatus,
  preparationFromParams,
} from "../src/features/categories/preparation";
import {
  validRecord,
  parseData,
  emptyData,
  appendGame,
} from "../src/storage/schema";
import { progress, playerTitle } from "../src/domain/scoring/progress";
import {
  searchUsername,
  usernameError,
} from "../src/features/online/usernames";

test("username validation rejects malformed, reserved and inappropriate names", () => {
  for (const value of [
    "",
    "ab",
    "Aaa",
    "a b",
    "çığ",
    "x".repeat(21),
    "@player",
    "admin",
    "diyanet",
    "siktir123",
    "nazi_12",
  ])
    assert.ok(usernameError(value), value);
  for (const value of ["ozge_123", "abc", "0_1", "a".repeat(20)])
    assert.equal(usernameError(value), null, value);
  assert.equal(searchUsername("@Ozge_123"), "ozge_123");
});
function complete(stage: (typeof gameStages)[number]["id"]) {
  let session = createSession("mixed", undefined, 1792500000000, { stage });
  for (let i = 0; i < 10; i++) {
    session = answerQuestion(session, 0, session.startedAt + i + 1);
    if (i < 9) session = advanceQuestion(session);
  }
  return finishSession(session);
}
test("all five stages select exact quotas and independent concepts over repeated rounds", () => {
  for (const stage of gameStages) {
    assert.ok(assessStageRound(availableQuestions, stage.id).canStart);
    let recent: string[] = [];
    for (let i = 0; i < 30; i++) {
      const questions = selectStageQuestions(
        availableQuestions,
        stage.id,
        recent,
      );
      assert.equal(questions.length, 10);
      const seen = new Set<string>();
      for (const q of questions)
        for (const key of selectionConceptKeys(q)) {
          assert.ok(!seen.has(key), key);
          seen.add(key);
        }
      for (const d of ["easy", "medium", "hard"] as const)
        assert.equal(
          questions.filter((q) => q.difficulty === d).length,
          stage.counts[d],
        );
      recent = questions.map((q) => q.id);
    }
  }
});
test("topic readiness agrees with actual stage selector, unsupported choices stay closed", () => {
  for (const topic of learningTopicsV1)
    for (const stage of gameStages) {
      const pool = learningTopicPool(availableQuestions, topic.id);
      const ready = assessStageRound(pool, stage.id).canStart;
      assert.equal(
        preparationStatus(availableQuestions, {
          topic: topic.id,
          stage: stage.id,
        }).canStart,
        ready,
      );
      if (ready)
        assert.equal(
          createSession("mixed", undefined, Date.now(), {
            learningTopic: topic.id,
            stage: stage.id,
          }).questionIds.length,
          10,
        );
      else
        assert.throws(() =>
          createSession("mixed", undefined, Date.now(), {
            learningTopic: topic.id,
            stage: stage.id,
          }),
        );
    }
  assert.equal(assessStageRound([], "growing").canStart, false);
  assert.throws(() =>
    selectStageQuestions(
      availableQuestions.filter((q) => q.difficulty === "easy"),
      "growing",
    ),
  );
});
test("mixed stage solver backtracks across difficulty conflicts instead of independently concatenating pools", () => {
  const original = availableQuestions[0]!;
  const q = (
    id: string,
    difficulty: "easy" | "medium",
    concept: string,
  ): Question => ({
    ...original,
    id,
    question: id,
    conceptGroup: concept,
    difficulty,
  });
  const pool = [
    q("e0", "easy", "collision"),
    ...Array.from({ length: 7 }, (_, i) => q(`e${i + 1}`, "easy", `e${i + 1}`)),
    q("m0", "medium", "collision"),
    q("m1", "medium", "m1"),
    q("m2", "medium", "m2"),
  ];
  const picked = selectStageQuestions(pool, "growing", [], () => 0.99);
  assert.equal(picked.length, 10);
  assert.ok(!picked.some((q) => q.id === "e0"));
  const impossible = pool
    .filter((q) => q.difficulty === "easy")
    .map((q) => ({ ...q, conceptGroup: "same" }));
  assert.equal(
    assessStageRound(
      [...impossible, ...pool.filter((q) => q.difficulty === "medium")],
      "growing",
    ).canStart,
    false,
  );
});
test("stage records persist without changing existing profile, XP math or historical records", () => {
  const old = emptyData();
  for (const stage of gameStages) {
    const record = complete(stage.id);
    assert.ok(validRecord(record));
    const stored = appendGame(old, record);
    assert.deepEqual(parseData(JSON.stringify(stored)), stored);
    assert.equal(
      progress(stored.games).xp,
      progress(stored.games).correct * 10,
    );
    assert.deepEqual(stored.profile, old.profile);
    assert.equal(validRecord({ ...record, difficulty: "easy" }), false);
    assert.equal(validRecord({ ...record, stage: "invalid" }), false);
    assert.equal(validRecord({ ...record, mode: "daily" }), false);
  }
  assert.equal(progress([]).nextLevelXp, 250);
  assert.equal(progress([]).title, "Yeni yolcu");
  assert.equal(playerTitle(20), "Bilgi ustası");
  assert.equal(
    preparationFromParams({
      category: "mixed",
      stage: "growing",
      difficulty: "easy",
    }).difficulty,
    undefined,
  );
  assert.throws(() =>
    createSession("daily", undefined, Date.now(), { stage: "growing" }),
  );
  assert.throws(() =>
    createSession("mixed", undefined, Date.now(), {
      stage: "growing",
      difficulty: "easy",
    }),
  );
});
