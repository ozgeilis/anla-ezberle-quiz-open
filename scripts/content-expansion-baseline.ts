import { createHash } from "node:crypto";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { questions, categories, BANK_VERSION } from "../src/content/questions";
import type { Question } from "../src/content/questions/model";
import {
  playCategories,
  categoryPool,
} from "../src/domain/game/play-categories";
import { qualityWarnings } from "./question-quality";

export const newQuestionQuota = 375;
export const expansionCategoryIds = [
  "quran",
  "prophets",
  "history",
  "general",
] as const;
const levels = ["easy", "medium", "hard"] as const;
// Provisional targets; recompute if the source/editorial review reclassifies old items.
export const finalDifficultyTargets = {
  quran: { easy: 275, medium: 275, hard: 275 },
  prophets: { easy: 201, medium: 202, hard: 202 },
  history: { easy: 259, medium: 258, hard: 259 },
  general: { easy: 265, medium: 265, hard: 264 },
} as const;
const normal = (s: string) =>
  s
    .normalize("NFKC")
    .toLocaleLowerCase("tr-TR")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();

export function expansionCounts(items: readonly Question[]) {
  return expansionCategoryIds.map((id) => ({
    id,
    title: categories.find((c) => c.id === id)!.title,
    existing: items.filter((q) => q.categoryId === id).length,
    newTarget: newQuestionQuota,
    projectedTotal:
      items.filter((q) => q.categoryId === id).length + newQuestionQuota,
    provisionalFinalDifficulty: finalDifficultyTargets[id],
    provisionalNewDifficulty: Object.fromEntries(
      levels.map((level) => [
        level,
        finalDifficultyTargets[id][level] -
          items.filter((q) => q.categoryId === id && q.difficulty === level)
            .length,
      ]),
    ),
    existingDifficulty: Object.fromEntries(
      levels.map((level) => [
        level,
        items.filter((q) => q.categoryId === id && q.difficulty === level)
          .length,
      ]),
    ),
  }));
}

export function structuralIssues(q: Question): string[] {
  const issues: string[] = [];
  if (!q.id.trim() || !q.question.trim() || !q.explanation.trim())
    issues.push("missing-text");
  if (!expansionCategoryIds.some((id) => id === q.categoryId))
    issues.push("unknown-category");
  if (!levels.some((level) => level === q.difficulty))
    issues.push("unknown-difficulty");
  if (
    q.options.length !== 4 ||
    new Set(q.options.map((o) => o.id)).size !== 4 ||
    new Set(q.options.map((o) => normal(o.text))).size !== 4 ||
    q.options.some((o) => !o.text.trim()) ||
    q.options.filter((o) => o.id === q.correctOptionId).length !== 1
  )
    issues.push("invalid-options");
  if (!q.sources.length) issues.push("no-source-metadata");
  return issues;
}

// Staged content is deliberately separate from the published runtime bank.
export async function readStagedQuestions(): Promise<Question[]> {
  const directory = resolve("src/content/questions/expansion-v74");
  const files = (await readdir(directory))
    .filter((name) => name.endsWith(".json"))
    .sort();
  return (
    await Promise.all(
      files.map(async (name) => {
        const value: unknown = JSON.parse(
          await readFile(resolve(directory, name), "utf8"),
        );
        if (!Array.isArray(value)) throw new Error(`Not an array: ${name}`);
        return value as Question[];
      }),
    )
  ).flat();
}

