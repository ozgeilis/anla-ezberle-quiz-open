import type { Question } from "../model";
import { bankV19 } from "./bank-v19";
import { publishedNewQuestionsV20 } from "../published-v20";
/** Append-only v20; the original 571 v19 questions are immutable. */
export const bankV20: readonly Question[] = [...bankV19,...publishedNewQuestionsV20];
