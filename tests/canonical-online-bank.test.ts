import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { questions, BANK_VERSION } from "../src/content/questions";
import { questions1500 } from "../src/content/questions/questions-1500";
import {
  approvedNewQuestionsV72,
  retiredQuestionIdsV72,
} from "../src/content/questions/release-v72-meaning";
import { buildOnlineContentRows } from "../scripts/online-content-export";
import { liveContent, liveContentSql } from "../scripts/live-content";
import { createSession } from "../src/domain/game/engine";
import { createDemoDocument } from "../src/domain/duel/machine";
import { historicalQuestion } from "../src/content/questions/registry";

const data = liveContent();
test("all new mode exports preserve the exact canonical 1500 records and 30 replacements", () => {
  assert.equal(BANK_VERSION, 73);
  const online = buildOnlineContentRows();
  assert.equal(online.length, 1500);
  assert.equal(new Set(online.map((q) => q.id)).size, 1500);
  for (const q of questions) {
    assert.deepEqual(online.find((r) => r.id === q.id)!.metadata, q);
    const row = data.rows.find((r) => r.id === q.id)!;
    assert.deepEqual(row.public.options, q.options);
    assert.equal(row.correct, q.correctOptionId);
    assert.deepEqual(row.sources, q.sources);
    assert(!("correct" in row.public));
    assert(!("explanation" in row.public));
  }
  for (const q of approvedNewQuestionsV72) {
    assert(online.some((r) => r.id === q.id));
    assert(data.rows.some((r) => r.id === q.id));
    assert(data.pools.some((p) => p.candidates.includes(q.id)));
  }
  for (const id of retiredQuestionIdsV72) {
    assert(!online.some((q) => q.id === id));
    assert(!data.rows.some((q) => q.id === id));
    assert(historicalQuestion(71, id));
  }
  assert.throws(() => buildOnlineContentRows(questions1500), /canonical/);
});
test("solo, daily, difficulty and local demo start on v73; exporters never activate", () => {
  for (const mode of ["mixed", "daily"] as const) {
    const session = createSession(mode, undefined, 1800000000000);
    assert.equal(session.bankVersion, 73);
    assert(
      session.questionIds.every((id) => questions.some((q) => q.id === id)),
    );
  }
  for (const difficulty of ["easy", "medium", "hard"] as const) {
    const session = createSession("mixed", undefined, 1800000000000, {
      difficulty,
    });
    assert.equal(session.bankVersion, 73);
    assert(
      session.questionIds.every(
        (id) => questions.find((q) => q.id === id)!.difficulty === difficulty,
      ),
    );
  }
  assert.equal(createDemoDocument().seed.bankVersion, 73);
  assert.doesNotMatch(liveContentSql(), /UPDATE quiz_private.live_config/);
  for (const path of [
    "scripts/live-content.ts",
    "scripts/online-content-export.ts",
  ])
    assert.doesNotMatch(readFileSync(path, "utf8"), /archive\/bank-v(13|41)/);
});
test("all 264 online topic/level/count combinations use only their exact eligible v73 pool", () => {
  assert.equal(data.pools.length, 264);
  for (const p of data.pools) {
    const expected = data.rows
      .filter(
        (q) =>
          (p.topic === "mixed" || q.topic === p.topic) &&
          p.quotas[q.difficulty] > 0,
      )
      .map((q) => q.id);
    assert.deepEqual(p.candidates, expected);
    assert(p.sample.length === 0 || p.sample.length === p.count);
    const keys = p.sample.flatMap(
      (id) => data.rows.find((q) => q.id === id)!.keys,
    );
    assert.equal(keys.length, new Set(keys).size);
  }
});
