import type { Difficulty } from "../../content/questions/model";
import { learningTopicsV1 } from "../../content/questions/learning-topics-v1";
import { gameStages } from "../game/stages";
export const liveTopics = [
  "mixed",
  ...learningTopicsV1.map((t) => t.id),
] as const;
export const liveLevels = [
  "easy",
  "medium",
  "hard",
  ...gameStages.map((s) => s.id),
] as const;
export type LiveLevel = (typeof liveLevels)[number];
export const liveCounts = [5, 10, 15] as const;
export const ANSWER_SECONDS = 15;
export const REVEAL_SECONDS = 5;
export const WIN_BONUS_XP = 20;
// Largest-remainder scaling preserves the existing ten-question stage ratios.
export function liveQuotas(
  level: string,
  count: number,
): Record<Difficulty, number> {
  const exact = ["easy", "medium", "hard"].includes(level)
    ? {
        easy: level === "easy" ? 10 : 0,
        medium: level === "medium" ? 10 : 0,
        hard: level === "hard" ? 10 : 0,
      }
    : gameStages.find((s) => s.id === level)?.counts;
  if (!exact || !liveCounts.includes(count as 5 | 10 | 15))
    throw new Error("Invalid live settings");
  const keys = ["easy", "medium", "hard"] as const;
  const result = Object.fromEntries(
    keys.map((k) => [k, Math.floor((exact[k] * count) / 10)]),
  ) as Record<Difficulty, number>;
  const remainder = count - keys.reduce((n, k) => n + result[k], 0);
  [...keys]
    .sort((a, b) => ((exact[b] * count) % 10) - ((exact[a] * count) % 10))
    .slice(0, remainder)
    .forEach((k) => result[k]++);
  return result;
}
export function liveClock(
  startAt: number,
  serverNow: number,
  count: number,
  answerSeconds: 10 | 15 = ANSWER_SECONDS,
) {
  const cycle = answerSeconds + REVEAL_SECONDS;
  const elapsed = (serverNow - startAt) / 1000;
  if (elapsed < 0)
    return {
      phase: "countdown" as const,
      position: 0,
      seconds: Math.ceil(-elapsed),
    };
  if (elapsed >= count * cycle)
    return { phase: "completed" as const, position: count, seconds: 0 };
  const position = Math.floor(elapsed / cycle) + 1,
    within = elapsed % cycle;
  return {
    phase: within < answerSeconds ? ("answer" as const) : ("reveal" as const),
    position,
    seconds: Math.ceil(
      (within < answerSeconds ? answerSeconds : cycle) - within,
    ),
  };
}
