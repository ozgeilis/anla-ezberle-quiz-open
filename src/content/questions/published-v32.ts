import type { Question } from "./model";
import { bankV31 } from "./archive/bank-v31";
import { religiousSourceCorrectionsV1 } from "./religious-source-corrections-v1";

/** Owner-authorized, source-checked corrections. Historical v31 stays immutable. */
export const publishedCorrectionsV32: readonly Question[] =
  religiousSourceCorrectionsV1.map((proposal) => {
    const original = bankV31.find((q) => q.id === proposal.questionId);
    if (!original || original.version !== proposal.baseQuestionVersion)
      throw new Error(`Unexpected correction base: ${proposal.questionId}`);
    const question =
      "question" in proposal ? proposal.question : original.question;
    const explanation =
      "explanation" in proposal ? proposal.explanation : original.explanation;
    return {
      ...original,
      question,
      explanation,
      version: proposal.proposedQuestionVersion,
      sources: proposal.sourceRecommendations.map((source) => ({
        title: source.url.includes("islamansiklopedisi.org.tr")
          ? "TDV İslâm Ansiklopedisi"
          : "Diyanet Kur'an Platformu — ayet hedefi",
        publisher: source.url.includes("islamansiklopedisi.org.tr")
          ? "TDV İslâm Araştırmaları Merkezi"
          : "Diyanet İşleri Başkanlığı",
        url: source.url,
        locator: source.locator,
        supports: explanation,
        checkStatus: "supported" as const,
        checkedAt: "2026-10-21",
      })),
      reviewStatus: "approved" as const,
      reviewNotes:
        "21.10.2026: Issue #58 kapsamında kaynak metni, cevap ve dört seçenek karşılaştırıldı. Ürün sahibinin doğrudan yayın talimatıyla sürümlü düzeltme. İnsan dinî uzman onayı değildir; eski oyunlar v31 metnini kullanır.",
      updatedAt: "2026-10-21",
    };
  });
