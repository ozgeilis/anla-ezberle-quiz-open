/**
 * Editorial candidate shortlist for the *future* Ramazan / Kolay collection.
 * Does NOT modify the v31 bank, the legacy manifest, or the play route.
 * This is not an approval or a proof of semantic independence.
 *
 * Two Ramadan-relevant Quran questions are sourced from the already-existing
 * approved bank but are NOT included in the 24-ID historical theme manifest.
 * Source notes are audit suggestions only; historical question objects remain
 * immutable.
 */
export const ramadanEasyShortlistV1 = {
  id: "ramazan-kolay-editorial-v1",
  publicationStatus: "draft",
  level: "easy",
  intendedRoundSize: 10,
  questionIds: [
    "general-002", // Ramadan and prescribed fasting
    "general-006", // sahur
    "general-007", // iftar (shares historical concept key with sahur)
    "general-012", // mahya
    "e150-general-001", // imsak start
    "v7-general-001", // teravih
    "v7-general-002", // fitre
    "v11-general-012", // hatim
    "v12-quran-002", // Quran and month of Ramadan
    "v7-quran-004", // Kadr surah and the night worth a thousand months
    "v11-quran-005", // night of Quranic revelation; wording requires nuance review
  ],
  editorialNotes: [
    "This is an 11-ID review pool for a 10-question round; sahur and iftar have the same existing concept key. No game entry point uses this pool.",
    "v12-quran-002 and v11-quran-005 both address revelation: month and night are different facts, but a human must judge whether placing both in one round is pedagogically repetitive.",
    "v11-quran-005 says 'indirilmeye başlanmıştır', whereas Kadr 97/1 literally says 'indirdik'. Review the historical/tafsir nuance before any publication.",
    "The eligible count alone never permits publishing: human review, canonical citations, and real-device acceptance remain required.",
  ],
} as const;

/**
 * Suggested direct sources verified during editorial research.
 * They are NOT applied automatically to historical game results.
 * Before a future published release, new question versions must be reviewed.
 */
export const ramadanCitationSuggestionsV1: Readonly<Record<string, string>> = {
  "e150-general-006": "https://kuran.diyanet.gov.tr/tefsir/Bakara-suresi/192/185-ayet-tefsiri",
  "v11-general-012": "https://islamansiklopedisi.org.tr/hatim--kuran",
  "v12-general-008": "https://islamansiklopedisi.org.tr/iftar",
  "v12-general-009": "https://islamansiklopedisi.org.tr/sahur",
  "v12-quran-001": "https://kuran.diyanet.gov.tr/mushaf/tefsir-2/bakara-suresi-2/ayet-186/diyanet-isleri-baskanligi-meali-1",
  "v12-quran-002": "https://kuran.diyanet.gov.tr/tefsir/Bakara-suresi/192/185-ayet-tefsiri",
  "v11-quran-005": "https://kuran.diyanet.gov.tr/tefsir/Kadir-suresi/6126/1-3-ayet-tefsiri",
};
