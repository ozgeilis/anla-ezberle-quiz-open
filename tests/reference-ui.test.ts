import assert from "node:assert/strict";
import test from "node:test";
import { profileSummary } from "../src/features/profile/summary";
import { matchesCollection } from "../src/features/achievements/presentation";
import { achievements } from "../src/domain/achievements/evaluate";
import {
  createSession,
  answerQuestion,
  advanceQuestion,
  finishSession,
} from "../src/domain/game/engine";
import { gameQuestion } from "../src/content/questions/registry";

function record(day: string, correct: number) {
  const at = Date.parse(`${day}T12:00:00Z`);
  let session = createSession("focus", "quran", at, { channel: "prototype" });
  for (let i = 0; i < 10; i++) {
    const q = gameQuestion(session, session.questionIds[i]!)!;
    session = answerQuestion(
      session,
      i < correct ? q.correct : (q.correct + 1) % 4,
      at + (i + 1) * 1000,
    );
    if (i < 9) session = advanceQuestion(session);
  }
  return finishSession(session);
}
test("profile empty state cannot invent accuracy, streak or a favourite", () => {
  assert.deepEqual(profileSummary([], new Date("2026-10-22T12:00:00Z")), {
    totalScore: 0,
    games: 0,
    accuracy: null,
    streak: 0,
    favorite: null,
  });
});
test("profile reads actual old results and consecutive days without changing records", () => {
  const games = [
    record("2026-10-19", 10),
    record("2026-10-20", 8),
    record("2026-10-21", 3),
    record("2026-10-21", 7),
  ];
  const before = JSON.stringify(games);
  const summary = profileSummary(games, new Date("2026-10-22T12:00:00Z"));
  assert.equal(summary.totalScore, 2800);
  assert.equal(summary.accuracy, 70);
  assert.equal(summary.streak, 3);
  assert.equal(summary.favorite, "Kur’an");
  assert.equal(
    profileSummary(games, new Date("2026-10-23T12:00:00Z")).streak,
    0,
  );
  assert.equal(JSON.stringify(games), before);
});
test("collection filters preserve actual unlock and preview states", () => {
  const badges = achievements([record("2026-10-22", 6)]),
    before = JSON.stringify(badges);
  for (const b of badges) {
    assert.equal(matchesCollection(b, "all"), true);
    assert.equal(matchesCollection(b, "earned"), b.earned);
    assert.equal(
      matchesCollection(b, "rare"),
      b.tier === "gold" || b.tier === "diamond",
    );
    assert.equal(
      matchesCollection(b, "new"),
      b.available && !b.earned && b.fraction > 0,
    );
    if (b.group === "seasonal")
      assert.equal(matchesCollection(b, "new"), false);
  }
  assert(badges.some((b) => matchesCollection(b, "earned")));
  assert(badges.some((b) => matchesCollection(b, "rare")));
  assert.equal(JSON.stringify(badges), before);
});
