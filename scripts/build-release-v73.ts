import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { questionsV73Candidate } from "../src/content/questions/questions-v73.candidate";
import approval from "../src/content/questions/releases/v73.json";
import type { Question } from "../src/content/questions/model";
import { questionSnapshot } from "./question-snapshot";

const sha = (value: string | Buffer) =>
  createHash("sha256").update(value).digest("hex");

/** Exact owner-authorized snapshot; source comparison is not expert approval. */
export function releasedQuestionsV73(): readonly Question[] {
  if (
    approval.bankVersion !== 73 ||
    approval.approvalType !== "product-owner-publication" ||
    approval.independentExpertApproval !== false ||
    questionsV73Candidate.length !== approval.questionCount ||
    new Set(questionsV73Candidate.map((q) => q.id)).size !== 1500 ||
    sha(questionSnapshot(questionsV73Candidate)) !== approval.candidateSha256 ||
    sha(
      readFileSync("src/content/questions/editorial-v73/round2-decisions.json"),
    ) !== approval.decisionsSha256
  )
    throw Error("v73 release differs from the exact owner-approved snapshot");
  return questionsV73Candidate.map((q) => {
    if (q.reviewStatus === "approved") return q;
    if (
      q.sources.length === 0 ||
      q.sources.some((s) => s.checkStatus !== "supported")
    )
      throw Error(`v73 source evidence missing: ${q.id}`);
    return {
      ...q,
      reviewStatus: "approved",
      reviewNotes:
        "30.10.2026: Ürün sahibinin v73’ü aktif soru bankası yapma talimatıyla kullanım için onaylandı. Kök, dört şık, anahtar ve açıklama kaynakla karşılaştırıldı; bağımsız ilahiyat uzmanı onayı değildir.",
      // reviewedAt remains unset: no independent human review is fabricated.
    };
  });
}

export function canonicalV73Source(): string {
  return `// Generated from the exact product-owner-authorized v73 editorial snapshot.\n// v72 remains frozen for historical games. No runtime editorial/tooling imports.\nimport type { Question } from "./model";\n\nexport const questionsV73: readonly Question[] = ${questionSnapshot(releasedQuestionsV73())};\n`;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const path = "src/content/questions/questions-v73.ts";
  const source = canonicalV73Source();
  if (process.argv.includes("--check")) {
    if (readFileSync(path, "utf8") !== source)
      throw Error("Stale v73 release snapshot");
  } else writeFileSync(path, source);
  console.log(
    "v73: exact owner-authorized 1500-question release snapshot verified",
  );
}
