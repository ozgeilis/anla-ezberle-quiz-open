import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { questions } from "../src/content/questions";
import type { Question } from "../src/content/questions/model";
import { selectionConceptKeys } from "../src/domain/game/engine";
import { similarityCandidates, reviewQueue } from "./audit-question-similarity";

const normalize = (value: string) => value.normalize("NFKC").toLocaleLowerCase("tr-TR")
  .replace(/[^\p{L}\p{N}]+/gu, " ").trim();

export interface ContentIssue { id: string; issue: string }
export interface ContentAudit {
  count: number;
  categories: Record<string, number>;
  difficulties: Record<string, number>;
  sourceCheckStatuses: Record<string, number>;
  sourceDomains: Record<string, number>;
  noIndependentReviewTimestamp: number;
  repeatedTemplates: Record<string, number>;
  similarityCandidates: number;
  reviewSignalCounts: Record<string, number>;
  structuralIssues: ContentIssue[];
  limitations: string[];
}
const increase = (map: Record<string, number>, key: string) => {
  map[key] = (map[key] ?? 0) + 1;
};
export function auditPublishedQuestions(items: readonly Question[]): ContentAudit {
  const categories: Record<string, number> = {};
  const difficulties: Record<string, number> = {};
  const sourceCheckStatuses: Record<string, number> = {};
  const sourceDomains: Record<string, number> = {};
  const repeatedTemplates: Record<string, number> = {};
  const structuralIssues: ContentIssue[] = [];
  const seenIds = new Set<string>();
  const seenPrompts = new Map<string, string>();
  let noIndependentReviewTimestamp = 0;
  for (const q of items) {
    const flag = (issue: string) => structuralIssues.push({id: q.id, issue});
    increase(categories, q.categoryId);
    increase(difficulties, q.difficulty);
    if (seenIds.has(q.id)) flag("duplicate-id");
    seenIds.add(q.id);
    const prompt = normalize(q.question);
    if (prompt.length < 8) flag("short-question");
    if (seenPrompts.has(prompt)) flag("duplicate-question-text");
    seenPrompts.set(prompt, q.id);
    if (q.reviewStatus !== "approved") flag("not-approved");
    if (!q.reviewedAt) noIndependentReviewTimestamp++;
    if (normalize(q.explanation).length < 15) flag("short-explanation");
    if (q.options.length !== 4 ||
      new Set(q.options.map(o => o.id)).size !== 4 ||
      new Set(q.options.map(o => normalize(o.text))).size !== 4 ||
      !q.options.some(o => o.id === q.correctOptionId)) flag("invalid-answer-options");
    if (!q.sources.length) flag("missing-source");
    for (const source of q.sources) {
      increase(sourceCheckStatuses, source.checkStatus);
      if (!source.title.trim() || !source.publisher.trim() ||
        !source.locator.trim() || !source.supports.trim()) flag("incomplete-source-metadata");
      try {
        const url = new URL(source.url);
        if (url.protocol !== "https:") flag("insecure-source-url");
        increase(sourceDomains, url.hostname);
      } catch {
        flag("invalid-source-url");
      }
    }
    for (const key of selectionConceptKeys(q).filter(key => key.startsWith("template:"))) {
      increase(repeatedTemplates, key);
    }
  }
  const candidates = reviewQueue(similarityCandidates(items));
  const reviewSignalCounts: Record<string, number> = {};
  for (const p of candidates) increase(reviewSignalCounts, p.signal);
  return {
    count: items.length,
    categories, difficulties, sourceCheckStatuses, sourceDomains,
    noIndependentReviewTimestamp, repeatedTemplates,
    similarityCandidates: candidates.length, reviewSignalCounts,
    structuralIssues,
    limitations: [
      "Source links and recorded statuses are metadata; this scan does not open or fact-check source passages.",
      "A missing reviewedAt timestamp is not proof of no human review, and approved is not independent expert certification.",
      "Text similarity is a review signal only; similar questions may test distinct facts.",
      "Device testing, online Supabase rollout, platform signing, privacy review, and store submission are outside this scan.",
    ],
  };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const report = auditPublishedQuestions(questions);
  process.stdout.write(JSON.stringify(report, null, 2) + "\n");
  if (report.structuralIssues.length) process.exitCode = 1;
}
