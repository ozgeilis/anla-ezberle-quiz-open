import type { Question } from "../model";
import { bankV28 } from "./bank-v28";
import { publishedNewQuestionsV29 } from "../published-v29";
export const bankV29: readonly Question[] = [...bankV28,...publishedNewQuestionsV29];
