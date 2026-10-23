import type { Question } from "../model";
import { bankV69 } from "./bank-v69";
import { publishedNewQuestionsV70 } from "../published-v70";
export const bankV70: readonly Question[] = [...bankV69, ...publishedNewQuestionsV70];
