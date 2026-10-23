import type { Question } from "../model";
import { bankV56 } from "./bank-v56";
import { publishedNewQuestionsV57 } from "../published-v57";
export const bankV57: readonly Question[] = [...bankV56, ...publishedNewQuestionsV57];
