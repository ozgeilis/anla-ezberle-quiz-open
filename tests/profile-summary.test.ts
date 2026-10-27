import assert from "node:assert/strict";
import test from "node:test";
import { profileSummary } from "../src/features/profile/summary";
import { showcaseBadges } from "../src/features/achievements/presentation";
import { achievements } from "../src/domain/achievements/evaluate";
import {
  createSession,
  answerQuestion,
  expireQuestion,
  advanceQuestion,
  finishSession,
  type GameRecord,
} from "../src/domain/game/engine";
import { gameQuestion } from "../src/content/questions/registry";
function round(at: string, correct = 5, timeouts = 0): GameRecord {
  const start = Date.parse(at);
  let s = createSession("focus", "quran", start, { timed: true });
  for (let i = 0; i < 10; i++) {
    const q = gameQuestion(s, s.questionIds[i]!)!;
    s =
      i >= 10 - timeouts
        ? expireQuestion(s, start + (i + 1) * 12000)
        : answerQuestion(
            s,
            i < correct ? q.correct : (q.correct + 1) % 4,
            start + i * 12000 + 1000,
          );
    if (i < 9) s = advanceQuestion(s, start + (i + 1) * 12000);
  }
  return finishSession(s);
}
test("profile accuracy includes unanswered questions and score is not XP", () => {
  const g = round("2026-10-26T12:00:00Z", 1, 9),
    before = JSON.stringify(g);
  const s = profileSummary([g], new Date("2026-10-26T20:00:00Z"));
  assert.equal(s.accuracy, 10);
  assert.equal(s.totalScore, 100);
  assert.equal(s.games, 1);
  assert.equal(JSON.stringify(g), before);
});
test("profile deduplicates record IDs, counts distinct replays, and uses Istanbul calendar days", () => {
  const a = round("2026-10-24T21:15:00Z"),
    b = round("2026-10-25T21:15:00Z", 8);
  const s = profileSummary([a, a, b], new Date("2026-10-26T20:00:00Z"));
  assert.equal(s.games, 2);
  assert.equal(s.totalScore, 1300);
  assert.equal(s.accuracy, 65);
  assert.equal(s.streak, 2);
  assert.equal(
    profileSummary([a, b], new Date("2026-10-28T12:00:00Z")).streak,
    0,
  );
  const sameDay = round("2026-10-25T22:15:00Z", 10);
  assert.equal(
    profileSummary([a, b, sameDay], new Date("2026-10-26T20:00:00Z")).streak,
    2,
  );
});
test("showcase ignores unearned/unknown/duplicate IDs and never exceeds three real awards", () => {
  const badges = achievements(
    Array.from({ length: 8 }, (_, i) =>
      round(`2026-10-${String(10 + i).padStart(2, "0")}T12:00:00Z`, 10),
    ),
  );
  const earned = badges.filter((b) => b.earned),
    locked = badges.find((b) => !b.earned)!;
  const ids = [
    ...earned.map((b) => b.id),
    locked.id,
    "unknown",
    ...earned.map((b) => b.id),
  ];
  const result = showcaseBadges(badges, ids);
  assert.equal(result.length, 3);
  assert(result.every((b) => b.earned));
  assert.equal(new Set(result.map((b) => b.id)).size, 3);
  assert.deepEqual(showcaseBadges(achievements([]), ids), []);
});
