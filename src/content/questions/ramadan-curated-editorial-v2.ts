/**
 * Curated 10-fact Ramadan / easy editorial pilot, not a production quiz.
 *
 * Earlier 11-ID v1 was only a feasibility set: it used both sahur and iftar
 * (same historical concept key), and both Quran-in-Ramadan and Quran-on-Qadr
 * night (subject overlap and tafsir-wording concern). This v2 proposal
 * deliberately picks ten different learning objectives and introduces one
 * unpublished, sourced seasonal draft. It remains locked.
 */
export const ramadanEasyCuratedV2 = {
  id: "ramazan-kolay-editorial-v2",
  status: "awaiting-specialist-and-device-review",
  level: "easy",
  published: false,
  questionIds: [
    "general-002", // Ramazan is the prescribed fasting month
    "general-006", // sahur meal
    "general-012", // mahya lights between minarets
    "e150-general-001", // imsak and fasting start
    "v7-general-001", // teravih after isha
    "v7-general-002", // fitre
    "v11-general-012", // hatim
    "v12-quran-002", // Bakara 2/185 and revelation in Ramadan
    "v7-quran-004", // Quran's Kadr surah and thousand months
    "ramadan-draft-shawwal-001", // separate unpublished candidate: Ramadan-to-Shawwal calendar transition
  ],
  learningObjectives: [
    "farz-oruc-ayi",
    "sahur-ogunu",
    "mahya-kulturu",
    "imsak-baslangici",
    "teravih-namazi",
    "fitre-yardimi",
    "hatim-kavrami",
    "bakara-185-ramazan-vahiy",
    "kadr-suresi-fazilet",
    "sevval-hicri-takvim",
  ],
  removedFromV1Review: [
    "general-007", // iftar: same selectionConceptKeys as sahur
    "v11-quran-005", // timing of revelation: interpretive nuance / thematic overlap
  ],
  reviewNotes: [
    "Two questions have the correct text Ramazan (fasting month and Bakara 2/185). These test different propositions; the owner/editor should decide whether a single-round repeated answer is desirable.",
    "The nine historical questions are not modified; one new question is reviewStatus=draft and MUST NOT be available in live play.",
    "A technical independent-ten selection is not a specialist fact check, pedagogical signoff, or device acceptance.",
  ],
} as const;
