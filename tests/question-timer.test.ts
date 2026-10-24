import assert from "node:assert/strict";
import { test } from "node:test";
import { QuestionClock } from "../src/domain/game/question-clock";
import {
  createSession,
  answerQuestion,
  advanceQuestion,
  expireQuestion,
  finishSession,
  stats,
} from "../src/domain/game/engine";
import { gameQuestion } from "../src/content/questions/registry";
import { validRecord, parseData, emptyData } from "../src/storage/schema";
import { rewardSummary } from "../src/domain/scoring/rewards";
const at = 1_792_800_000_000;
test("monotonic question clock survives delayed callbacks and suspension without granting time", () => {
  let mono = 500;
  const c = new QuestionClock(at, () => mono);
  assert.equal(c.remaining(), 10000);
  mono += 9999;
  assert.equal(c.expired(), false);
  mono++;
  assert.equal(c.expired(), true);
  mono += 120000;
  assert.equal(c.remaining(), 0);
  assert.equal(c.now(), at + 130000);
});
test("deadline is exclusive; late taps lock a timeout once and cannot change the answer", () => {
  const initial = createSession("mixed", undefined, at, { timed: true });
  const q = gameQuestion(initial, initial.questionIds[0]!)!;
  const pending = { ...initial, questionOpenedAt: undefined };
  assert.equal(answerQuestion(pending, q.correct, at), pending);
  const before = answerQuestion(initial, q.correct, at + 9999);
  assert.equal(before.answers[0]!.option, q.correct);
  assert.equal(expireQuestion(before, at + 20000), before);
  const late = answerQuestion(initial, q.correct, at + 10000);
  assert.equal(late.answers[0]!.option, -1);
  assert.equal(late.answers[0]!.timedOut, true);
  assert.equal(answerQuestion(late, q.correct, at + 10001), late);
  assert.equal(expireQuestion(late, at + 90000), late);
  assert.equal(expireQuestion(initial, at + 9999), initial);
});
test("ten unanswered/daily questions finish, persist, earn zero XP and preserve old records", () => {
  for (const mode of ["mixed", "daily"] as const) {
    let s = createSession(mode, undefined, at, { timed: true });
    for (let i = 0; i < 10; i++) {
      const open = s.questionOpenedAt!;
      assert.equal(advanceQuestion(s, open), s);
      s = expireQuestion(s, open + 60000); // delayed timer: record actual deadline, not delayed callback
      assert.equal(s.answers.at(-1)!.at, open + 10000);
      if (i < 9) s = advanceQuestion(s, open + 65000); // reading explanation consumes no new question time
    }
    const g = finishSession(s);
    assert(validRecord(g));
    assert.equal(stats(g).score, 0);
    assert.equal(stats(g).wrong, 0);
    assert.equal(stats(g).unanswered, 10);
    assert.equal(rewardSummary([g]), 0);
    assert.deepEqual(
      parseData(JSON.stringify({ ...emptyData(), games: [g] })).games,
      [g],
    );
    const forged = structuredClone(g);
    forged.answers[0]!.timedOut = undefined;
    assert.equal(validRecord(forged), false);
  }
  let old = createSession("mixed", undefined, at);
  for (let i = 0; i < 10; i++) {
    old = answerQuestion(old, 0, at + i + 1);
    if (i < 9) old = advanceQuestion(old);
  }
  const record = finishSession(old);
  assert(validRecord(record));
  assert.equal("timingVersion" in record, false);
  assert.equal(
    validRecord({
      ...record,
      answers: record.answers.map((a, i) =>
        i ? a : { ...a, option: -1, timedOut: true },
      ),
    }),
    false,
  );
});
