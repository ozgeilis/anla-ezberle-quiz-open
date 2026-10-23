/**
 * Read-only audit of themed candidate manifests. This is NOT a publication
 * pathway, a network source validation, or an assertion of scholarly signoff.
 *
 * Run: pnpm exec tsx scripts/audit-special-collections.ts
 */
import { mkdir, writeFile } from "node:fs/promises";
import { questions } from "../src/content/questions";
import type { Question } from "../src/content/questions/model";
import {
  learningThemeSetsV1,
} from "../src/content/questions/learning-topics-v1";
import {
  assessDifficultyRound,
  selectionConceptKeys,
} from "../src/domain/game/engine";

const byId = new Map(questions.map((question) => [question.id, question]));
const levels = ["easy", "medium", "hard"] as const;

type Level = (typeof levels)[number];
function sourceMetadataIsComplete(question: Question): boolean {
  return (
    question.sources.length > 0 &&
    question.sources.every(
      (source) =>
        source.checkStatus === "supported" &&
        source.url.startsWith("https://") &&
        source.publisher.trim().length > 0 &&
        source.locator.trim().length > 0 &&
        source.supports.trim().length > 0,
    )
  );
}
function isStructurallyEligible(question: Question): boolean {
  return (
    question.reviewStatus === "approved" &&
    sourceMetadataIsComplete(question) &&
    question.options.length === 4 &&
    new Set(question.options.map((option) => option.id)).size === 4 &&
    new Set(question.options.map((option) => option.text.trim())).size === 4 &&
    question.options.some((option) => option.id === question.correctOptionId) &&
    question.explanation.trim().length >= 35
  );
}
function conflictingKeys(eligible: readonly Question[]) {
  const keyedIds = new Map<string, string[]>();
  for (const question of eligible) {
    for (const key of selectionConceptKeys(question)) {
      const ids = keyedIds.get(key) ?? [];
      ids.push(question.id);
      keyedIds.set(key, ids);
    }
  }
  return [...keyedIds.entries()]
    .filter(([, ids]) => ids.length > 1)
    .map(([key, ids]) => ({ key, ids }))
    .sort((a, b) => b.ids.length - a.ids.length || a.key.localeCompare(b.key, "tr"));
}

/** Potentially repeated learning facts; human review decides whether to keep both. */
const editorialOverlapCandidates: Readonly<
  Record<string, readonly { label: string; ids: readonly string[] }[]>
> = {
  ramazan: [
    { label: "Sahur tanımı ve vakti", ids: ["general-006", "e150-general-005", "v12-general-009"] },
    { label: "İftar tanımı", ids: ["general-007", "v12-general-008"] },
    { label: "Mahya tanımı", ids: ["general-012", "v13-general-003"] },
    { label: "Fitre tanımı", ids: ["v7-general-002", "v13-general-002"] },
    { label: "İtikâf tanımı", ids: ["v7-general-003", "v13-general-005"] },
  ],
};
function overlappingAnswerReview(eligible: readonly Question[]) {
  const map = new Map<string, string[]>();
  for (const q of eligible) {
    const answer = q.options.find((option) => option.id === q.correctOptionId)?.text;
    if (!answer) continue;
    const norm = answer.normalize("NFKC").toLocaleLowerCase("tr-TR").replace(/[\\s\\p{P}\\p{S}]+/gu, " ").trim();
    const ids = map.get(norm) ?? [];
    ids.push(q.id);
    map.set(norm, ids);
  }
  return [...map.entries()]
    .filter(([, ids]) => ids.length > 1)
    .map(([answer, ids]) => ({ answer, ids }));
}

