import assert from "node:assert/strict";
import test from "node:test";
import { createHash } from "node:crypto";
import {
  BANK_VERSION,
  questions,
  playableQuestions,
} from "../src/content/questions";
import { questionsV73 } from "../src/content/questions/questions-v73";
import { reviewedTopicByQuestionIdV74 } from "../src/content/questions/learning-topics-v74";
import { candidateTopicByQuestionIdV74 } from "../src/content/questions/learning-topics-v74.candidate";
import {
  assembledQuestionsV74,
  canonicalV74Source,
} from "../scripts/build-bank-v74";
import { readFileSync } from "node:fs";
import { gameQuestion } from "../src/content/questions/registry";
import {
  createSession,
  answerQuestion,
  advanceQuestion,
  finishSession,
  stats,
  type Session,
  type GameRecord,
} from "../src/domain/game/engine";
import { playCategories } from "../src/domain/game/play-categories";
import { gameStages } from "../src/domain/game/stages";
import { emptyData, parseData, validRecord } from "../src/storage/schema";
import { progress } from "../src/domain/scoring/progress";
import baseline from "../docs/content-3000-20261125/progress.json";
import { buildOnlineContentRows } from "../scripts/online-content-export";

function complete(session: Session) {
  let now = session.startedAt;
  for (let i = 0; i < 10; i++) {
    const q = gameQuestion(session, session.questionIds[i]!)!;
    assert.ok(q.source && q.explanation);
    session = answerQuestion(session, q.correct, now + 1000);
    if (i < 9) {
      now += 25000;
      session = advanceQuestion(session, now);
    }
  }
  const record = finishSession(session);
  assert.equal(stats(record).score, 1000);
  assert.ok(validRecord(record));
  assert.deepEqual(
    parseData(JSON.stringify({ ...emptyData(), games: [record] })).games,
    [record],
  );
  return record;
}

test("v74 is the reproducible source-compared 3000-question bank with no fabricated human review", () => {
  assert.equal(BANK_VERSION, 74);
  assert.equal(questions.length, 3000);
  assert.equal(playableQuestions("production").length, 3000);
  assert.deepEqual(questions, assembledQuestionsV74());
  assert.deepEqual(reviewedTopicByQuestionIdV74, candidateTopicByQuestionIdV74);
  assert.equal(
    readFileSync("src/content/questions/questions-v74.ts", "utf8"),
    canonicalV74Source(),
  );
  for (const q of questions.filter((q) => q.id.startsWith("new74-"))) {
    assert.equal(q.reviewedAt, undefined);
    assert.match(
      q.reviewNotes,
      /Bağımsız ilahiyat uzmanı veya insan editör incelemesi iddia edilmez/,
    );
  }
});

test("v74 mixed, daily, focus, 18 difficulty and 30 staged rounds finish with valid source views and preserved scoring", () => {
  const start = 1800000000000;
  complete(createSession("mixed", undefined, start));
  complete(createSession("daily", undefined, start));
  for (const category of ["quran", "prophets", "history", "general"] as const)
    complete(createSession("focus", category, start));
  for (const category of playCategories) {
    for (const difficulty of ["easy", "medium", "hard"] as const) {
      const record = complete(
        createSession("mixed", undefined, start, {
          playCategory: category.id,
          difficulty,
        }),
      );
      assert.equal(record.bankVersion, 74);
      assert.equal(record.playCategoryVersion, 3);
      assert.ok(!validRecord({ ...record, playCategoryVersion: 2 }));
    }
    for (const stage of gameStages)
      complete(
        createSession("mixed", undefined, start, {
          playCategory: category.id,
          stage: stage.id,
        }),
      );
  }
});

test("v73 saved questions, options, score, XP and profile survive v74 without rewriting historical content", () => {
  assert.equal(
    createHash("sha256").update(JSON.stringify(questionsV73)).digest("hex"),
    baseline.bankSha256,
  );
  const old = questionsV73.slice(0, 10),
    start = 1800000000000;
  const record: GameRecord = {
    id: "quiz-preserved-v73-before-v74",
    bankVersion: 73,
    mode: "mixed",
    startedAt: start,
    completedAt: start + 10000,
    questionIds: old.map((q) => q.id),
    optionOrders: Object.fromEntries(
      old.map((q) => [q.id, q.options.map((o) => o.id).reverse()]),
    ),
    answers: old.map((q, i) => ({
      questionId: q.id,
      option: [...q.options]
        .reverse()
        .findIndex((o) => o.id === q.correctOptionId),
      at: start + (i + 1) * 1000,
    })),
  };
  assert.ok(validRecord(record));
  const views = old.map((q) => gameQuestion(record, q.id)),
    rewards = progress([record]);
  const data = {
    ...emptyData(),
    profile: { ...emptyData().profile, name: "Korunan Oyuncu", avatar: 2 },
    games: [record],
  };
  assert.deepEqual(parseData(JSON.stringify(data)), data);
  complete(createSession("mixed", undefined, start + 100000));
  assert.deepEqual(
    old.map((q) => gameQuestion(record, q.id)),
    views,
  );
  assert.deepEqual(progress([record]), rewards);
  assert.equal(stats(record).score, 1000);
});

test("canonical online v74 export has 3000 exact rows while v72 and v73 projections stay immutable", () => {
  assert.equal(buildOnlineContentRows().length, 3000);
  const old = buildOnlineContentRows(questionsV73, 73);
  assert.equal(old.length, 1500);
  assert.ok(old.every((q) => q.contentScope === "bank-v73"));
  assert.deepEqual(
    old.map((q) => q.metadata),
    questionsV73,
  );
});
