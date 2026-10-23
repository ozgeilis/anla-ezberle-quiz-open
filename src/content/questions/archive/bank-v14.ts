import type { Question } from "../model";
import { bankV13 } from "./bank-v13";
import { difficultyCalibrationV14 } from "../difficulty-calibration-v14";

/**
 * Difficulty-only editorial revision. No prompts, keys, choices, explanations,
 * citations or concept groups are changed. Historical catalogs stay frozen.
 * The Frankfurt online 'owner_approved_v13' export still uses bankV13.
 */
export const bankV14: readonly Question[] = bankV13.map((q): Question => {
  const calibrated = difficultyCalibrationV14[q.id];
  if (!calibrated || calibrated === q.difficulty) return q;
  return {
    ...q,
    difficulty: calibrated,
    version: q.version + 1,
    updatedAt: "2026-10-20",
    reviewNotes:
      q.reviewNotes +
      " v14 zorluk kalibrasyonu: başlangıç seviyesinde temel kavramlar, orta seviyede ön bilgi, zor seviyede özel ayrıntı/ezber. Bağımsız ölçüm veya dinî uzman incelemesi değildir.",
  };
});
