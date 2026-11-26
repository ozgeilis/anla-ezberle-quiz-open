import assert from "node:assert/strict";
import { test } from "node:test";
import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { createHash } from "node:crypto";
import type { Question } from "../src/content/questions/model";
import { questionsV73 as questions } from "../src/content/questions/questions-v73";
import overlaps from "../docs/content-3000-20261125/confirmed-fact-overlaps.json";
import { questionsV74Candidate } from "../src/content/questions/questions-v74.candidate";
import { existingQuestionPatches } from "../src/content/questions/existing-patches-v74";
import replacements from "../docs/content-3000-20261125/existing-replacement-receipts.json";
import {
  expansionCounts,
  structuralIssues,
  readStagedQuestions,
} from "../scripts/content-expansion-baseline";

// Detect changed wording, keys, distractors or citations after a source receipt.
// This checksum is an integrity check, not proof of religious correctness.
const contentFingerprint = (q: Question) =>
  createHash("sha256")
    .update(
      JSON.stringify([
        q.question,
        q.correctOptionId,
        q.options.map((o) => [o.id, o.text]),
        q.explanation,
        q.sources.map((s) => [s.url, s.locator]),
      ]),
    )
    .digest("hex");

test("owner's expansion quota adds 1500 without reassigning historical categories", () => {
  const original = JSON.stringify(questions);
  const counts = expansionCounts(questions);
  assert.deepEqual(
    counts.map((c) => c.existing),
    [450, 230, 401, 419],
  );
  assert.deepEqual(
    counts.map((c) => c.newTarget),
    [375, 375, 375, 375],
  );
  assert.deepEqual(
    counts.map((c) => c.projectedTotal),
    [825, 605, 776, 794],
  );
  assert.equal(
    counts.reduce((n, c) => n + c.projectedTotal, 0),
    3000,
  );
  for (const level of ["easy", "medium", "hard"] as const) {
    assert.equal(
      counts.reduce((n, c) => n + c.provisionalFinalDifficulty[level], 0),
      1000,
    );
  }
  for (const c of counts) {
    assert.equal(
      Object.values(c.provisionalNewDifficulty).reduce((a, b) => a + b, 0),
      375,
    );
    assert.ok(Object.values(c.provisionalNewDifficulty).every((n) => n >= 0));
  }
  assert.equal(JSON.stringify(questions), original);
});

test("structural audit does not equate one correct ID with a verified source", () => {
  assert.deepEqual(structuralIssues(questions[0]!), []);
  const invalid = {
    ...questions[0]!,
    sources: [],
    options: questions[0]!.options.map((o) => ({ ...o, text: "aynı" })),
  } as unknown as (typeof questions)[number];
  assert.deepEqual(structuralIssues(invalid), [
    "invalid-options",
    "no-source-metadata",
  ]);
});

test("semantic overlap evidence references real, distinct existing records", () => {
  const ids = new Set(questions.map((q) => q.id));
  const grouped = new Set<string>();
  for (const group of overlaps.groups) {
    assert.ok(group.ids.length >= 2, group.fact);
    for (const id of group.ids) {
      assert.ok(ids.has(id), id);
      assert.ok(!grouped.has(id), `Record appears in two fact groups: ${id}`);
      grouped.add(id);
    }
  }
  assert.ok(overlaps.groups.length >= 63);
  assert.ok(grouped.size - overlaps.groups.length >= 73);
});

test("staged editorial corrections preserve frozen IDs, keys and old record versions", () => {
  const original = JSON.stringify(questions);
  const patched = new Set<string>(existingQuestionPatches.map((p) => p.id));
  assert.equal(
    patched.size,
    existingQuestionPatches.length,
    "No patch may silently replace another patch",
  );
  assert.deepEqual(
    questionsV74Candidate.map((q) => q.id),
    questions.map((q) => q.id),
  );
  for (const [i, candidate] of questionsV74Candidate.entries()) {
    const previous = questions[i]!;
    assert.equal(candidate.categoryId, previous.categoryId);
    assert.equal(candidate.correctOptionId, previous.correctOptionId);
    assert.deepEqual(
      candidate.options.map((o) => o.id),
      previous.options.map((o) => o.id),
    );
    assert.equal(
      candidate.version,
      previous.version + (patched.has(candidate.id) ? 1 : 0),
    );
    assert.deepEqual(structuralIssues(candidate), [], candidate.id);
    if (patched.has(candidate.id)) {
      assert.equal(candidate.reviewStatus, "reviewed");
      assert.equal(candidate.reviewedAt, undefined);
    }
  }
  assert.equal(JSON.stringify(questions), original);
  assert.match(
    questionsV74Candidate.find((q) => q.id === "q62-arafat-arefe")!.explanation,
    /Hanbelî/,
  );
  assert.match(
    questionsV74Candidate.find((q) => q.id === "q68-nesai-vefat")!.explanation,
    /916/,
  );
});

