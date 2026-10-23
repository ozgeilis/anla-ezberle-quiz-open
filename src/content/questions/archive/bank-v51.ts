import type { Question } from "../model";
import { bankV50 } from "./bank-v50";
import { publishedNewQuestionsV51 } from "../published-v51";
export const bankV51: readonly Question[] = [...bankV50, ...publishedNewQuestionsV51];
