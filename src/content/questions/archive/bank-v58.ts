import type { Question } from "../model";
import { bankV57 } from "./bank-v57";
import { publishedNewQuestionsV58 } from "../published-v58";
export const bankV58: readonly Question[] = [...bankV57, ...publishedNewQuestionsV58];
