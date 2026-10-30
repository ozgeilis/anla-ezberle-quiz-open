import { questionsV73 } from "./questions-v73";
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
export const BANK_VERSION = 73;
export const questions: readonly Question[] = questionsV73;
export const questionById: ReadonlyMap<string, Question> = new Map(
  questions.map((q) => [q.id, q]),
);
export type ContentChannel = "prototype" | "production";
// v73: owner-authorized option-quality release; v72 and older games are frozen.
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
    (q) => q.reviewStatus === "approved" || (
      channel === "prototype" &&
      q.sources.length > 0 &&
      q.sources.every((s) => s.checkStatus === "supported")
    ),
  );
}
export const availableQuestions = playableQuestions(CONTENT_CHANNEL);
