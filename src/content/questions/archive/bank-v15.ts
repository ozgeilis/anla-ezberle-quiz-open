import type { Question } from "../model";
import { bankV14 } from "./bank-v14";
import { publishedNewQuestionsV15 } from "../published-v15";
/** Immutable, append-only v15. Every previously played question remains as in v14. */
export const bankV15: readonly Question[] = [
  ...bankV14,
  ...publishedNewQuestionsV15,
];