test("staged additions have fresh IDs, complete options and a bounded category quota", async () => {
  const staged = await readStagedQuestions();
  const oldIds = new Set(questions.map((q) => q.id));
  const ids = new Set<string>();
  const facts = new Set<string>();
  assert.ok(staged.length > 0 && staged.length <= 1500);
  for (const q of staged) {
    assert.ok(!oldIds.has(q.id) && !ids.has(q.id), q.id);
    assert.deepEqual(structuralIssues(q), [], q.id);
    assert.equal(q.version, 1, q.id);
    assert.ok(q.conceptGroup && !facts.has(q.conceptGroup), q.id);
    assert.equal(q.reviewStatus, "reviewed", q.id);
    assert.equal(q.reviewedAt, undefined, q.id);
    assert.ok(
      q.sources.every((s) => s.url.startsWith("https://") && s.locator),
      q.id,
    );
    ids.add(q.id);
    facts.add(q.conceptGroup!);
  }
  for (const category of expansionCounts(questions)) {
    assert.ok(staged.filter((q) => q.categoryId === category.id).length <= 375);
  }
});

test("staged duplicate replacements retain historical lookup identity and introduce a different fact", () => {
  for (const receipt of replacements.replacements) {
    const original = questions.find((q) => q.id === receipt.id)!;
    const candidate = questionsV74Candidate.find((q) => q.id === receipt.id)!;
    const retained = questionsV74Candidate.find(
      (q) => q.id === receipt.retainedOriginalFactAt,
    )!;
    assert.ok(original && candidate && retained);
    assert.ok(
      overlaps.groups.some(
        (group) =>
          group.ids.includes(receipt.id) &&
          group.ids.includes(receipt.retainedOriginalFactAt),
      ),
    );
    assert.equal(candidate.version, original.version + 1);
    assert.equal(candidate.correctOptionId, original.correctOptionId);
    assert.deepEqual(
      candidate.options.map((o) => o.id),
      original.options.map((o) => o.id),
    );
    assert.equal(candidate.conceptGroup, receipt.factKey);
    assert.notEqual(candidate.question, original.question);
    assert.notEqual(candidate.conceptGroup, retained.conceptGroup);
    assert.equal(candidate.sources[0]!.locator, receipt.locator);
    assert.equal(
      contentFingerprint(candidate),
      receipt.contentSha256,
      receipt.id,
    );
    assert.equal(receipt.candidateOnly, true);
    assert.equal(candidate.reviewStatus, "reviewed");
  }
});

test("source comparison receipts match staged facts and locators without claiming expert approval", async () => {
  const staged = await readStagedQuestions();
  const directory = resolve("docs/content-3000-20261125");
  const receipts = (
    await Promise.all(
      (await readdir(directory))
        .filter((name) => /^new-question-receipts-\d+\.json$/.test(name))
        .map(
          async (name) =>
            JSON.parse(await readFile(resolve(directory, name), "utf8")) as {
              questions: {
                id: string;
                factKey: string;
                locator: string;
                sourceCompared: boolean;
                bankWideSemanticAcceptance: string;
                contentSha256: string;
              }[];
            },
        ),
    )
  ).flatMap((receipt) => receipt.questions);
  assert.equal(receipts.length, staged.length);
  assert.equal(new Set(receipts.map((r) => r.id)).size, receipts.length);
  for (const q of staged) {
    const receipt = receipts.find((r) => r.id === q.id);
    assert.ok(receipt, q.id);
    assert.equal(receipt.factKey, q.conceptGroup, q.id);
    assert.equal(receipt.locator, q.sources[0]!.locator, q.id);
    assert.equal(receipt.sourceCompared, true, q.id);
    assert.equal(contentFingerprint(q), receipt.contentSha256, q.id);
    assert.equal(receipt.bankWideSemanticAcceptance, "pending", q.id);
  }
});
