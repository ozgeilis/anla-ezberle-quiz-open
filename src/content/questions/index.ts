import { questionsV74 } from "./questions-v74";
import type { Question } from "./model";
export type {
  CategoryId,
  ReviewStatus,
  Question,
  QuestionSource,
  Difficulty,
} from "./model";
export { difficultyName } from "./model";
export { categories, categoryName } from "./archive/bank-v1";
export const BANK_VERSION = 74;
export const questions: readonly Question[] = questionsV74;
export const questionById: ReadonlyMap<string, Question> = new Map(
  questions.map((q) => [q.id, q]),
);
export type ContentChannel = "prototype" | "production";
// v74: source-compared 3000-question bank; v1-v73 games remain frozen.
// Onaysız adaylar yalnızca kaynak kontrolü varsa ve prototype açıkça seçilmişse oynatılır.
export const CONTENT_CHANNEL: ContentChannel =
  process.env.EXPO_PUBLIC_CONTENT_CHANNEL === "prototype"
    ? "prototype"
    : "production";
export function playableQuestions(
  channel: ContentChannel = "production",
  bank = questions,
) {
  return bank.filter(
    (q) =>
      q.reviewStatus === "approved" ||
      (channel === "prototype" &&
        q.sources.length > 0 &&
        q.sources.every((s) => s.checkStatus === "supported")),
  );
}
export const availableQuestions = playableQuestions(CONTENT_CHANNEL);
