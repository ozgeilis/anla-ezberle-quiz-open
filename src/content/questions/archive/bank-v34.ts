import type { Question } from "../model";
import { bankV33 } from "./bank-v33";
import { publishedCorrectionsV34 } from "../published-v34";
const corrections = new Map(publishedCorrectionsV34.map((q) => [q.id, q]));
export const bankV34: readonly Question[] = bankV33.map(
  (q) => corrections.get(q.id) ?? q,
);
