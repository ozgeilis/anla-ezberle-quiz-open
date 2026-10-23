import type { Question } from "../model";
import { bankV30 } from "./bank-v30";
import { publishedNewQuestionsV31 } from "../published-v31";
export const bankV31: readonly Question[] = [...bankV30,...publishedNewQuestionsV31];
