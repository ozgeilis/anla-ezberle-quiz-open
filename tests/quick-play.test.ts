import assert from "node:assert/strict";
import test from "node:test";
import {
  questions,
  questionById,
  BANK_VERSION,
} from "../src/content/questions";
import { questionsV73 } from "../src/content/questions/questions-v73";
import { quickPlayCounts } from "../src/domain/game/quick-play";
import { getXpRangeForLevel } from "../src/domain/scoring/levels";
import { rewardSummary } from "../src/domain/scoring/rewards";
import {
  createSession,
  selectQuickPlayQuestions,
  selectionConceptKeys,
  answerQuestion,
  advanceQuestion,
  finishSession,
  type GameRecord,
} from "../src/domain/game/engine";
import { gameQuestion } from "../src/content/questions/registry";
import {
  parseData,
  emptyData,
  validRecord,
  appendGame,
} from "../src/storage/schema";
import { progress } from "../src/domain/scoring/progress";
import review from "../docs/content-3000-20261125/final-quality-quick-play-review.json";

const at = 1800000000000;
function historyWithXp(xp: number): GameRecord[] {
  const history: GameRecord[] = [];
  for (let left = xp, offset = 0; left > 0; offset += 10) {
    const group = questionsV73.slice(offset, offset + 10);
    assert.equal(group.length, 10);
    const correct = Math.min(10, left / 10);
    const record: GameRecord = {
      id: `quiz-quick-history-${offset}`,
      bankVersion: 73,
      mode: "mixed",
      startedAt: at,
      completedAt: at + 1000,
      questionIds: group.map((q) => q.id),
      optionOrders: Object.fromEntries(
        group.map((q) => [q.id, q.options.map((o) => o.id)]),
      ),
      answers: group.map((q, i) => {
        const key = q.options.findIndex((o) => o.id === q.correctOptionId);
        return {
          questionId: q.id,
          option: i < correct ? key : (key + 1) % 4,
          at: at + 1000,
        };
      }),
    };
    assert.ok(validRecord(record));
    history.push(record);
    left -= correct * 10;
  }
  assert.equal(rewardSummary(history), xp);
  return history;
}

const countsOf = (ids: readonly string[]) =>
  Object.fromEntries(
    (["easy", "medium", "hard"] as const).map((d) => [
      d,
      ids.filter((id) => questionById.get(id)!.difficulty === d).length,
    ]),
  );
function assertIndependent(ids: readonly string[]) {
  assert.equal(ids.length, 10);
  assert.equal(new Set(ids).size, 10);
  assert.equal(
    new Set(ids.map((id) => questionById.get(id)!.categoryId)).size,
    4,
  );
  const keys = ids.flatMap((id) => selectionConceptKeys(questionById.get(id)!));
  assert.equal(keys.length, new Set(keys).size);
}

test("quick-play XP policy uses existing level thresholds, starts easy and adds at most one harder slot per level", () => {
  assert.deepEqual(quickPlayCounts(0), { easy: 10, medium: 0, hard: 0 });
  for (const invalid of [-1, NaN, Infinity])
    assert.deepEqual(quickPlayCounts(invalid), quickPlayCounts(0));
  let previous = quickPlayCounts(0);
  for (let level = 1; level <= 100; level++) {
    const counts = quickPlayCounts(getXpRangeForLevel(level).min);
    assert.equal(counts.easy + counts.medium + counts.hard, 10);
    assert.ok(counts.easy >= 1 && counts.hard <= 3);
    assert.ok(
      counts.medium >= previous.medium && counts.medium - previous.medium <= 1,
    );
    assert.ok(counts.hard >= previous.hard && counts.hard - previous.hard <= 1);
    if (level < 10) assert.equal(counts.hard, 0);
    previous = counts;
  }
});

