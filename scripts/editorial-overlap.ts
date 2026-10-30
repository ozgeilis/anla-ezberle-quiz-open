import { createHash } from "node:crypto";
import type { Question } from "../src/content/questions/model";
import { reviewQueue, similarityCandidates } from "./audit-question-similarity";

export interface OverlapDecision {
  a: string;
  b: string;
  snapshotSha256: string;
  verdict: "repeated-fact" | "distinct-context";
  reason: string;
}
export const overlapSnapshot = (a: Question, b: Question) =>
  createHash("sha256")
    .update(
      JSON.stringify(
        [a, b].map((q) => ({
          id: q.id,
          question: q.question,
          options: q.options,
          correctOptionId: q.correctOptionId,
        })),
      ),
    )
    .digest("hex");

/** A lexical pair is a review suggestion. Only an explicit decision is reviewed. */
export function editorialOverlap(
  bank: readonly Question[],
  decisions: readonly OverlapDecision[],
) {
  const byId = new Map(bank.map((q) => [q.id, q]));
  const byPair = new Map(decisions.map((d) => [`${d.a}|${d.b}`, d]));
  if (byPair.size !== decisions.length)
    throw Error("Repeated overlap decision");
  const pairs = reviewQueue(similarityCandidates(bank));
  const pairKeys = new Set(pairs.map((p) => `${p.a}|${p.b}`));
  for (const d of decisions) {
    const a = byId.get(d.a),
      b = byId.get(d.b);
    if (
      !a ||
      !b ||
      !pairKeys.has(`${d.a}|${d.b}`) ||
      d.snapshotSha256 !== overlapSnapshot(a, b) ||
      !d.reason ||
      !["repeated-fact", "distinct-context"].includes(d.verdict)
    )
      throw Error(`Overlap needs re-review: ${d.a}/${d.b}`);
  }
  return {
    method:
      "Turkish token overlap plus explicit semantic pair decisions; not exhaustive semantic proof",
    candidatePairs: pairs.length,
    individuallyReviewedPairs: decisions.length,
    pendingPairs: pairs.length - decisions.length,
    repeatedFactPairs: decisions.filter((d) => d.verdict === "repeated-fact")
      .length,
    independentApproval: false,
    records: pairs.map((p) => ({
      ...p,
      questions: [p.a, p.b].map((id) => {
        const q = byId.get(id)!;
        return {
          id,
          question: q.question,
          answer: q.options.find((o) => o.id === q.correctOptionId)!.text,
        };
      }),
      decision: byPair.get(`${p.a}|${p.b}`) ?? null,
    })),
  };
}
