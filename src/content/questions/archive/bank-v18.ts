import type { Question } from "../model";
import { bankV17 } from "./bank-v17";
import { publishedNewQuestionsV18 } from "../published-v18";
/** v18 append-only; historical answers remain in their original bank. */
export const bankV18: readonly Question[] = [...bankV17,...publishedNewQuestionsV18];
