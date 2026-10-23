import type { Question } from "../model";
import { bankV60 } from "./bank-v60";
import { publishedNewQuestionsV61 } from "../published-v61";
export const bankV61: readonly Question[] = [...bankV60, ...publishedNewQuestionsV61];
