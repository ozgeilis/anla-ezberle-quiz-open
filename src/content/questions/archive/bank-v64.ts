import type { Question } from "../model";
import { bankV63 } from "./bank-v63";
import { publishedNewQuestionsV64 } from "../published-v64";
export const bankV64: readonly Question[] = [...bankV63,...publishedNewQuestionsV64];
