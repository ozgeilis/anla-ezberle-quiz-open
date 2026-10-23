import type { Question } from "../model";
import { bankV35 } from "./bank-v35";
import { publishedCorrectionsV36 } from "../published-v36";
const corrections = new Map(publishedCorrectionsV36.map((q) => [q.id, q]));
export const bankV36: readonly Question[] = bankV35.map((q) => corrections.get(q.id) ?? q);
