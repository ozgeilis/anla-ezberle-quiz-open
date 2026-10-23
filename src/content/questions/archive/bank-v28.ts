import type { Question } from "../model";
import { bankV27 } from "./bank-v27";
import { publishedNewQuestionsV28 } from "../published-v28";
export const bankV28: readonly Question[] = [...bankV27,...publishedNewQuestionsV28];
