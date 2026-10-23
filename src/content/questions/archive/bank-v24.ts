import type { Question } from "../model";
import { bankV23 } from "./bank-v23";
import { publishedNewQuestionsV24 } from "../published-v24";
export const bankV24: readonly Question[] = [...bankV23,...publishedNewQuestionsV24];
