import type { Question } from "../model";
import { bankV42 } from "./bank-v42";
import { publishedNewQuestionsV43 } from "../published-v43";
export const bankV43: readonly Question[] = [...bankV42, ...publishedNewQuestionsV43];
