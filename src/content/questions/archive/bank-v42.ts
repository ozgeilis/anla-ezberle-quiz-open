import type { Question } from "../model";
import { bankV41 } from "./bank-v41";
import { publishedNewQuestionsV42 } from "../published-v42";
export const bankV42: readonly Question[] = [...bankV41, ...publishedNewQuestionsV42];
