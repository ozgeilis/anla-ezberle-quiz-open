import { questions1500 as questions } from "../src/content/questions/questions-1500";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  BANK_VERSION,
  playableQuestions,
} from "../src/content/questions";
import {
  learningTopicsV1,
  type LearningTopicId,
} from "../src/content/questions/learning-topics-v1";
import {
  reviewedTopicQuestionIdsV71,
  reviewedTopicByQuestionIdV71,
} from "../src/content/questions/learning-topics-v71-reviewed";
import {
  assignedLearningTopic,
  belongsToLearningTopic,
  learningTopicPool,
  LEARNING_TOPIC_VERSION,
} from "../src/domain/game/learning";
import { learningOptions } from "../src/features/categories/learning-options";
import {
  preparationFromParams,
  preparationStatus,
} from "../src/features/categories/preparation";
import {
  createSession,
  answerQuestion,
  advanceQuestion,
  finishSession,
  stats,
  selectionConceptKeys,
} from "../src/domain/game/engine";
import { gameQuestion } from "../src/content/questions/registry";
import { parseData, emptyData } from "../src/storage/schema";
import { progress } from "../src/domain/scoring/progress";
import oldFixture from "./fixtures/content/topic-v1-pre-review.json";
const bank = questions;
const expected = {
  quran: 156,
  siyer: 152,
  peygamberler: 271,
  fikih: 161,
  akaid: 151,
  ahlak: 109,
  islam_tarihi: 29,
  sahabe: 161,
  dualar: 57,
  medeniyet: 253,
};

test("reviewed v2 assigns all 1500 unchanged v71 questions exactly once; ten card counts sum to 1500", () => {
  assert.equal(BANK_VERSION, 73);
  assert.equal(LEARNING_TOPIC_VERSION, 3);
  assert.equal(questions.length, 1500);
  assert.equal(bank.length, 1500);
  const ids = Object.values(reviewedTopicQuestionIdsV71).flat();
  assert.equal(ids.length, 1500);
  assert.equal(new Set(ids).size, 1500);
  assert.deepEqual(new Set(ids), new Set(questions.map((q) => q.id)));
  assert.equal(Object.keys(reviewedTopicByQuestionIdV71).length, 1500);
  const cards = learningOptions(bank, undefined, undefined, 2);
  assert.equal(cards.length, 10);
  assert.equal(
    cards.reduce((n, c) => n + c.count, 0),
    1500,
  );
  assert.deepEqual(
    Object.fromEntries(cards.map((c) => [c.id, c.count])),
    expected,
  );
  for (const q of questions) {
    const memberships = learningTopicsV1.filter((t) =>
      belongsToLearningTopic(q.id, t.id, 2),
    );
    assert.equal(memberships.length, 1, q.id);
    assert.equal(assignedLearningTopic(q.id, 2), memberships[0]!.id);
  }
});

test("semantic anchors distinguish Quran studies, prophetic stories, creed, manners, prayer, law and history", () => {
  const anchors: Partial<Record<LearningTopicId, string[]>> = {
    quran: [
      "q58-tefsir-tanim",
      "q58-tecvid-mahrec",
      "v11-general-002",
      "v11-general-009",
      "q71-sure-114",
      "q66-neml-name",
    ],
    peygamberler: [
      "q66-kehf-82",
      "q66-neml-39",
      "q67-kasas-27",
      "q66-meryem-7",
      "q47-nuh-019",
    ],
    akaid: [
      "q55-kiyamet-030",
      "q65-hadid-3",
      "q67-rum-30",
      "q66-kehf-50",
      "pilot-prophets-003",
      "q61-isa-incil",
    ],
    ahlak: [
      "q65-isra-23",
      "q65-isra-35",
      "q65-furkan-63",
      "q62-sadaka-genis",
      "q64-veda-hak",
    ],
    dualar: [
      "q65-furkan-74",
      "q66-kehf-10",
      "q66-meryem-3",
      "q50-zekeriyya-020",
      "v8-general-004",
    ],
    fikih: [
      "q70-safii-risale",
      "q70-ebu-hanife-mezhep",
      "q70-malik-b-enes-amel",
      "q71-kurban-niyet",
      "v12-general-008",
    ],
    islam_tarihi: [
      "v10-history-011",
      "v10-history-012",
      "v13-history-006",
      "q67-rum-2",
    ],
    medeniyet: [
      "q68-hadis-tanim",
      "q63-selimiye-bani",
      "q70-gazzali-ihya",
      "v13-history-009",
      "learn-history-005",
    ],
    siyer: ["q64-bedir-sefer", "q57-gazvetanim", "q44-duha-6"],
    sahabe: ["q69-bilalihabesi-anne", "q48-esma-003", "q71-hatice-anne"],
  };
  for (const [topic, ids] of Object.entries(anchors))
    for (const id of ids) assert.equal(assignedLearningTopic(id, 2), topic, id);
});

