import type { Question } from "../model";
import { bankV70 } from "./bank-v70";
import { publishedNewQuestionsV71 } from "../published-v71";
export const bankV71: readonly Question[] = [...bankV70, ...publishedNewQuestionsV71];
