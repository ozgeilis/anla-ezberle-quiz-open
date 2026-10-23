import type { Difficulty } from "../../content/questions";
export const gameStages = [
  {
    id: "beginner",
    title: "Başlangıç",
    hint: "10 Kolay",
    icon: "sun",
    tone: "mint",
    counts: { easy: 10, medium: 0, hard: 0 },
  },
  {
    id: "growing",
    title: "Gelişen",
    hint: "7 Kolay · 3 Orta",
    icon: "trending-up",
    tone: "gold",
    counts: { easy: 7, medium: 3, hard: 0 },
  },
  {
    id: "informed",
    title: "Bilgili",
    hint: "3 Kolay · 7 Orta",
    icon: "book-open",
    tone: "mint",
    counts: { easy: 3, medium: 7, hard: 0 },
  },
  {
    id: "advanced",
    title: "İleri",
    hint: "6 Orta · 4 Zor",
    icon: "zap",
    tone: "rose",
    counts: { easy: 0, medium: 6, hard: 4 },
  },
  {
    id: "master",
    title: "Usta",
    hint: "10 Zor",
    icon: "award",
    tone: "violet",
    counts: { easy: 0, medium: 0, hard: 10 },
  },
] as const;
export type GameStage = (typeof gameStages)[number]["id"];
export function isGameStage(value: unknown): value is GameStage {
  return gameStages.some((s) => s.id === value);
}
export function stageDefinition(stage: GameStage) {
  return gameStages.find((s) => s.id === stage)!;
}
export type DifficultyCounts = Record<Difficulty, number>;
