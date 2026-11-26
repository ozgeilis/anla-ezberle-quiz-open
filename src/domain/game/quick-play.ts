import { getLevelFromXp } from "../scoring/levels";
import type { DifficultyCounts } from "./stages";

// Uses the existing XP thresholds; there is no separate saved progression.
// Each step adds at most one harder question. Unknown/invalid XP starts easy.
export function quickPlayCounts(totalXp: number): DifficultyCounts {
  const level = getLevelFromXp(totalXp);
  const medium = Math.min(6, level - 1);
  const hard = Math.min(3, Math.max(0, Math.floor((level - 5) / 5)));
  return { easy: 10 - medium - hard, medium, hard };
}
