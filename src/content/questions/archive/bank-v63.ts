import type { Question } from "../model";
import { bankV62 } from "./bank-v62";
import { publishedNewQuestionsV63 } from "../published-v63";
export const bankV63: readonly Question[] = [...bankV62, ...publishedNewQuestionsV63];
