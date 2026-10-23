import type { Question } from "../model";
import { bankV48 } from "./bank-v48";
import { publishedNewQuestionsV49 } from "../published-v49";
export const bankV49: readonly Question[] = [...bankV48, ...publishedNewQuestionsV49];
