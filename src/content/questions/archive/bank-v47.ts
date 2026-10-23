import type { Question } from "../model";
import { bankV46 } from "./bank-v46";
import { publishedNewQuestionsV47 } from "../published-v47";
export const bankV47: readonly Question[] = [...bankV46, ...publishedNewQuestionsV47];
