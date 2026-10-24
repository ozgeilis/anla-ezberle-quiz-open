import assert from "node:assert/strict";
import { test } from "node:test";
import {
  ANSWER_FEEDBACK_MS,
  FeedbackTransition,
} from "../src/domain/game/feedback-transition";

test("feedback advances only once, including duplicate final-question callbacks", () => {
  assert.equal(ANSWER_FEEDBACK_MS, 1200);
  const gate = new FeedbackTransition();
  const take = gate.arm("round:9", false)!;
  assert.equal(take(), true);
  assert.equal(take(), false);
  assert.equal(gate.arm("round:9", false), null);
  assert.equal(gate.arm("new-round:0", false)!(), true);
});
test("background, exit dialog, and stale question timers cannot advance a round", () => {
  const gate = new FeedbackTransition();
  const stale = gate.arm("a:0", false)!;
  gate.cancel();
  assert.equal(stale(), false);
  assert.equal(gate.arm("a:0", true), null);
  const resume = gate.arm("a:0", false)!;
  const replacement = gate.arm("a:1", false)!;
  assert.equal(resume(), false);
  assert.equal(replacement(), true);
});
