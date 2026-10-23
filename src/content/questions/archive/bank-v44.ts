import type { Question } from "../model";
import { bankV43 } from "./bank-v43";
import { publishedNewQuestionsV44 } from "../published-v44";
export const bankV44: readonly Question[] = [...bankV43, ...publishedNewQuestionsV44];
