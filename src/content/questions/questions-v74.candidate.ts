import { questionsV73 } from "./questions-v73";
import { stagedQuestionsV74 } from "./expansion-v74";
import { existingQuestionPatches } from "./existing-patches-v74";
import type { Difficulty, Question } from "./model";

type EditorialPatch = {
  id: string;
  reason: string;
  question?: string;
  explanation?: string;
  correctOptionText?: string;
  difficulty?: Difficulty;
  source?: string;
  locator?: string;
  conceptGroup?: string;
  options?: Question["options"];
};

const patches = new Map<string, EditorialPatch>(
  existingQuestionPatches.map((patch) => [patch.id, patch]),
);

// Editorial inputs are separate from the reproducible static runtime snapshot.
// Historical v73 remains available with its original wording, keys and difficulty.
export const questionsV74Candidate: readonly Question[] = questionsV73.map(
  (q) => {
    const patch = patches.get(q.id);
    if (!patch) return q;
    const explanation = patch.explanation ?? q.explanation;
    return {
      ...q,
      version: q.version + 1,
      question: patch.question ?? q.question,
      explanation,
      difficulty: patch.difficulty ?? q.difficulty,
      conceptGroup: patch.conceptGroup ?? q.conceptGroup,
      options:
        patch.options ??
        (q.options.map((option) =>
          option.id === q.correctOptionId && patch.correctOptionText
            ? { ...option, text: patch.correctOptionText }
            : option,
        ) as unknown as Question["options"]),
      sources: patch.source
        ? [
            {
              title: patch.source.includes("diyanet.gov.tr")
                ? "Diyanet — Kur’an Yolu Meali"
                : "TDV İslâm Ansiklopedisi",
              publisher: patch.source.includes("diyanet.gov.tr")
                ? "Diyanet İşleri Başkanlığı"
                : "TDV İslâm Araştırmaları Merkezi",
              url: patch.source,
              locator: patch.locator!,
              supports: explanation,
              checkStatus: "supported" as const,
              checkedAt: "2026-11-26",
            },
          ]
        : q.sources,
      reviewStatus: "reviewed" as const,
      reviewedAt: undefined,
      updatedAt: "2026-11-26",
      reviewNotes: `Kaynak/editoryal karşılaştırma: ${patch.reason} Bağımsız uzman onayı veya yayın kabulü değildir.`,
    };
  },
);

// Complete candidate for 3,000-record integrity and category acceptance tests.
// Production selection remains on its frozen approved bank during this audit.
export const expandedQuestionsV74Candidate: readonly Question[] = [
  ...questionsV74Candidate,
  ...stagedQuestionsV74,
];
