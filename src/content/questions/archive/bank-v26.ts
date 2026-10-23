import type { Question } from "../model";
import { bankV25 } from "./bank-v25";
import { publishedNewQuestionsV26 } from "../published-v26";
export const bankV26: readonly Question[] = [...bankV25,...publishedNewQuestionsV26];
