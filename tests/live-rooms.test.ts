import { questions1500 } from "../src/content/questions/questions-1500";
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  liveClock,
  liveQuotas,
  liveLevels,
  liveCounts,
  WIN_BONUS_XP,
} from "../src/domain/live/rules";
import { gameStages } from "../src/domain/game/stages";
import {
  independentQuestions,
  selectionConceptKeys,
} from "../src/domain/game/engine";
import { questions } from "../src/content/questions";
import { bankV41 } from "../src/content/questions/archive/bank-v41";
import { liveContent } from "../scripts/live-content";
import { achievements } from "../src/domain/achievements/evaluate";

test("live countdown, answer deadline, reveal and completion use one authoritative timeline", () => {
  const start = 10000;
  assert.deepEqual(liveClock(start, start - 3000, 10), {
    phase: "countdown",
    position: 0,
    seconds: 3,
  });
  assert.deepEqual(liveClock(start, start, 10), {
    phase: "answer",
    position: 1,
    seconds: 15,
  });
  assert.equal(liveClock(start, start + 14999, 10).phase, "answer");
  assert.deepEqual(liveClock(start, start + 15000, 10), {
    phase: "reveal",
    position: 1,
    seconds: 5,
  });
  assert.deepEqual(liveClock(start, start + 20000, 10), {
    phase: "answer",
    position: 2,
    seconds: 15,
  });
  for (const count of liveCounts)
    assert.deepEqual(liveClock(start, start + count * 20000, count), {
      phase: "completed",
      position: count,
      seconds: 0,
    });
});
test("5/10/15 live stage quotas preserve ratios and never silently widen the level", () => {
  for (const level of liveLevels)
    for (const n of liveCounts) {
      const q = liveQuotas(level, n);
      assert.equal(q.easy + q.medium + q.hard, n);
      if (["easy", "medium", "hard"].includes(level))
        assert.equal(q[level as keyof typeof q], n);
    }
  for (const stage of gameStages)
    assert.deepEqual(liveQuotas(stage.id, 10), stage.counts);
  assert.throws(() => liveQuotas("ramazan", 10));
  assert.throws(() => liveQuotas("easy", 12));
  assert.equal(WIN_BONUS_XP, 20);
});
test("live export preserves all 1500 canonical questions, sources and answers without editing the bank", () => {
  const { rows, pools, version } = liveContent();
  assert.equal(rows.length, 1500);
  assert.equal(version, 73);
  assert.equal(questions.length, 1500);
  assert.deepEqual(questions1500.slice(0, bankV41.length), bankV41);
  assert.equal(pools.length, 264);
  for (const q of questions) {
    const row = rows.find((r) => r.id === q.id)!;
    assert(
      row.public.prompt === q.question &&
        row.version === q.version &&
        row.correct === q.correctOptionId &&
        row.explanation === q.explanation,
    );
    assert.deepEqual(row.public.options, q.options);
    assert.deepEqual(row.sources, q.sources);
  }
  for (const p of pools.filter((p) => p.sample.length)) {
    assert.equal(p.sample.length, p.count);
    const used = new Set<string>(),
      counts = { easy: 0, medium: 0, hard: 0 };
    for (const id of p.sample) {
      const row = rows.find((r) => r.id === id)!;
      assert(p.topic === "mixed" || row.topic === p.topic);
      for (const key of row.keys) {
        assert(!used.has(key), "Repeated concept in feasibility witness");
        used.add(key);
      }
      counts[row.difficulty]++;
    }
    assert.deepEqual(counts, p.quotas);
  }
  assert(
    pools.some((p) => !p.sample.length),
    "Sparse combinations must remain unavailable",
  );
});
test("shared selector rejects raw-count-only pools and supports independent 5/15 sets", () => {
  const base = questions.find((q) => q.categoryId === "quran")!;
  const duplicates = Array.from({ length: 20 }, (_, i) => ({
    ...base,
    id: `copy-${i}`,
  }));
  assert.equal(independentQuestions(duplicates, undefined, 5), null);
  for (const n of liveCounts) {
    const selected = independentQuestions(questions, undefined, n)!;
    assert.equal(selected.length, n);
    const keys = selected.flatMap(selectionConceptKeys);
    assert.equal(new Set(keys).size, keys.length);
  }
  assert.equal(independentQuestions(questions, undefined, 0), null);
});
test("new live badges require server award IDs; local metric claims cannot grant them", () => {
  assert(
    achievements([])
      .filter((b) => b.id.startsWith("live_"))
      .every((b) => !b.earned),
  );
  const social = {
    earned: [] as string[],
    metrics: {
      friends: 0,
      opponents: 0,
      wins: 0,
      perfect: 0,
      liveRounds: 999,
      liveWins: 999,
      livePerfect: 999,
      liveFriends: 999,
    },
    shared: false,
    showcase: [],
  };
  assert(
    achievements([], social)
      .filter((b) => b.id.startsWith("live_"))
      .every((b) => !b.earned),
  );
  social.earned = ["live_first"];
  const badges = achievements([], social);
  assert(badges.find((b) => b.id === "live_first")!.earned);
  assert(!badges.find((b) => b.id === "live_win")!.earned);
});

test("10-second rooms follow the server rule while historical 15-second rooms keep their timeline", () => {
  const start = 10000;
  assert.equal(liveClock(start, start + 9999, 5, 10).phase, "answer");
  assert.deepEqual(liveClock(start, start + 10000, 5, 10), {
    phase: "reveal",
    position: 1,
    seconds: 5,
  });
  assert.deepEqual(liveClock(start, start + 15000, 5, 10), {
    phase: "answer",
    position: 2,
    seconds: 10,
  });
  assert.equal(liveClock(start, start + 75000, 5, 10).phase, "completed");
  assert.equal(liveClock(start, start + 10000, 5, 15).phase, "answer");
});
