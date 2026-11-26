import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { expandedQuestionsV74Candidate } from "../src/content/questions/questions-v74.candidate";
import { candidateTopicByQuestionIdV74 } from "../src/content/questions/learning-topics-v74.candidate";
import { questionSnapshot } from "./question-snapshot";
import manifest from "../docs/content-3000-20261125/integration-manifest.json";

const digest = (value: unknown) =>
  createHash("sha256").update(questionSnapshot(value)).digest("hex");

// Content assembly under the user's expansion instruction. This is neither
// independent expert approval nor authorization to merge or deploy a backend.
export function assembledQuestionsV74() {
  if (
    expandedQuestionsV74Candidate.length !== 3000 ||
    new Set(expandedQuestionsV74Candidate.map((q) => q.id)).size !== 3000 ||
    digest(expandedQuestionsV74Candidate) !== manifest.candidateSha256 ||
    digest(candidateTopicByQuestionIdV74) !== manifest.topicSha256 ||
    manifest.independentExpertApproval !== false
  )
    throw Error("v74 differs from the source-compared content manifest");
  const bank = expandedQuestionsV74Candidate.map((q) => {
    if (
      q.sources.some((s) => s.checkStatus !== "supported") ||
      !q.sources.length
    )
      throw Error(`Missing source support: ${q.id}`);
    return q.reviewStatus === "approved"
      ? q
      : {
          ...q,
          reviewStatus: "approved" as const,
          reviewNotes:
            "26.11.2026: Kullanıcının 1.500 mevcut soruyu denetleyip 1.500 kaynaklı soru ekleme talimatı kapsamında veri ve kaynak karşılaştırması tamamlandı. Bağımsız ilahiyat uzmanı veya insan editör incelemesi iddia edilmez. Main ve mağaza dağıtımı ayrı onay kapsamındadır.",
        };
  });
  if (digest(bank) !== manifest.snapshotSha256)
    throw Error("v74 assembled snapshot changed");
  return bank;
}

export const canonicalV74Source = () =>
  '// Source-compared 3000-question content snapshot; historical v1-v73 stay frozen.\n// No runtime editorial/tooling imports. Not an assertion of independent expert review.\nimport type { Question } from "./model";\n\nexport const questionsV74: readonly Question[] = ' +
  questionSnapshot(assembledQuestionsV74()) +
  ";\n";

if (process.argv.includes("--check")) {
  if (
    readFileSync("src/content/questions/questions-v74.ts", "utf8") !==
    canonicalV74Source()
  )
    throw Error("Stale v74 snapshot");
} else if (process.argv.includes("--write")) {
  writeFileSync("src/content/questions/questions-v74.ts", canonicalV74Source());
}
