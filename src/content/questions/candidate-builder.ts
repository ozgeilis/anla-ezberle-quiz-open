import type { CategoryId, Difficulty, Question } from "./model";

/**
 * Compact, original editorial candidate builder. No questions or explanations are
 * copied from reference works. Every question has exactly four options and a
 * stable question ID. Source checking is NOT scholarly approval.
 */
export type Candidate = readonly [
  prompt: string,
  correct: string,
  distractors: readonly [string, string, string],
  url: string,
  locator: string,
  explanation: string,
  conceptGroup: string,
  difficulty?: Difficulty,
  checkStatus?: "supported" | "unverified",
];

export function makeCandidates(
  categoryId: CategoryId,
  rows: readonly Candidate[],
): readonly Question[] {
  const tags: Record<CategoryId, string> = {
    quran: "quran",
    prophets: "prophets",
    history: "history",
    general: "general",
  };
  return rows.map((row, n): Question => {
    const [question, correct, distractors, url, locator, explanation, conceptGroup, difficulty, checkStatus] = row;
    const options: Question["options"] = [
      { id: "o1", text: distractors[0] },
      { id: "o2", text: correct },
      { id: "o3", text: distractors[1] },
      { id: "o4", text: distractors[2] },
    ];
    const isDiyanet = url.startsWith("https://kuran.diyanet.gov.tr/");
    return {
      id: `e150-${tags[categoryId]}-${String(n + 1).padStart(3, "0")}`,
      version: 1,
      categoryId,
      difficulty: difficulty ?? "medium",
      question,
      options,
      correctOptionId: "o2",
      explanation,
      sources: [{
        title: isDiyanet ? "Diyanet Kur'an Yolu" : "TDV İslâm Ansiklopedisi",
        publisher: isDiyanet ? "Diyanet İşleri Başkanlığı" : "TDV İslâm Araştırmaları Merkezi",
        url,
        locator,
        supports: explanation,
        checkStatus: checkStatus ?? "unverified",
        ...(checkStatus === "supported" ? { checkedAt: "2026-10-19" } : {}),
      }],
      reviewStatus: "draft",
      reviewNotes: "Kaynak gösterimi otomatik doğruluk veya dinî uzman onayı değildir. Yayımdan önce bağımsız editör ve uzman incelemesi gereklidir.",
      updatedAt: "2026-10-19",
      conceptGroup,
    };
  });
}
