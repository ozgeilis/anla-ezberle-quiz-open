import type { Question } from "../model";
import { bankV51 } from "./bank-v51";
import { publishedNewQuestionsV52 } from "../published-v52";
export const bankV52: readonly Question[] = [...bankV51, ...publishedNewQuestionsV52];
