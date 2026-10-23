import type { Question } from "../model";
import { bankV67 } from "./bank-v67";
import { publishedNewQuestionsV68 } from "../published-v68";
export const bankV68: readonly Question[] = [...bankV67, ...publishedNewQuestionsV68];
