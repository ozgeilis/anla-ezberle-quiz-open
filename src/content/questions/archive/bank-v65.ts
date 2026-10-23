import type { Question } from "../model";
import { bankV64 } from "./bank-v64";
import { publishedNewQuestionsV65 } from "../published-v65";
export const bankV65: readonly Question[] = [...bankV64,...publishedNewQuestionsV65];
