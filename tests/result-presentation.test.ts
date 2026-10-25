import assert from "node:assert/strict";
import { test } from "node:test";
import { resultPresentation } from "../src/features/results/presentation";
import {
  createSession,
  answerQuestion,
  advanceQuestion,
  finishSession,
  stats,
} from "../src/domain/game/engine";
import { gameQuestion } from "../src/content/questions/registry";
import { progress } from "../src/domain/scoring/progress";

test("result identity follows exact percentages for ten, five, twenty and arbitrary question counts", () => {
  for (const [right, total, tier] of [
    [10, 10, "perfect"],
    [9, 10, "excellent"],
    [8, 10, "excellent"],
    [7, 10, "steady"],
    [6, 10, "steady"],
    [5, 10, "beginning"],
    [4, 10, "beginning"],
    [3, 10, "learning"],
    [0, 10, "learning"],
    [5, 5, "perfect"],
    [4, 5, "excellent"],
    [3, 5, "steady"],
    [2, 5, "beginning"],
    [1, 5, "learning"],
    [16, 20, "excellent"],
    [12, 20, "steady"],
    [8, 20, "beginning"],
    [7, 20, "learning"],
    [79, 100, "steady"],
    [399, 1000, "learning"],
  ] as const) {
    const p = resultPresentation(right, total);
    assert.equal(p.tier, tier);
    assert.equal(p.fraction, right / total);
  }
  assert.equal(
    new Set([10, 8, 6, 4, 2].map((n) => resultPresentation(n, 10).label)).size,
    5,
  );
  assert(
    resultPresentation(10, 10).confetti > resultPresentation(8, 10).confetti,
  );
  assert.equal(resultPresentation(6, 10).confetti, 0);
  for (const pair of [
    [0, 0],
    [11, 10],
    [-1, 10],
    [1.2, 10],
    [1, Infinity],
    [NaN, 10],
  ])
    assert.throws(() => resultPresentation(pair[0]!, pair[1]!), RangeError);
});
test("result presentation does not mutate saved games, answer keys or XP and uses true right/wrong counts", () => {
  let s = createSession("mixed", undefined, 1792800000000);
  for (let i = 0; i < 10; i++) {
    const q = gameQuestion(s, s.questionIds[i]!)!;
    s = answerQuestion(
      s,
      i < 6 ? q.correct : (q.correct + 1) % 4,
      1792800000000 + i * 1000,
    );
    if (i < 9) s = advanceQuestion(s);
  }
  const g = finishSession(s),
    before = JSON.stringify(g),
    xp = progress([g]).xp;
  const result = resultPresentation(stats(g).correct, g.questionIds.length);
  assert.equal(result.title, "Gayet iyi!");
  assert.equal(result.percent, 60);
  assert.equal(stats(g).wrong, 4);
  assert.equal(JSON.stringify(g), before);
  assert.equal(progress([g]).xp, xp);
});
