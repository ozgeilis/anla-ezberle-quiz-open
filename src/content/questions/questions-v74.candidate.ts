import { questionsV73 } from "./questions-v73";
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

// Not exported by index.ts or registry.ts: incomplete expansion cannot enter games.
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
              checkedAt: "2026-11-25",
            },
          ]
        : q.sources,
      reviewStatus: "reviewed" as const,
      reviewedAt: undefined,
      updatedAt: "2026-11-25",
      reviewNotes: `Kaynak/editoryal karşılaştırma: ${patch.reason} Bağımsız uzman onayı veya yayın kabulü değildir.`,
    };
  },
);
