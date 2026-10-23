import type { Question } from "../model";
import { bankV65 } from "./bank-v65";
import { publishedNewQuestionsV66 } from "../published-v66";
export const bankV66: readonly Question[] = [...bankV65,...publishedNewQuestionsV66];
