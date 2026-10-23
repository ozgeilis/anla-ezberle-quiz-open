import type { Question } from "../model";
import { bankV21 } from "./bank-v21";
import { publishedNewQuestionsV22 } from "../published-v22";
export const bankV22: readonly Question[] = [...bankV21,...publishedNewQuestionsV22];