test("the row-by-row subject review covers 600 legacy and all 900 PR77 additions, without certifying facts", () => {
  const lines = readFileSync(
    "docs/audits/TOPIC-REVIEW-V71-20261022.tsv",
    "utf8",
  )
    .trimEnd()
    .split("\n");
  assert.equal(
    lines.shift(),
    "question_id\tprevious_topic\treviewed_topic\tdecision\tbasis",
  );
  assert.equal(lines.length, 1500);
  const seen = new Set<string>();
  let changed = 0,
    oldChanged = 0;
  for (const [i, line] of lines.entries()) {
    const [id, previous, reviewed, decision, basis] = line.split("\t");
    assert(!seen.has(id!));
    seen.add(id!);
    assert.equal(id, questions[i]!.id);
    assert.equal(reviewed, assignedLearningTopic(id!, 2));
    assert.equal(previous, assignedLearningTopic(id!, 1));
    assert.equal(decision, previous === reviewed ? "retained" : "changed");
    assert(basis && basis.length > 15);
    if (previous !== reviewed) {
      changed++;
      if (i < 600) oldChanged++;
    }
  }
  assert.equal(changed, 350);
  assert.equal(oldChanged, 51);
  assert.equal(changed - oldChanged, 299);
});

test("all 30 difficulty cards show only exact eligible topic counts, with unchanged global difficulty totals", () => {
  for (const difficulty of ["easy", "medium", "hard"] as const) {
    const cards = learningOptions(bank, difficulty, undefined, 2);
    assert.equal(
      cards.reduce((n, c) => n + c.count, 0),
      { easy: 464, medium: 775, hard: 261 }[difficulty],
    );
    for (const card of cards) {
      assert.equal(
        card.count,
        bank.filter(
          (q) =>
            q.difficulty === difficulty &&
            reviewedTopicByQuestionIdV71[q.id] === card.id,
        ).length,
      );
      assert.equal(
        card.available,
        preparationStatus(bank, { topic: card.id, difficulty }).canStart,
      );
    }
  }
});

test("each of the ten topics starts and completes a genuine independent ten-question round from both entry orders", () => {
  const time = 1800000000000;
  for (const topic of learningTopicsV1) {
    const difficulty = (["easy", "medium", "hard"] as const).find(
      (level) =>
        preparationStatus(bank, { topic: topic.id, difficulty: level })
          .canStart,
    );
    assert(difficulty, topic.id + " must be playable");
    const a = { ...preparationFromParams({ topic: topic.id }), difficulty },
      b = { ...preparationFromParams({ difficulty }), topic: topic.id };
    assert.deepEqual(preparationStatus(bank, a), preparationStatus(bank, b));
    let s = createSession("mixed", undefined, time, {
      learningTopic: topic.id,
      difficulty,
      channel: "production",
    });
    assert.equal(s.learningTopicVersion, LEARNING_TOPIC_VERSION);
    const keys: string[] = [];
    for (let i = 0; i < 10; i++) {
      const id = s.questionIds[i]!,
        q = playableQuestions().find((q) => q.id === id)!;
      assert.equal(assignedLearningTopic(id), topic.id);
      assert.equal(q.difficulty, difficulty);
      keys.push(...selectionConceptKeys(q));
      const answer = gameQuestion(s, id)!;
      s = answerQuestion(
        s,
        i < 6 ? answer.correct : (answer.correct + 1) % 4,
        time + (i + 1) * 1000,
      );
      if (i < 9) s = advanceQuestion(s);
    }
    assert.equal(new Set(keys).size, keys.length);
    const game = finishSession(s);
    assert.equal(stats(game).score, 600);
    assert.equal(progress([game]).xp, 60);
    assert.deepEqual(
      parseData(JSON.stringify({ ...emptyData(), games: [game] })).games[0],
      game,
    );
  }
});

test("a real pre-review v1 topic save survives reassignment with identical scores, XP, profile and bytes", () => {
  assert.equal(assignedLearningTopic("v11-general-002", 1), "fikih");
  assert.equal(assignedLearningTopic("v11-general-002", 2), "quran");
  const restored = parseData(JSON.stringify(oldFixture.stored));
  assert.deepEqual(restored, oldFixture.stored);
  assert.deepEqual(stats(restored.games[0]!), oldFixture.stats);
  assert.deepEqual(progress(restored.games), oldFixture.progress);
  assert.throws(
    () =>
      parseData(
        JSON.stringify({
          ...restored,
          games: [{ ...restored.games[0], learningTopicVersion: 2 }],
        }),
      ),
    /doğrulanamadı/,
  );
  assert.equal(learningTopicPool(bank, "fikih", 1).length, 163);
  assert.equal(learningTopicPool(bank, "fikih", 2).length, 161);
});
