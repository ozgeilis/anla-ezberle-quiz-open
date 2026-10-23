/**
 * HUMAN-CURATED CANDIDATE CATALOGUE — not a playable route.
 * IDs in existingQuestionIds belong to the frozen v31 bank.
 * Questions here are candidates for expert review, NOT 10-question releases.
 */
export const seasonalReviewCatalogV1 = [
  {
    id: "kadir_gecesi",
    title: "Kadir Gecesi",
    existingQuestionIds: [
      "v7-quran-004",
      "v7-quran-005",
      "v11-quran-005",
    ],
    editorialWarnings: [
      "v11-quran-005 uses 'indirilmeye başlanmıştır'; compare Quran 97/1 literal wording versus exegetical chronology before any reuse.",
    ],
  },
  {
    id: "ramazan_bayrami",
    title: "Ramazan Bayramı",
    existingQuestionIds: [
      "v7-general-002",
      "v13-general-002",
    ],
    editorialWarnings: [
      "These two questions both ask the definition of fitre. Count as ONE learning objective.",
      "v11-general-003 (generic khutbah at Friday and Eid prayer) intentionally excluded from dedicated Ramadan Eid learning objectives.",
    ],
  },
  {
    id: "kurban_bayrami",
    title: "Kurban Bayramı",
    existingQuestionIds: [],
    editorialWarnings: [
      "No existing v31 question specifically about Eid al-Adha was found in the first cue scan; new drafts do not imply approval.",
    ],
  },
  {
    id: "hac_mevsimi",
    title: "Hac Mevsimi",
    existingQuestionIds: [
      "pilot-general-002",
      "pilot-general-003",
      "pilot-general-004",
      "e150-general-021",
      "e150-general-022",
      "e150-general-023",
      "e150-general-024",
      "e150-general-025",
      "e150-general-026",
      "e150-general-027",
      "e150-general-028",
    ],
    editorialWarnings: [
      "e150-quran-039, e150-quran-040 and learn-akaid-008 concern the Quranic surah named Hac, NOT the pilgrimage ritual, so are excluded.",
      "Sa'y and its start point and number of circuits may share pedagogical concepts even when IDs and group keys differ.",
    ],
  },
  {
    id: "muharrem_asura",
    title: "Muharrem ve Aşure",
    existingQuestionIds: ["learn-history-001", "learn-history-002"],
    editorialWarnings: [
      "The two questions share the broader Kerbela historical incident; consider a single learning objective for balanced rounds.",
      "Do not imply that every culturally established Ashura practice is a religious obligation or a rigorously authenticated prophetic report.",
    ],
  },
] as const;

export type SeasonalReviewCategoryId = (typeof seasonalReviewCatalogV1)[number]["id"];
export const seasonalReviewStatus = "draft" as const;
