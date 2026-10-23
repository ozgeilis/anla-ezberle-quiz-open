import type { Question } from "../model";
import { bankV22 } from "./bank-v22";
import { publishedNewQuestionsV23 } from "../published-v23";
export const bankV23: readonly Question[] = [...bankV22,...publishedNewQuestionsV23];
