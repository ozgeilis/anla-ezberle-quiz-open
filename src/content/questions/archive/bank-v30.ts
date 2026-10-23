import type { Question } from "../model";
import { bankV29 } from "./bank-v29";
import { publishedNewQuestionsV30 } from "../published-v30";
export const bankV30: readonly Question[] = [...bankV29,...publishedNewQuestionsV30];
