import type { Question } from "../model";
import { bankV26 } from "./bank-v26";
import { publishedNewQuestionsV27 } from "../published-v27";
export const bankV27: readonly Question[] = [...bankV26,...publishedNewQuestionsV27];
