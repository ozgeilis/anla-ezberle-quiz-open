import assert from "node:assert/strict";
import test from "node:test";
import {
  BANK_VERSION,
  questions,
  questionById,
} from "../src/content/questions";
import { questions1500 } from "../src/content/questions/questions-1500";
import {
  retiredQuestionIdsV72,
  approvedNewQuestionsV72,
} from "../src/content/questions/release-v72-meaning";
import { reviewedTopicByQuestionIdV72 } from "../src/content/questions/learning-topics-v72";
import { reviewedTopicByQuestionIdV71 } from "../src/content/questions/learning-topics-v71-reviewed";
import { assignedLearningTopic } from "../src/domain/game/learning";
import { categoryOptions } from "../src/features/categories/learning-options";
import { belongsToPlayCategory } from "../src/domain/game/play-categories";
import {
  advanceQuestion,
  answerQuestion,
  createSession,
  finishSession,
  stats,
  selectionConceptKeys,
  type Session,
  type GameRecord,
} from "../src/domain/game/engine";
import { gameQuestion } from "../src/content/questions/registry";
import { questionsV72 } from "../src/content/questions/questions-v72";
import { unseenQuestionPool } from "../src/domain/game/history";
import { meaningFactAliasesV72 } from "../src/domain/game/meaning-facts-v72";
import { emptyData, parseData, validRecord } from "../src/storage/schema";
import { progress } from "../src/domain/scoring/progress";
import draft from "../docs/content-editorial/quran-anlam-odakli-38-taslak.json";
import evidence from "../docs/content-editorial/quran-v72-browser-source-check-2026-10-22.json";
const time = 1800000000000;
const complete = (initial: Session, correct = 7) => {
  let s = initial;
  for (let i = 0; i < 10; i++) {
    const q = gameQuestion(s, s.questionIds[i]!)!;
    assert(q.explanation && q.source);
    s = answerQuestion(
      s,
      i < correct ? q.correct : (q.correct + 1) % 4,
      time + (i + 1) * 1000,
    );
    if (i < 9) s = advanceQuestion(s);
  }
  return finishSession(s);
};
test("v72: all 38 candidate citations match rendered Diyanet source evidence; only 30 are published", () => {
  assert.equal(draft.questions.length, 38);
  assert.equal(evidence.entries.length, 38);
  const active = new Set(approvedNewQuestionsV72.map((q) => q.id));
  for (const q of draft.questions) {
    const proof = evidence.entries.find((e) => e.id === q.id)!;
    assert(proof);
    assert.equal(q.reviewStatus, "draft");
    assert.equal(proof.status, "supported");
    assert.equal(proof.independentExpertApproval, false);
    assert.match(proof.renderedMealSha256, /^[a-f0-9]{64}$/);
    assert.equal(q.sources[0]!.url, proof.verifiedUrl);
    assert.equal(proof.finalObservedTarget, proof.verifiedUrl);
    const [surah, verse] = proof.reference.split("/");
    assert.equal(
      new URL(proof.verifiedUrl).pathname,
      `/tefsir/sure/${surah}/ayet/${verse!.split("-")[0]}`,
    );
    assert(proof.observedVerseNumbers.includes(Number(verse!.split("-")[0])));
    const published = questionsV72.find((old) => old.id === q.id);
    if (active.has(q.id)) {
      assert(published);
      assert.deepEqual(published.options, q.options);
      assert.deepEqual(published.sources, q.sources);
      assert.equal(published.correctOptionId, q.correctOptionId);
      assert.equal(published.explanation, q.explanation);
    } else
      assert.equal(
        published,
        undefined,
        "Eight reserves must remain unpublished",
      );
  }
});
test("v72: exact versioned topic partitions, six counts and difficulty filters retain frozen v71 membership", () => {
  assert.equal(BANK_VERSION, 73);
  assert.equal(Object.keys(reviewedTopicByQuestionIdV72).length, 1500);
  assert.equal(Object.keys(reviewedTopicByQuestionIdV71).length, 1500);
  for (const old of questions1500)
    assert.equal(
      assignedLearningTopic(old.id, 2),
      reviewedTopicByQuestionIdV71[old.id],
    );
  for (const id of retiredQuestionIdsV72) {
    assert.equal(assignedLearningTopic(id, 3), undefined);
    assert(belongsToPlayCategory(id, "quran_dualar", 1));
    assert(!belongsToPlayCategory(id, "quran_dualar", 2));
  }
  for (const q of approvedNewQuestionsV72) {
    assert.equal(assignedLearningTopic(q.id, 3), "quran");
    assert.equal(assignedLearningTopic(q.id, 2), undefined);
    assert(belongsToPlayCategory(q.id, "quran_dualar", 2));
    assert(!belongsToPlayCategory(q.id, "quran_dualar", 1));
  }
  assert.deepEqual(
    categoryOptions(questions).map((c) => c.count),
    [213, 313, 271, 161, 260, 282],
  );
  for (const difficulty of ["easy", "medium", "hard"] as const) {
    const counts = categoryOptions(questions, difficulty);
    assert.equal(
      counts.reduce((n, c) => n + c.count, 0),
      { easy: 475, medium: 789, hard: 236 }[difficulty],
    );
    for (const card of counts)
      assert.equal(
        card.count,
        questions.filter(
          (q) =>
            q.difficulty === difficulty && belongsToPlayCategory(q.id, card.id),
        ).length,
      );
  }
});
test("v72: all 30 additions are reachable through real filtered games, completed and restored with explanations and exact score", () => {
  let seed = 72;
  const random = () =>
    (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296;
  const remaining = new Set(approvedNewQuestionsV72.map((q) => q.id));
  for (let round = 0; round < 450 && remaining.size; round++) {
    const difficulty = (["easy", "medium", "hard"] as const)[round % 3]!;
    const s = createSession("mixed", undefined, time, {
      playCategory: "quran_dualar",
      difficulty,
      random,
      channel: "production",
    });
    assert.equal(s.bankVersion, 73);
    assert.equal(s.playCategoryVersion, 2);
    for (const id of s.questionIds) {
      assert(belongsToPlayCategory(id, "quran_dualar"));
      assert.equal(questionById.get(id)!.difficulty, difficulty);
      remaining.delete(id);
    }
    const keys = s.questionIds.flatMap((id) =>
      selectionConceptKeys(questionById.get(id)!),
    );
    assert.equal(new Set(keys).size, keys.length);
    const g = complete(s);
    assert.equal(stats(g).score, 700);
    assert(validRecord(g));
    const stored = { ...emptyData(), games: [g] };
    assert.deepEqual(parseData(JSON.stringify(stored)), stored);
  }
  assert.deepEqual(
    [...remaining],
    [],
    "Every new question must be actually selectable",
  );
});
test("v72: shared facts are excluded across IDs and stored bank versions, while distinct facts on one passage remain fresh", () => {
  for (const ids of meaningFactAliasesV72) {
    const newId = ids.find((id) => id.startsWith("quran-meaning-v72-"))!;
    if (!questionById.has(newId)) continue;
    for (const oldId of ids.filter(
      (id) => !id.startsWith("quran-meaning-v72-"),
    )) {
      const history = [
        { bankVersion: 71, questionIds: [oldId] },
      ] as GameRecord[];
      assert.equal(
        unseenQuestionPool([questionById.get(newId)!], history).length,
        0,
        `${oldId} -> ${newId}`,
      );
    }
  }
  const rights = questionById.get("quran-meaning-v72-021")!;
  const waste = questionById.get("quran-meaning-v72-022")!;
  assert(
    selectionConceptKeys(rights).some(
      (k) =>
        k.startsWith("template:") && selectionConceptKeys(waste).includes(k),
    ),
  );
  assert.deepEqual(
    unseenQuestionPool([rights, waste], [
      { bankVersion: 71, questionIds: ["v12-general-003"] },
    ] as GameRecord[]),
    [rights],
  );
});
test("v72: old broad and topic games, pre-fix PR82 previews, answer orders, scores and XP round-trip without rewriting", () => {
  const oldIds = questions1500
    .filter(
      (q) =>
        q.difficulty === "easy" &&
        belongsToPlayCategory(q.id, "quran_dualar", 1),
    )
    .slice(0, 10)
    .map((q) => q.id);
  const historical: GameRecord = {
    id: "quiz-v72-old-v71-record",
    bankVersion: 71,
    mode: "mixed",
    playCategory: "quran_dualar",
    playCategoryVersion: 1,
    difficulty: "easy",
    startedAt: time,
    completedAt: time + 1000,
    questionIds: oldIds,
    optionOrders: Object.fromEntries(
      oldIds.map((id) => [
        id,
        [...questions1500.find((q) => q.id === id)!.options]
          .reverse()
          .map((o) => o.id),
      ]),
    ),
    answers: oldIds.map((id) => ({
      questionId: id,
      option: 0,
      at: time + 1000,
    })),
  };
  assert(validRecord(historical));
  const oldStats = stats(historical),
    oldProgress = progress([historical]);
  const current = complete(
    createSession("mixed", undefined, time, {
      playCategory: "quran_dualar",
      difficulty: "easy",
    }),
  );
  const topic = complete(
    createSession("mixed", undefined, time, {
      learningTopic: "quran",
      difficulty: "easy",
    }),
  );
  const previews = [
    {
      ...current,
      id: "quiz-preview-broad-v72",
      bankVersion: 72,
      playCategoryVersion: 1 as const,
    },
    {
      ...topic,
      id: "quiz-preview-topic-v72",
      bankVersion: 72,
      learningTopicVersion: 2 as const,
    },
  ];
  const stored = { ...emptyData(), games: [historical, current, ...previews] };
  assert.deepEqual(parseData(JSON.stringify(stored)), stored);
  assert.deepEqual(stats(stored.games[0]!), oldStats);
  assert.deepEqual(progress([stored.games[0]!]), oldProgress);
  assert(!validRecord({ ...historical, playCategoryVersion: 2 }));
  assert(!validRecord({ ...topic, bankVersion: 71 }));
});
