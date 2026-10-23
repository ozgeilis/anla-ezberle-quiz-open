import type { Question } from "../model";
import { bankV34 } from "./bank-v34";
import { publishedCorrectionsV35 } from "../published-v35";
const corrections = new Map(publishedCorrectionsV35.map((q) => [q.id, q]));
export const bankV35: readonly Question[] = bankV34.map((q) => corrections.get(q.id) ?? q);
