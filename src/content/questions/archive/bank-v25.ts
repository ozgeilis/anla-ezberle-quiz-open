import type { Question } from "../model";
import { bankV24 } from "./bank-v24";
import { publishedNewQuestionsV25 } from "../published-v25";
export const bankV25: readonly Question[] = [...bankV24,...publishedNewQuestionsV25];
