import type { Question } from "../model";
import { bankV32 } from "./bank-v32";
import { publishedCorrectionsV33 } from "../published-v33";
const corrections = new Map(publishedCorrectionsV33.map((q) => [q.id, q]));
export const bankV33: readonly Question[] = bankV32.map(
  (q) => corrections.get(q.id) ?? q,
);
