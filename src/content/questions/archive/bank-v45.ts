import type { Question } from "../model";
import { bankV44 } from "./bank-v44";
import { publishedNewQuestionsV45 } from "../published-v45";
export const bankV45: readonly Question[] = [...bankV44, ...publishedNewQuestionsV45];
