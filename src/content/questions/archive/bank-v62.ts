import type { Question } from "../model";
import { bankV61 } from "./bank-v61";
import { publishedNewQuestionsV62 } from "../published-v62";
export const bankV62: readonly Question[] = [...bankV61, ...publishedNewQuestionsV62];