// Historical supported/approved flags never substitute for a fresh source check.
export async function writeBaseline() {
  const output = resolve("docs/content-3000-20261125");
  const rechecks = JSON.parse(
    await readFile(resolve(output, "source-rechecks.json"), "utf8"),
  ) as {
    date: string;
    checks: {
      id: string;
      explanation: string;
      answer: string;
      singleAnswer: string;
      difficulty?: string;
    }[];
  };
  const receiptFiles = (await readdir(output))
    .filter((name) => /^source-rechecks-batch\d+\.json$/.test(name))
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
  for (const receiptFile of receiptFiles) {
    const batch2 = JSON.parse(
      await readFile(resolve(output, receiptFile), "utf8"),
    ) as {
      date: string;
      groups: {
        ids: string[];
        url: string;
        locator: string;
        locators?: Record<string, string>;
        partialIds: string[];
        scopeReviewIds?: string[];
        answerReviewIds?: string[];
        note: string;
      }[];
    };
    rechecks.checks.push(
      ...batch2.groups.flatMap((group) =>
        group.ids.map((id) => ({
          id,
          url: group.url,
          locator: group.locators?.[id] ?? group.locator,
          note: group.note,
          checkedAt: batch2.date,
          answer: group.answerReviewIds?.includes(id)
            ? "needs-option-precision"
            : "supported",
          singleAnswer: group.scopeReviewIds?.includes(id)
            ? "needs-stem-scope"
            : "supported",
          explanation: group.partialIds.includes(id)
            ? "partially-checked"
            : "supported",
        })),
      ),
    );
  }
  if (
    new Set(rechecks.checks.map((check) => check.id)).size !==
    rechecks.checks.length
  ) {
    throw new Error("Duplicate question source receipt");
  }
  const existingIds = new Set(questions.map((q) => q.id));
  if (rechecks.checks.some((check) => !existingIds.has(check.id))) {
    throw new Error("Source receipt references a nonexistent question");
  }
  const followups = JSON.parse(
    await readFile(resolve(output, "source-followups.json"), "utf8"),
  ) as {
    checks: {
      id: string;
      explanation: string;
      urls: string[];
      locator: string;
    }[];
  };
  const followed = new Set<string>();
  for (const followup of followups.checks) {
    const original = rechecks.checks.find((check) => check.id === followup.id);
    if (!original || followed.has(followup.id)) {
      throw new Error(`Invalid supplementary source receipt: ${followup.id}`);
    }
    followed.add(followup.id);
    Object.assign(original, {
      explanation: followup.explanation,
      supplementarySourceReview: followup,
    });
  }
  const snapshot = JSON.stringify(questions);
  const reviewed = new Map(rechecks.checks.map((check) => [check.id, check]));
  const overlaps = JSON.parse(
    await readFile(resolve(output, "confirmed-fact-overlaps.json"), "utf8"),
  ) as {
    groups: { fact: string; ids: string[] }[];
  };
  const overlappingFactById = new Map(
    overlaps.groups.flatMap((group) =>
      group.ids.map((id) => [id, group.fact] as const),
    ),
  );
  const ledger = questions.map((q) => ({
    id: q.id,
    version: q.version,
    categoryId: q.categoryId,
    difficulty: q.difficulty,
    questionSha256: createHash("sha256")
      .update(JSON.stringify(q))
      .digest("hex"),
    structure: structuralIssues(q),
    qualitySignals: qualityWarnings(q),
    historicalReviewStatus: q.reviewStatus,
    recordedSources: q.sources.map((s) => ({
      url: s.url,
      locator: s.locator,
      historicalStatus: s.checkStatus,
      historicalCheckedAt: s.checkedAt ?? null,
    })),
    currentSourceReview: reviewed.get(q.id) ?? {
      status: "pending",
      reason: "No source passage rechecked in this work yet",
    },
    semanticDuplicateReview: overlappingFactById.has(q.id)
      ? { status: "same-tested-fact", group: overlappingFactById.get(q.id) }
      : { status: "pending" },
    difficultyCalibration: reviewed.get(q.id)?.difficulty
      ? "sample-reviewed"
      : "pending",
    religiousExpertReview: "not-claimed",
  }));
  const newCandidates = await readStagedQuestions();
  const replacements = JSON.parse(
    await readFile(
      resolve(output, "existing-replacement-receipts.json"),
      "utf8",
    ),
  ) as { replacements: { id: string }[] };
  const summary = {
    baseCommit: "3a74086",
    bankVersion: BANK_VERSION,
    questionCount: questions.length,
    uniqueIds: new Set(questions.map((q) => q.id)).size,
    bankSha256: createHash("sha256").update(snapshot).digest("hex"),
    distributionDecision:
      "2026-11-25: user chose 375 new questions per existing schema category; preserve old category assignments",
    categories: expansionCounts(questions),
    screenCategories: playCategories.map((c) => ({
      id: c.id,
      title: c.title,
      total: categoryPool(questions, c.id).length,
    })),
    newQuestionsAdded: 0,
    newQuestionsStaged: newCandidates.length,
    stagedByCategory: Object.fromEntries(
      categories.map((c) => [
        c.id,
        newCandidates.filter((q) => q.categoryId === c.id).length,
      ]),
    ),
    stagedStructuralIssueCount: newCandidates.reduce(
      (count, q) => count + structuralIssues(q).length,
      0,
    ),
    newQuestionsRemaining: 1500 - newCandidates.length,
    existingReplacementsStaged: replacements.replacements.length,
    sourceRechecks: rechecks.checks.length,
    answerSupportIssues: rechecks.checks.filter((c) => c.answer !== "supported")
      .length,
    stemScopeIssues: rechecks.checks.filter(
      (c) => c.singleAnswer !== "supported",
    ).length,
    fullExplanationRechecks: rechecks.checks.filter(
      (c) => c.explanation === "supported",
    ).length,
    sourceChecksPending: questions.length - rechecks.checks.length,
    confirmedOverlappingFactGroups: overlaps.groups.length,
    minimumRedundantEntries: overlaps.groups.reduce(
      (n, group) => n + group.ids.length - 1,
      0,
    ),
    flaggedQuestions: ledger.filter((q) => q.qualitySignals.length).length,
    structuralIssueCount: ledger.reduce((n, q) => n + q.structure.length, 0),
    runtimeBankModified: false,
    readyForIntegration: false,
    limitations: [
      "A single correct option ID proves schema integrity, not theological uniqueness of the answer.",
      "Quality warnings are review candidates, not confirmed errors.",
      "New content is staged only; the runtime bank, topic mappings, saved progress and online export remain unchanged.",
      "Six playable screen categories are derived from a separate per-question topic map; new IDs need reviewed mappings before integration.",
      "Token overlap audit is not exhaustive semantic duplicate detection.",
    ],
  };
  await writeFile(
    resolve(output, "question-ledger.json"),
    JSON.stringify(ledger, null, 2) + "\n",
  );
  await writeFile(
    resolve(output, "progress.json"),
    JSON.stringify(summary, null, 2) + "\n",
  );
  return summary;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  void writeBaseline().then(
    (summary) => console.log(JSON.stringify(summary, null, 2)),
    (error) => {
      console.error(error);
      process.exitCode = 1;
    },
  );
}
