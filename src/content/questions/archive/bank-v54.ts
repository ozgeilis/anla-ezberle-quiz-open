import type { Question } from "../model";
import { bankV53 } from "./bank-v53";
import { publishedNewQuestionsV54 } from "../published-v54";
export const bankV54: readonly Question[] = [...bankV53, ...publishedNewQuestionsV54];
