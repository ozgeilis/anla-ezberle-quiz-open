import type { Question } from "../model";
import { bankV68 } from "./bank-v68";
import { publishedNewQuestionsV69 } from "../published-v69";
export const bankV69: readonly Question[] = [...bankV68, ...publishedNewQuestionsV69];
