import type { Question } from "../model";
import { bankV16 } from "./bank-v16";
import { publishedNewQuestionsV17 } from "../published-v17";
/** v17 append-only; old game records use their original versioned banks. */
export const bankV17: readonly Question[] = [...bankV16,...publishedNewQuestionsV17];
