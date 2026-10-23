import type { Question } from "../model";
import { bankV49 } from "./bank-v49";
import { publishedNewQuestionsV50 } from "../published-v50";
export const bankV50: readonly Question[] = [...bankV49, ...publishedNewQuestionsV50];
