import type { Difficulty } from "./model";

/**
 * Human-readable, ID-specific curriculum calibration, 2026-10-20.
 * Audience: a first-time learner can enter 'easy' without needing to
 * memorise obscure verse counts, exact dates, Arabic terminology or isnads.
 *
 * 'medium' = some prior study; 'hard' = detailed text/history recall.
 * This is an editorial *difficulty* judgement, not an independent
 * scholarly/factual approval or measured psychometric assessment.
 * Original v13 questions, answers, explanations and historical results stay intact.
 */
const easier: readonly string[] = [
  "quran-006", "v9-quran-004", "v9-quran-005", "v10-quran-007", "v11-quran-011", "v12-quran-004", "v12-quran-007", "v12-quran-009",
  "v12-quran-010", "v12-quran-012", "v13-quran-007", "v13-quran-008", "v13-quran-010", "e150-prophets-003", "e150-prophets-008", "e150-prophets-014",
  "e150-prophets-017", "e150-prophets-018", "e150-prophets-021", "e150-prophets-025", "e150-prophets-026", "e150-prophets-033", "e150-prophets-036", "v7-prophets-003",
  "v9-prophets-004", "v11-prophets-012", "v12-prophets-003", "v13-prophets-008", "history-002", "history-011", "e150-history-001", "e150-history-005",
  "e150-history-009", "e150-history-010", "e150-history-015", "e150-history-016", "e150-history-019", "e150-history-021", "e150-history-024", "e150-history-029",
  "e150-history-030", "e150-history-031", "e150-history-035", "v9-history-002", "general-008", "general-009", "general-011", "general-012",
  "e150-general-001", "e150-general-002", "e150-general-004", "e150-general-005", "e150-general-007", "e150-general-008", "e150-general-009", "e150-general-010",
  "e150-general-011", "e150-general-012", "e150-general-015", "e150-general-016", "e150-general-017", "e150-general-018", "e150-general-019", "e150-general-020",
  "e150-general-021", "e150-general-024", "e150-general-029", "e150-general-030", "e150-general-031", "e150-general-032", "e150-general-033", "e150-general-034",
  "v8-general-005", "v9-general-005", "v9-general-010", "v11-general-002", "v11-general-012", "v12-general-004", "v12-general-006", "v12-general-010",
  "v12-general-012", "v13-general-002", "v13-general-010", "v13-general-011",
];

const foundationalStudy: readonly string[] = [
  "pilot-quran-001", "pilot-quran-002", "v7-quran-002", "v8-quran-001", "v9-quran-001", "v9-quran-003", "v9-quran-007", "v10-quran-001",
  "v10-quran-002", "v10-quran-003", "v10-quran-004", "v10-quran-012", "v11-quran-001", "v11-quran-003", "v11-quran-008", "v11-quran-013",
  "v12-quran-001", "pilot-prophets-001", "pilot-prophets-002", "v7-prophets-005", "v8-prophets-002", "v9-prophets-002", "v9-prophets-007", "v10-prophets-008",
  "v11-prophets-011", "v13-prophets-001", "v13-prophets-007", "v8-history-002", "v9-history-001", "v10-history-008", "v10-history-011", "v12-history-003",
  "v12-history-011", "v13-history-001", "v13-history-009", "v9-general-001", "v10-general-009", "v10-general-013",
];

// 3rd–22nd surah exact verse counts or mushaf sequence are specialist recall.
// The earliest 3rd–5th surah order questions remain medium, not easy.
const surahPrecision: readonly string[] = [
  "e150-quran-001", "e150-quran-003", "e150-quran-005", "e150-quran-007", "e150-quran-008", "e150-quran-009", "e150-quran-010", "e150-quran-011",
  "e150-quran-012", "e150-quran-013", "e150-quran-014", "e150-quran-015", "e150-quran-016", "e150-quran-017", "e150-quran-018", "e150-quran-019",
  "e150-quran-020", "e150-quran-021", "e150-quran-022", "e150-quran-023", "e150-quran-024", "e150-quran-025", "e150-quran-026", "e150-quran-027",
  "e150-quran-028", "e150-quran-029", "e150-quran-030", "e150-quran-031", "e150-quran-032", "e150-quran-033", "e150-quran-034", "e150-quran-035",
  "e150-quran-036", "e150-quran-037", "e150-quran-038", "e150-quran-039", "e150-quran-040",
];

const advancedStudy: readonly string[] = [
  "v8-quran-002", "v10-quran-008", "e150-prophets-006", "e150-prophets-015", "e150-prophets-019", "e150-prophets-028", "e150-prophets-029", "e150-prophets-031",
  "e150-prophets-035", "e150-prophets-039", "e150-prophets-040", "v7-prophets-002", "v8-prophets-001", "v8-prophets-004", "v9-prophets-003", "v9-prophets-006",
  "v10-prophets-012", "v10-prophets-014", "v11-prophets-004", "v13-prophets-012", "e150-history-018", "e150-history-023", "e150-history-026", "e150-history-027",
  "v7-history-003", "v7-history-005", "v9-history-006", "v10-history-001", "v10-history-002", "v10-history-003", "v10-history-004", "v10-history-005",
  "v10-history-006", "v10-history-012", "v11-history-001", "v11-history-006", "v11-history-009", "v11-history-010", "v12-history-002", "v12-history-004",
  "v12-history-007", "v12-history-009", "v12-history-012", "v13-history-002", "v13-history-006", "v13-history-008", "v10-general-001", "v10-general-002",
  "v10-general-008", "v10-general-010", "v10-general-011", "v13-general-001", "v13-general-006",
];

export const difficultyCalibrationV14: Readonly<Record<string, Difficulty>> = Object.freeze(
  Object.fromEntries([
    ...easier.map((id) => [id, "easy"] as const),
    ...foundationalStudy.map((id) => [id, "medium"] as const),
    ...surahPrecision.map((id) => [id, "hard"] as const),
    ...advancedStudy.map((id) => [id, "hard"] as const),
  ]),
);

export const difficultyCalibrationCountV14 = {
  easy: easier.length,
  medium: foundationalStudy.length,
  hard: surahPrecision.length + advancedStudy.length,
} as const;
