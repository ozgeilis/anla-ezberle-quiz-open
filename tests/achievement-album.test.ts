import assert from "node:assert/strict";
import { test } from "node:test";
import { badgeCatalog } from "../src/domain/achievements/catalog";
import {
  achievements,
  nextAchievement,
} from "../src/domain/achievements/evaluate";
import { progress } from "../src/domain/scoring/progress";
import { uniqueRounds } from "../src/domain/scoring/rewards";
import {
  answerQuestion,
  advanceQuestion,
  createSession,
  finishSession,
  GameRecord,
  Session,
} from "../src/domain/game/engine";
import { gameQuestion } from "../src/content/questions/registry";
import {
  appendGame,
  emptyData,
  parseData,
  validRecord,
} from "../src/storage/schema";
function complete(s: Session, correct = 10): GameRecord {
  for (let i = 0; i < 10; i++) {
    const answer = gameQuestion(s, s.questionIds[i]!)!.correct;
    s = answerQuestion(
      s,
      i < correct ? answer : (answer + 1) % 4,
      s.startedAt + i + 1,
    );
    if (i < 9) s = advanceQuestion(s);
  }
  return finishSession(s);
}
const round = (n: number) =>
  complete(
    createSession("mixed", undefined, 1800000000000 + n, {
      channel: "prototype",
      learningTopic: "quran",
      stage: "beginner",
    }),
  );
test("catalog has exactly 82 unique non-authority achievements with preserved legacy IDs", () => {
  assert.equal(badgeCatalog.length, 82);
  assert.equal(new Set(badgeCatalog.map((b) => b.id)).size, 82);
  assert.equal(new Set(badgeCatalog.map((b) => b.title)).size, 82);
  for (const [group, count] of [
    ["category", 40],
    ["seasonal", 18],
    ["general", 12],
    ["social", 12],
  ] as const)
    assert.equal(badgeCatalog.filter((b) => b.group === group).length, count);
  assert.deepEqual(
    badgeCatalog
      .filter((b) => ["first", "five", "perfect", "explorer"].includes(b.id))
      .map((b) => b.id),
    ["first", "five", "perfect", "explorer"],
  );
  for (const b of badgeCatalog) {
    assert(b.requirements.length);
    assert(!/dindar|takva|fetva|din âlimi/i.test(b.title));
  }
});
test("all one hundred levels keep 250 XP spacing, old XP and clamp without truncating XP", () => {
  const g = round(1);
  const old = { ...g, rewardVersion: undefined };
  for (let level = 1; level <= 100; level++) {
    // Valid historical records with one correct response, 10 XP each.
    const sample = complete(
      {
        ...createSession("mixed", undefined, 1800000000000, {
          channel: "prototype",
        }),
        rewardVersion: undefined,
      },
      1,
    );
    const games = Array.from({ length: (level - 1) * 25 }, (_, i) => ({
      ...sample,
      id: `quiz-level-${i}`,
    }));
    const p = progress(games);
    assert.equal(p.xp, (level - 1) * 250);
    assert.equal(p.level, level);
    assert.equal(p.nextLevelXp, level === 100 ? 0 : 250);
  }
  const past = Array.from({ length: 260 }, (_, i) => ({
    ...old,
    id: `quiz-cap-${i}`,
  }));
  assert.equal(progress(past).xp, 26000);
  assert.equal(progress(past).level, 100);
  assert.equal(progress(past).levelXp, 250);
});
test("new identical manifests cannot earn repeated XP, even reordered or relabeled", () => {
  const g = round(2),
    replay = {
      ...g,
      id: "quiz-replay-1",
      completedAt: g.completedAt + 100,
      questionIds: [...g.questionIds].reverse(),
    };
  assert.equal(progress([g, replay]).xp, 100);
  assert.equal(uniqueRounds([g, replay]).length, 1);
  const historical = { ...g, rewardVersion: undefined };
  assert.equal(
    progress([historical, { ...historical, id: "quiz-old-second" }]).xp,
    200,
  );
  assert.equal(progress([historical, replay]).xp, 100);
  assert.equal(
    progress([
      historical,
      { ...replay, completedAt: historical.completedAt - 1 },
    ]).xp,
    100,
  );
  assert.equal(progress([g, g]).xp, 100);
});
test("mastery requires scoped, distinct completed topic rounds; generic question presence does not infer mastery", () => {
  const g = round(3);
  assert(validRecord(g));
  const first = achievements([g]).find((b) => b.id === "topic_quran_bronze")!;
  assert(first.earned);
  const generic = {
    ...g,
    learningTopic: undefined,
    learningTopicVersion: undefined,
  };
  assert(validRecord(generic));
  assert(
    !achievements([generic]).find((b) => b.id === "topic_quran_bronze")!.earned,
  );
  const duplicates = Array.from({ length: 30 }, (_, i) => ({
    ...g,
    id: `quiz-dupe-${i}`,
  }));
  assert(
    !achievements(duplicates).find((b) => b.id === "topic_quran_silver")!
      .earned,
  );
  const unique: GameRecord[] = [];
  const keys = new Set<string>();
  for (let n = 0; unique.length < 20 && n < 100; n++) {
    const r = round(100 + n),
      key = [...r.questionIds].sort().join();
    if (!keys.has(key)) {
      keys.add(key);
      unique.push(r);
    }
  }
  assert.equal(unique.length, 20);
  assert(
    achievements(unique).find((b) => b.id === "topic_quran_diamond")!.earned,
  );
  assert(
    !achievements(unique.slice(0, 19)).find(
      (b) => b.id === "topic_quran_diamond",
    )!.earned,
  );
});
test("seasonal previews and unverified online counters can never fabricate awards", () => {
  const games = Array.from({ length: 30 }, (_, i) => round(500 + i));
  const social = {
    earned: [],
    metrics: { friends: 500, opponents: 500, wins: 500, perfect: 500 },
    shared: false,
    showcase: [],
  };
  const list = achievements(games, social);
  assert(
    list
      .filter((b) => b.group === "seasonal")
      .every((b) => !b.earned && !b.available && b.fraction === 0),
  );
  assert(list.filter((b) => b.group === "social").every((b) => !b.earned));
  assert(!nextAchievement(achievements([]))?.id.startsWith("season_"));
  assert(!nextAchievement(achievements([]))?.id.startsWith("duel_"));
});
test("stored legacy records and optional showcases survive without migration or cached award trust", () => {
  const old = { ...round(4), rewardVersion: undefined };
  const data = appendGame(emptyData(), old),
    raw = JSON.stringify(data);
  assert.equal(JSON.stringify(parseData(raw)), raw);
  const updated = { ...data, showcase: ["first", "five", "perfect"] };
  assert.deepEqual(
    parseData(JSON.stringify(updated)),
    JSON.parse(JSON.stringify(updated)),
  );
  assert.throws(() =>
    parseData(JSON.stringify({ ...data, showcase: ["first", "first"] })),
  );
  assert.throws(() =>
    parseData(
      JSON.stringify({
        ...data,
        showcase: ["first", "five", "perfect", "explorer"],
      }),
    ),
  );
  assert(!validRecord({ ...old, rewardVersion: 2 }));
  const p = progress(data.games);
  assert.equal(p.xp, 100);
  assert(p.badges.find((b) => b.id === "perfect")!.earned);
});
test("perfect progress is answer count out of ten and cannot claim completion after one answer", () => {
  const g = complete(
    createSession("mixed", undefined, 1800000000000, { channel: "prototype" }),
    1,
  );
  const b = achievements([g]).find((b) => b.id === "perfect")!;
  assert.equal(b.earned, false);
  assert.equal(b.goals[0]!.target, 10);
  assert.equal(b.goals[0]!.value, 1);
  assert.equal(b.fraction, 0.1);
});

