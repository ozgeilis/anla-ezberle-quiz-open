import type { Question } from "../model";
import { bankV31 } from "./bank-v31";
import { publishedCorrectionsV32 } from "../published-v32";
const corrections = new Map(publishedCorrectionsV32.map((q) => [q.id, q]));
/** Same 600 IDs/answers; only new sessions receive the six revised records. */
export const bankV32: readonly Question[] = bankV31.map(
  (q) => corrections.get(q.id) ?? q,
);
