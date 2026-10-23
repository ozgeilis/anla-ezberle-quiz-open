import type { Question } from "../model";
import { bankV15 } from "./bank-v15";
import { publishedNewQuestionsV16 } from "../published-v16";
/** Append-only v16; v15 is kept for earlier game histories. */
export const bankV16: readonly Question[] = [...bankV15, ...publishedNewQuestionsV16];