export function buildSpecialCollectionsAudit() {
  return {
    bankVersion: 31,
    bankQuestions: questions.length,
    scope: "Metadata and local independent-round feasibility; not external scholarly verification",
    publicationAllowedByThisAudit: false,
    collections: learningThemeSetsV1.map((manifest) => {
      const existing = manifest.existingQuestionIds.map((id) => ({
        id,
        question: byId.get(id),
      }));
      const eligible = existing
        .map((item) => item.question)
        .filter((question): question is Question =>
          question !== undefined && isStructurallyEligible(question),
        );
      const conflictGroups = conflictingKeys(eligible);
      const difficulty = Object.fromEntries(
        levels.map((level) => [level, assessDifficultyRound(eligible, level)]),
      ) as Record<Level, ReturnType<typeof assessDifficultyRound>>;
      return {
        id: manifest.id,
        title: manifest.title,
        editorialStatus: manifest.publicationStatus,
        candidateCount: manifest.existingQuestionIds.length,
        draftCandidateCount: manifest.draftQuestionIds.length,
        structurallyEligibleCount: eligible.length,
        unknownIds: existing.filter((item) => !item.question).map((item) => item.id),
        missingSourceMetadata: existing
          .filter((item) => item.question && !sourceMetadataIsComplete(item.question))
          .map((item) => item.id),
        notApprovedIds: existing
          .filter((item) => item.question && item.question.reviewStatus !== "approved")
          .map((item) => item.id),
        needsStructuralCorrection: existing
          .filter((item) => item.question && !isStructurallyEligible(item.question))
          .map((item) => item.id),
        noRecordedHumanReview: existing
          .filter((item) => item.question && !item.question.reviewedAt)
          .map((item) => item.id),
        difficulty,
        conceptConflicts: conflictGroups,
        // Shared correct answers are review leads, not duplicate verdicts.
        sharedAnswerReview: overlappingAnswerReview(eligible),
        editorialOverlapReview: (editorialOverlapCandidates[manifest.id] ?? [])
          .filter((candidate) => candidate.ids.every((id) => existing.some((q) => q.id === id))),
        questionChecklist: existing.map(({ id, question }) => ({
          id,
          found: Boolean(question),
          category: question?.categoryId ?? null,
          difficulty: question?.difficulty ?? null,
          conceptGroup: question?.conceptGroup ?? null,
          question: question?.question ?? null,
          answer: question?.options.find((option) => option.id === question.correctOptionId)?.text ?? null,
          choices: question?.options.map((option) => ({ id: option.id, text: option.text, isCorrect: option.id === question.correctOptionId })) ?? [],
          explanation: question?.explanation ?? null,
          reviewStatus: question?.reviewStatus ?? null,
          humanReviewDate: question?.reviewedAt ?? null,
          metadataEligible: question ? isStructurallyEligible(question) : false,
          sources: question?.sources.map((source) => ({
            publisher: source.publisher,
            url: source.url,
            locator: source.locator,
            supports: source.supports,
            checkStatus: source.checkStatus,
            checkedAt: source.checkedAt ?? null,
          })) ?? [],
        })),
        // Even a technically possible 10-question round cannot bypass
        // human editorial source review, device acceptance or draft status.
        readyToPublish: false,
        pendingChecks: [
          "Human verification of EACH linked source against the factual claim",
          "Independent editorial review of distractors, explanation, and doctrinal nuance",
          "Check semantic duplicates beyond the automatic concept key heuristics",
          "Real-iPhone flow and accessibility acceptance",
          "Separate publication manifest, content version, and tests",
        ],
      };
    }),
  };
}

async function main() {
const report = buildSpecialCollectionsAudit();
await mkdir("artifacts/special-collections-audit", { recursive: true });
await writeFile(
  "artifacts/special-collections-audit/readiness.json",
  JSON.stringify(report, null, 2) + "\n",
  "utf8",
);
for (const item of report.collections) {
  console.log(
    `${item.title}: ${item.candidateCount} manifest IDs / ${item.structurallyEligibleCount} structurally eligible; ` +
      levels.map((level) => `${level}=${item.difficulty[level].eligibleCount} (${item.difficulty[level].canStart ? "10-independent-possible" : "blocked"})`).join(", ") +
      `; conflicts=${item.conceptConflicts.length}; published=NO`,
  );
  if (item.needsStructuralCorrection.length)
    console.log("  Needs structural correction:", item.needsStructuralCorrection.join(", "));
  if (item.conceptConflicts.length)
    console.log("  Conflicting concept groups:", item.conceptConflicts.map((c) => `${c.key} [${c.ids.join(", ")}]`).join("; "));
  if (item.editorialOverlapReview.length)
    console.log("  Human semantic overlap review:", item.editorialOverlapReview.map((c) => `${c.label} [${c.ids.join(", ")}]`).join("; "));
}
console.log("Full editorial checklist: artifacts/special-collections-audit/readiness.json");

}
void main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