test("the legacy explorer also remains attainable through four current learning topics", () => {
  const topics = ["quran", "siyer", "fikih", "akaid"] as const;
  const games = topics.map((topic, i) =>
    complete(
      createSession("mixed", undefined, 1800000000000 + i, {
        channel: "prototype",
        stage: "beginner",
        learningTopic: topic,
      }),
    ),
  );
  assert(progress(games).badges.find((b) => b.id === "explorer")!.earned);
  assert(achievements(games).find((b) => b.id === "explorer")!.earned);
});

test("diamond requires all three independent goals, not merely twenty completed rounds", () => {
  const games: GameRecord[] = [];
  const seen = new Set<string>();
  for (let n = 0; games.length < 20 && n < 100; n++) {
    const g = round(1000 + n),
      key = [...g.questionIds].sort().join();
    if (!seen.has(key)) {
      seen.add(key);
      games.push(g);
    }
  }
  const withCorrect = (g: GameRecord, n: number): GameRecord => ({
    ...g,
    answers: g.answers.map((a, i) => ({
      ...a,
      option:
        i < n
          ? gameQuestion(g, a.questionId)!.correct
          : (gameQuestion(g, a.questionId)!.correct + 1) % 4,
    })),
  });
  const noPerfect = games.map((g) => withCorrect(g, 8));
  assert(
    !achievements(noPerfect).find((b) => b.id === "topic_quran_diamond")!
      .earned,
  );
  const justUnder = games.map((g, i) => withCorrect(g, i < 3 ? 10 : 7));
  assert.equal(progress(justUnder).correct, 149);
  assert(
    !achievements(justUnder).find((b) => b.id === "topic_quran_diamond")!
      .earned,
  );
  justUnder[19] = withCorrect(games[19]!, 8);
  assert.equal(progress(justUnder).correct, 150);
  assert(
    achievements(justUnder).find((b) => b.id === "topic_quran_diamond")!.earned,
  );
});

test("a later saved perfect replay cannot replace an earlier low score by backdating the clock", () => {
  const g = round(2000);
  const poor = {
    ...g,
    answers: g.answers.map((a, i) => ({
      ...a,
      option:
        i === 0
          ? gameQuestion(g, a.questionId)!.correct
          : (gameQuestion(g, a.questionId)!.correct + 1) % 4,
    })),
  };
  const replay = {
    ...g,
    id: "quiz-backdated-perfect",
    startedAt: g.startedAt - 1000,
    completedAt: g.completedAt - 1000,
    answers: g.answers.map((a) => ({ ...a, at: a.at - 1000 })),
  };
  assert(validRecord(poor));
  assert(validRecord(replay));
  assert.equal(progress([poor, replay]).xp, 10);
  assert(
    !progress([poor, replay]).badges.find((b) => b.id === "perfect")!.earned,
  );
  assert.equal(
    achievements([poor, replay])
      .find((b) => b.id === "topic_quran_gold")!
      .goals.find((g) => g.label === "correct")!.value,
    1,
  );
});