test("one-tap quick play needs no category and mixes four v74 categories with the actual earned-XP quota", () => {
  assert.equal(BANK_VERSION, 74);
  assert.equal(questions.length, 3000);
  for (const level of [1, 2, 5, 10, 15, 20]) {
    const history = historyWithXp(getXpRangeForLevel(level).min);
    const before = JSON.stringify(history),
      rewards = progress(history);
    const session = createSession("mixed", undefined, at + 10000, {
      quickPlay: true,
      timed: true,
      history,
    });
    assert.equal(session.playCategory, undefined);
    assert.equal(session.learningTopic, undefined);
    assert.equal(session.quickPlay, true);
    assertIndependent(session.questionIds);
    assert.deepEqual(
      countsOf(session.questionIds),
      quickPlayCounts(rewards.xp),
    );
    const seen = new Set(history.flatMap((g) => g.questionIds));
    assert.ok(session.questionIds.every((id) => !seen.has(id)));
    const rank = { easy: 0, medium: 1, hard: 2 };
    const sequence = session.questionIds.map(
      (id) => rank[questionById.get(id)!.difficulty],
    );
    assert.deepEqual(sequence, [...sequence].sort());
    assert.equal(JSON.stringify(history), before);
    assert.deepEqual(progress(history), rewards);
  }
});

test("six quick rounds preserve unseen facts, the 20-second clock, saved profile and normal XP awards", () => {
  let data = emptyData();
  data.profile.name = "Korunan Oyuncu";
  const seen = new Set<string>();
  for (let round = 0; round < 6; round++) {
    const before = rewardSummary(data.games);
    let now = at + round * 1000000;
    let s = createSession("mixed", undefined, now, {
      quickPlay: true,
      timed: true,
      history: data.games,
    });
    assertIndependent(s.questionIds);
    assert.deepEqual(countsOf(s.questionIds), quickPlayCounts(before));
    assert.equal(s.timingVersion, 2);
    for (const id of s.questionIds) {
      assert.ok(!seen.has(id));
      seen.add(id);
    }
    for (let i = 0; i < 10; i++) {
      const q = gameQuestion(s, s.questionIds[i]!)!;
      s = answerQuestion(s, q.correct, now + 1000);
      if (i < 9) {
        now += 25000;
        s = advanceQuestion(s, now);
      }
    }
    const record = finishSession(s);
    assert.ok(validRecord(record));
    assert.equal(record.quickPlay, true);
    assert.ok(!validRecord({ ...record, quickPlay: false }));
    assert.ok(!validRecord({ ...record, bankVersion: 73 }));
    const saved = appendGame(data, record);
    data = parseData(JSON.stringify(saved));
    assert.deepEqual(data, saved);
    assert.equal(rewardSummary(data.games), before + 100);
  }
  assert.equal(seen.size, 60);
  assert.equal(data.profile.name, "Korunan Oyuncu");
});

test("quick selector fails closed on a missing category, duplicates or exhaustion without borrowing harder/replayed facts", () => {
  const easy = quickPlayCounts(0);
  assert.throws(
    () =>
      selectQuickPlayQuestions(
        questions.filter((q) => q.categoryId !== "quran"),
        easy,
      ),
    /dört kategoriden/,
  );
  assert.throws(
    () => selectQuickPlayQuestions(Array(10).fill(questions[0]!), easy),
    /dört kategoriden/,
  );
  assert.throws(
    () => selectQuickPlayQuestions(questions, { easy: 9, medium: 0, hard: 0 }),
    /10 soruluk/,
  );
  assert.throws(
    () => createSession("daily", undefined, at, { quickPlay: true }),
    /karma/,
  );
  assert.throws(
    () =>
      createSession("mixed", undefined, at, {
        quickPlay: true,
        difficulty: "easy",
      }),
    /karma/,
  );
  const history = historyWithXp(1000);
  const exhausted = [
    { ...history[0]!, questionIds: questions.map((q) => q.id) },
  ];
  assert.throws(
    () =>
      createSession("mixed", undefined, at, {
        quickPlay: true,
        history: exhausted,
      }),
    /yeni soru kalmadı/,
  );
});

test("final targeted review retains 3000 IDs and all reviewed keys; only evidence-backed options and difficulty are refined", () => {
  assert.equal(review.sampleSize, 56);
  assert.equal(new Set(review.sampleIds).size, 56);
  assert.equal(review.targetedChanges.length, 8);
  for (const item of review.targetedChanges) {
    const q = questionById.get(item.id)!;
    assert.equal(q.categoryId, item.before.categoryId);
    assert.equal(q.correctOptionId, item.before.correctOptionId);
    assert.deepEqual(
      q.options.map((o) => o.id),
      item.before.options.map((o) => o.id),
    );
    assert.equal(item.sourceRechecked, true);
    assert.equal(new Set(q.options.map((o) => o.text)).size, 4);
  }
});
