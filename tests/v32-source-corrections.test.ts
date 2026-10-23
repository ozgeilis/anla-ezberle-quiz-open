import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { test } from "node:test";
import { bankV31 } from "../src/content/questions/archive/bank-v31";
import { bankV32 } from "../src/content/questions/archive/bank-v32";
import { publishedCorrectionsV32 } from "../src/content/questions/published-v32";

import { gameQuestion } from "../src/content/questions/registry";
import { parseData, emptyData, appendGame } from "../src/storage/schema";
import {
  createSession,
  answerQuestion,
  advanceQuestion,
  finishSession,
  stats,
} from "../src/domain/game/engine";

test("v32 applies six source corrections and leaves all v31 answers and option IDs immutable", () => {
  assert.equal(bankV32.length, 600);
  assert.equal(publishedCorrectionsV32.length, 6);
  assert.equal(
    createHash("sha256").update(JSON.stringify(bankV31)).digest("hex"),
    "a0a8b3ff481b2476ce46e542a1575a0fdb1b7407cbab1d6232ab4cb0408c9151",
  );
  for (const [index, current] of bankV32.entries()) {
    const old = bankV31[index]!;
    assert.equal(current.id, old.id);
    assert.equal(current.correctOptionId, old.correctOptionId);
    assert.deepEqual(current.options, old.options);
    assert.equal(current.reviewedAt, undefined);
    if (publishedCorrectionsV32.includes(current)) {
      assert.equal(current.version, old.version + 1);
      const optionOrders = {
        [current.id]: [...old.options].reverse().map((o) => o.id),
      };
      const historic = gameQuestion({ bankVersion: 31, optionOrders }, old.id)!;
      const revised = gameQuestion({ bankVersion: 32, optionOrders }, old.id)!;
      assert.equal(historic.text, old.question);
      assert.equal(historic.explanation, old.explanation);
      assert.equal(historic.source.url, old.sources[0]!.url);
      assert.equal(revised.text, current.question);
      assert.equal(revised.source.url, current.sources[0]!.url);
      assert.equal(revised.correct, historic.correct);
    } else assert.equal(current, old);
  }
});

test("current and a saved v31 round retain scoring, XP and their original text after serialization", () => {
  const time = 1800000000000;
  let session = createSession("mixed", undefined, time, { difficulty: "easy" });
  assert.equal(session.bankVersion, 72);
  for (let i = 0; i < 10; i++) {
    session = answerQuestion(session, 0, time + 1000 * (i + 1));
    if (i < 9) session = advanceQuestion(session);
  }
  const current = finishSession(session);
  // A legacy record must use questions and option orders from its own frozen bank;
  // simply relabeling an active v71 round is not a valid historical game.
  const historical = bankV31.filter((q) => q.difficulty === "easy").slice(0, 10);
  assert.equal(historical.length, 10);
  const old = {
    ...current,
    id: `${current.id}-v31`,
    bankVersion: 31,
    questionIds: historical.map((q) => q.id),
    optionOrders: Object.fromEntries(historical.map((q) => [q.id, q.options.map((o) => o.id)])),
    answers: current.answers.map((a, i) => ({ ...a, questionId: historical[i]!.id })),
  };
  const before = stats(old);
  const restored = parseData(
    JSON.stringify(appendGame(appendGame(emptyData(), old), current)),
  );
  assert.deepEqual(restored.games[0], old);
  assert.deepEqual(restored.games[1], current);
  assert.deepEqual(stats(restored.games[0]!), before);
});
