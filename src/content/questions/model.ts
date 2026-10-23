export type CategoryId = "quran" | "prophets" | "history" | "general";
export type ReviewStatus = "draft" | "reviewed" | "approved";
export type Difficulty = "easy" | "medium" | "hard";
export interface QuestionSource {
  readonly title: string;
  readonly publisher: string;
  readonly url: string;
  readonly locator: string;
  readonly supports: string;
  readonly checkStatus: "supported" | "unverified";
  readonly checkedAt?: string;
}
export interface Question {
  readonly id: string;
  readonly version: number;
  readonly categoryId: CategoryId;
  readonly difficulty: Difficulty;
  readonly question: string;
  readonly options: readonly [
    { readonly id: string; readonly text: string },
    { readonly id: string; readonly text: string },
    { readonly id: string; readonly text: string },
    { readonly id: string; readonly text: string },
  ];
  readonly correctOptionId: string;
  readonly explanation: string;
  readonly sources: readonly QuestionSource[];
  readonly reviewStatus: ReviewStatus;
  readonly reviewNotes: string;
  // İnsan editörün gerçek incelemesinde doldurulur; kaynak kontrolü bu alanı doldurmaz.
  readonly reviewedAt?: string;
  readonly updatedAt: string;
  readonly conceptGroup: string;
}
export const difficultyName: Record<Difficulty, string> = {
  easy: "Kolay",
  medium: "Orta",
  hard: "Zor",
};
