import type { Question } from "../model";
import { bankV59 } from "./bank-v59";
import { publishedNewQuestionsV60 } from "../published-v60";
export const bankV60: readonly Question[] = [...bankV59, ...publishedNewQuestionsV60];
