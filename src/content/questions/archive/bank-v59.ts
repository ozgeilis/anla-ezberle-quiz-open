import type { Question } from "../model";
import { bankV58 } from "./bank-v58";
import { publishedNewQuestionsV59 } from "../published-v59";
export const bankV59: readonly Question[] = [...bankV58,...publishedNewQuestionsV59];
