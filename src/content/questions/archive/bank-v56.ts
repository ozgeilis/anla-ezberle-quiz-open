import type { Question } from "../model";
import { bankV55 } from "./bank-v55";
import { publishedNewQuestionsV56 } from "../published-v56";
export const bankV56: readonly Question[] = [...bankV55,...publishedNewQuestionsV56];
