import type { Question } from "./model";

/**
 * One NEW source-checked, unpublished Ramadan seasonal draft.
 * This module must NOT be added to bankV31, playableQuestions, the theme
 * manifests, the online duel, or the production content registry.
 *
 * The direct TDV source was checked for the sole claim (Shawwal follows Ramadan);
 * religious-specialist signoff and all publication gates remain outstanding.
 */
export const ramadanSeasonalDraftsV2: readonly Question[] = [
  {
    id: "ramadan-draft-shawwal-001",
    version: 1,
    categoryId: "general",
    difficulty: "easy",
    question: "Hicrî takvimde Ramazan ayından hemen sonra hangi ay gelir?",
    options: [
      { id: "o1", text: "Şâban" },
      { id: "o2", text: "Şevval" },
      { id: "o3", text: "Zilkade" },
      { id: "o4", text: "Muharrem" },
    ],
    correctOptionId: "o2",
    explanation:
      "Ramazan hicrî takvimin dokuzuncu, Şevval ise onuncu ayıdır. Şevval doğrudan Ramazan'dan sonra, Zilkade'den önce gelir. Bu sıra kamerî takvimde ayların yerini öğrenmemize yardımcı olur.",
    sources: [
      {
        title: "ŞEVVAL — TDV İslâm Ansiklopedisi",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        url: "https://islamansiklopedisi.org.tr/sevval",
        locator: "Şevval maddesi, tanım ve kamerî ayların sırası",
        supports:
          "Şevval hicrî yılın onuncu ayıdır, Ramazan'dan sonra ve Zilkade'den önce gelir.",
        checkStatus: "supported",
        checkedAt: "2026-10-21",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "2026-10-21: TDV ŞEVVAL madde tanımı karşılaştırıldı. Bu tek kaynak kontrolü uzman/editör onayı değildir; alternatiflerin pedagojik incelemesi ve gerçek iPhone kabulü bekleniyor.",
    updatedAt: "2026-10-21",
    conceptGroup: "ramadan-calendar-shawwal-after",
  },
];
