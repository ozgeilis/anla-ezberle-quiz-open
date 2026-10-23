import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";
import {
  BANK_VERSION,
  questions,
  questionById,
} from "../src/content/questions";
import { questions1500 } from "../src/content/questions/questions-1500";
import { questionsV72 } from "../src/content/questions/questions-v72";
import {
  retiredQuestionIdsV72,
  approvedNewQuestionsV72,
} from "../src/content/questions/release-v72-meaning";

import { questions as bankV1 } from "../src/content/questions/archive/bank-v1";
import { bankV71 } from "../src/content/questions/archive/bank-v71";
import {
  gameQuestion,
  SUPPORTED_BANK_VERSIONS,
} from "../src/content/questions/registry";
import { parseData } from "../src/storage/schema";
import { stats, type GameRecord } from "../src/domain/game/engine";
import { progress } from "../src/domain/scoring/progress";
import {
  canonicalQuestionSource,
  canonicalV72Source,
} from "../scripts/consolidate-questions";
import { questionSnapshot } from "../scripts/question-snapshot";
import { questionDependencies } from "../scripts/question-dependencies";
import baseline from "./fixtures/content/pre-consolidation-v71.json";
import savedRounds from "./fixtures/content/saved-rounds-v1-v71.json";

const digest = (value: unknown) =>
  createHash("sha256").update(questionSnapshot(value)).digest("hex");

test("frozen canonical v71 retains all 1,500 pre-refactor records", async () => {
  assert.equal(questions1500.length, 1500);
  assert.deepStrictEqual(questions1500, bankV71);
  assert.equal(digest(questions1500), baseline.banks[71].sha256);
  const frozen = await readFile(
    new URL("../src/content/questions/questions-1500.ts", import.meta.url),
    "utf8",
  );
  assert.equal(frozen, canonicalQuestionSource(), "Historical v71 is frozen");
});

test("v72 replaces 30 rote Quran questions and keeps 1,500 playable records", async () => {
  assert.equal(BANK_VERSION, 72);
  assert.equal(questions, questionsV72);
  assert.equal(questions.length, 1500);
  assert.equal(new Set(questions.map((q) => q.id)).size, 1500);
  assert.equal(retiredQuestionIdsV72.length, 30);
  assert.equal(approvedNewQuestionsV72.length, 30);
  const retired = new Set<string>(retiredQuestionIdsV72);
  const added = new Set(approvedNewQuestionsV72.map((q) => q.id));
  for (const old of retired) {
    assert.ok(
      questions1500.some((q) => q.id === old),
      old,
    );
    assert.ok(!questionById.has(old), `Retired v71 question persisted: ${old}`);
  }
  for (const next of approvedNewQuestionsV72) {
    assert.equal(questionById.get(next.id)?.question, next.question);
    assert.equal(next.reviewStatus, "approved");
    assert.ok(next.sources.length > 0);
    assert.ok(next.sources.every((s) => s.checkStatus === "supported"));
  }
  for (const q of questions) {
    assert.equal(questionById.get(q.id), q);
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options.map((o) => o.id)).size, 4);
    assert.equal(new Set(q.options.map((o) => o.text)).size, 4);
    assert.ok(q.options.some((o) => o.id === q.correctOptionId));
    assert.ok(q.explanation.trim());
    assert.ok(
      q.sources.length &&
        q.sources.every((s) => s.url && s.locator && s.supports),
    );
  }
  for (let i = 0; i < questions.length; i++) {
    const before = questions1500[i]!;
    const after = questions[i]!;
    if (!retired.has(before.id)) assert.deepStrictEqual(after, before);
    else assert.ok(added.has(after.id));
  }
  assert.equal(questions.filter((q) => q.categoryId === "quran").length, 450);
  const file = await readFile(
    new URL("../src/content/questions/questions-v72.ts", import.meta.url),
    "utf8",
  );
  assert.equal(
    file,
    canonicalV72Source(),
    "Active v72 must regenerate identically",
  );
  const ast = ts.createSourceFile(
    "questions-v72.ts",
    file,
    ts.ScriptTarget.Latest,
    true,
  );
  const imports = ast.statements.filter(ts.isImportDeclaration);
  assert.equal(imports.length, 1);
  assert.equal(imports[0]!.importClause?.isTypeOnly, true);
  const declaration = ast.statements.filter(ts.isVariableStatement)[0]!
    .declarationList.declarations[0]!;
  assert.ok(
    declaration.initializer &&
      ts.isArrayLiteralExpression(declaration.initializer),
  );
  assert.equal(declaration.initializer.elements.length, 1500);
});

test("every historical bank v1–v71 retains the pre-consolidation digest", async () => {
  assert.equal(SUPPORTED_BANK_VERSIONS.length, 72);
  assert.equal(SUPPORTED_BANK_VERSIONS.at(-1), 72);
  for (const version of SUPPORTED_BANK_VERSIONS.filter((v) => v <= 71)) {
    const bank =
      version === 1
        ? bankV1
        : (await import(`../src/content/questions/archive/bank-v${version}`))[
            `bankV${version}`
          ];
    const expected =
      baseline.banks[String(version) as keyof typeof baseline.banks];
    assert.equal(bank.length, expected.count, `v${version} count`);
    assert.equal(
      digest(bank),
      expected.sha256,
      `v${version} exact ordered content and metadata`,
    );
  }
});

test("frozen v1/v13/v31/v41/v71 saves preserve wording, shuffled answers, score, XP and badges", () => {
  for (const fixture of savedRounds) {
    const restored = parseData(JSON.stringify(fixture.stored));
    const game = restored.games[0]!;
    assert.deepStrictEqual(restored, fixture.stored);
    assert.deepStrictEqual(
      game.questionIds.map((id) => gameQuestion(game, id)),
      fixture.views,
    );
    assert.deepStrictEqual(stats(game), fixture.stats);
    assert.deepStrictEqual(progress(restored.games), fixture.progress);
    const changed = structuredClone(game) as GameRecord;
    changed.answers[0]!.option = (changed.answers[0]!.option + 1) % 4;
    assert.equal(stats(changed).score, fixture.stats.score - 100);
  }
});

test("snapshot serialization distinguishes omitted and undefined metadata and preserves order", () => {
  assert.notEqual(
    questionSnapshot({}),
    questionSnapshot({ reviewedAt: undefined }),
  );
  assert.equal(
    questionSnapshot({ reviewedAt: undefined }),
    '{\n  "reviewedAt": undefined\n}',
  );
  assert.notEqual(digest(["a", "b"]), digest(["b", "a"]));
  assert.throws(() => questionSnapshot(new Date()));
});

test("repo-wide static and literal dynamic import graph has no broken local paths", async () => {
  const { edges } = await questionDependencies();
  assert.deepEqual(
    edges.filter((edge) => !edge.to),
    [],
  );
  assert.ok(
    edges.some(
      (e) =>
        e.from === "src/content/questions/index.ts" &&
        e.to === "src/content/questions/questions-v72.ts",
    ),
  );
  assert.ok(
    edges.some(
      (e) =>
        e.from === "scripts/live-content.ts" &&
        e.to === "src/content/questions/archive/bank-v41.ts",
    ),
  );
  assert.ok(
    edges.some(
      (e) =>
        e.from === "scripts/online-content-export.ts" &&
        e.to === "src/content/questions/archive/bank-v13.ts",
    ),
  );
});
