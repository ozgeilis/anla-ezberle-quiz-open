import type { Question } from "../model";
import { bankV47 } from "./bank-v47";
import { publishedNewQuestionsV48 } from "../published-v48";
export const bankV48: readonly Question[] = [...bankV47, ...publishedNewQuestionsV48];
