import assert from "node:assert/strict";
import test from "node:test";
import {
  getLevelFromXp,
  getLevelProgress,
  getMaxLevel,
  getXpNeededForNextLevel,
  getXpRangeForLevel,
} from "../src/domain/scoring/levels";

test("progressive levels match requested boundaries, preserving total earned XP", () => {
  for (const [xp, level] of [
    [0, 1],
    [99, 1],
    [100, 2],
    [210, 3],
    [330, 4],
    [1260, 10],
    [3610, 20],
    [16660, 50],
    [34410, 75],
    [57330, 99],
    [58410, 100],
  ])
    assert.equal(getLevelFromXp(xp!), level);
  for (const [level, needed] of [
    [1, 100],
    [2, 110],
    [10, 190],
    [20, 290],
    [50, 590],
    [75, 840],
    [99, 1080],
  ])
    assert.equal(getXpNeededForNextLevel(level!), needed);
});
test("all 99 thresholds are continuous and have exact exclusive upper boundaries", () => {
  let cumulative = 0;
  for (let level = 1; level < getMaxLevel(); level++) {
    const cost = 100 + (level - 1) * 10;
    assert.deepEqual(getXpRangeForLevel(level), {
      min: cumulative,
      max: cumulative + cost,
    });
    assert.equal(getLevelFromXp(cumulative), level);
    assert.equal(getLevelFromXp(cumulative + cost - 1), level);
    cumulative += cost;
    assert.equal(getLevelFromXp(cumulative), level + 1);
  }
  assert.equal(cumulative, 58410);
});
test("progress is relative to the current range; maximum is full and never divides by zero", () => {
  assert.deepEqual(getLevelProgress(155), {
    level: 2,
    levelXp: 55,
    requiredXp: 110,
    nextLevelXp: 55,
    levelPercent: 50,
    atMax: false,
  });
  for (const xp of [58410, 58411, Number.MAX_SAFE_INTEGER]) {
    const p = getLevelProgress(xp);
    assert.equal(p.level, 100);
    assert.equal(p.levelPercent, 100);
    assert.equal(p.nextLevelXp, 0);
    assert.equal(getXpRangeForLevel(p.level).max, null);
  }
});
test("malformed XP falls back safely; level helpers clamp to the supported range", () => {
  for (const value of [-1, NaN, Infinity, -Infinity])
    assert.equal(getLevelFromXp(value), 1);
  assert.equal(getLevelFromXp(100.9), 2);
  assert.deepEqual(getXpRangeForLevel(-5), { min: 0, max: 100 });
  assert.equal(getXpNeededForNextLevel(1000), 0);
});
