import type { Question } from "../model";
import { bankV66 } from "./bank-v66";
import { publishedNewQuestionsV67 } from "../published-v67";
export const bankV67: readonly Question[] = [...bankV66, ...publishedNewQuestionsV67];
