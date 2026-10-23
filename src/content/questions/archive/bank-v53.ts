import type { Question } from "../model";
import { bankV52 } from "./bank-v52";
import { publishedNewQuestionsV53 } from "../published-v53";
export const bankV53: readonly Question[] = [...bankV52, ...publishedNewQuestionsV53];
