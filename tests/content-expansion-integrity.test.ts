import assert from "node:assert/strict";
import test from "node:test";
import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { createHash } from "node:crypto";
import { questions as active, BANK_VERSION } from "../src/content/questions";
import { questionsV73 } from "../src/content/questions/questions-v73";
import { expandedQuestionsV74Candidate as candidate } from "../src/content/questions/questions-v74.candidate";
import { candidateTopicByQuestionIdV74 as topics } from "../src/content/questions/learning-topics-v74.candidate";
import { reviewedTopicByQuestionIdV72 } from "../src/content/questions/learning-topics-v72";
import { playCategories } from "../src/domain/game/play-categories";
import { structuralIssues } from "../scripts/content-expansion-baseline";
import original from "../docs/content-3000-20261125/progress.json";
import { gameStages } from "../src/domain/game/stages";
import {
  selectDifficultyQuestions,
  selectStageQuestions,
  selectionConceptKeys,
} from "../src/domain/game/engine";

const normalize = (s: string) =>
  s
    .normalize("NFKC")
    .toLocaleLowerCase("tr-TR")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
const directory = resolve("docs/content-3000-20261125");

test("complete candidate has exactly 3000 valid records, including 375 new per preserved schema category", () => {
  assert.equal(candidate.length, 3000);
  assert.equal(new Set(candidate.map((q) => q.id)).size, 3000);
  for (const [id, count] of Object.entries({
    quran: 825,
    prophets: 605,
    history: 776,
    general: 794,
  })) {
    const pool = candidate.filter((q) => q.categoryId === id);
    assert.equal(pool.length, count, id);
    assert.equal(pool.filter((q) => q.id.startsWith("new74-")).length, 375, id);
    for (const difficulty of ["easy", "medium", "hard"])
      assert.ok(
        pool.filter((q) => q.difficulty === difficulty).length >= 10,
        `${id}/${difficulty}`,
      );
  }
  const stems = new Map<string, string>();
  for (const q of candidate) {
    assert.deepEqual(structuralIssues(q), [], q.id);
    assert.ok(
      q.sources.every(
        (s) =>
          s.checkStatus === "supported" &&
          s.url.startsWith("https://") &&
          s.locator &&
          s.supports,
      ),
      q.id,
    );
    assert.ok(
      !stems.has(normalize(q.question)),
      `${q.id} duplicates ${stems.get(normalize(q.question))}`,
    );
    stems.set(normalize(q.question), q.id);
  }
});

test("candidate topics partition all 3000 questions into the six existing screens without orphaning IDs", () => {
  assert.equal(Object.keys(topics).length, 3000);
  const ids = new Set(candidate.map((q) => q.id));
  for (const id of Object.keys(topics)) assert.ok(ids.has(id), id);
  const mapped = playCategories.flatMap((c) =>
    candidate.filter((q) =>
      (c.topics as readonly string[]).includes(topics[q.id]!),
    ),
  );
  assert.equal(mapped.length, 3000);
  assert.equal(new Set(mapped.map((q) => q.id)).size, 3000);
  for (const c of playCategories) {
    const pool = mapped.filter((q) =>
      (c.topics as readonly string[]).includes(topics[q.id]!),
    );
    for (const level of ["easy", "medium", "hard"])
      assert.ok(
        pool.filter((q) => q.difficulty === level).length >= 10,
        `${c.id}/${level}`,
      );
  }
  assert.equal(Object.keys(reviewedTopicByQuestionIdV72).length, 1500);
});

test("full option audit covers every old record once and source comparison covers all old IDs", async () => {
  const names = await readdir(directory);
  const audits = await Promise.all(
    names
      .filter((n) => /^old-options-difficulty-review-\d+\.json$/.test(n))
      .map(
        async (n) =>
          JSON.parse(await readFile(resolve(directory, n), "utf8")) as {
            records: { id: string }[];
          },
      ),
  );
  const reviewed = audits.flatMap((a) => a.records.map((r) => r.id));
  assert.equal(reviewed.length, 1500);
  assert.equal(new Set(reviewed).size, 1500);
  assert.deepEqual([...reviewed].sort(), questionsV73.map((q) => q.id).sort());
  const first = JSON.parse(
    await readFile(resolve(directory, "source-rechecks.json"), "utf8"),
  ) as { checks: { id: string }[] };
  const batches = await Promise.all(
    names
      .filter((n) => /^source-rechecks-batch\d+\.json$/.test(n))
      .map(
        async (n) =>
          JSON.parse(await readFile(resolve(directory, n), "utf8")) as {
            groups: { ids: string[] }[];
          },
      ),
  );
  const checked = [
    ...first.checks.map((r) => r.id),
    ...batches.flatMap((a) => a.groups.flatMap((g) => g.ids)),
  ];
  assert.equal(checked.length, 1500);
  assert.deepEqual([...checked].sort(), questionsV73.map((q) => q.id).sort());
});

test("all six candidate screens support independent difficulty and staged rounds", () => {
  for (const category of playCategories) {
    const pool = candidate.filter((q) =>
      (category.topics as readonly string[]).includes(topics[q.id]!),
    );
    const rounds = [
      ...(["easy", "medium", "hard"] as const).map((difficulty) =>
        selectDifficultyQuestions(pool, difficulty, [], () => 0.37),
      ),
      ...gameStages.map((stage) =>
        selectStageQuestions(pool, stage.id, [], () => 0.37),
      ),
    ];
    for (const round of rounds) {
      assert.equal(round.length, 10, category.id);
      assert.equal(new Set(round.map((q) => q.id)).size, 10);
      const keys = new Set<string>();
      for (const q of round) {
        assert.ok(pool.includes(q));
        for (const key of selectionConceptKeys(q)) {
          assert.ok(!keys.has(key), `${category.id}: ${key}`);
          keys.add(key);
        }
      }
    }
  }
});

test("v74 integration preserves the exact frozen v73 snapshot and historical identities", () => {
  assert.equal(BANK_VERSION, 74);
  assert.equal(active.length, 3000);
  assert.equal(
    createHash("sha256").update(JSON.stringify(questionsV73)).digest("hex"),
    original.bankSha256,
  );
  for (const old of questionsV73) {
    const next = candidate.find((q) => q.id === old.id)!;
    assert.ok(next);
    assert.equal(next.categoryId, old.categoryId);
    assert.equal(next.correctOptionId, old.correctOptionId);
    assert.deepEqual(
      next.options.map((o) => o.id),
      old.options.map((o) => o.id),
    );
  }
});
