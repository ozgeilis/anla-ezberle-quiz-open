import type { Question } from "../model";
import { bankV54 } from "./bank-v54";
import { publishedNewQuestionsV55 } from "../published-v55";
export const bankV55: readonly Question[] = [...bankV54, ...publishedNewQuestionsV55];
