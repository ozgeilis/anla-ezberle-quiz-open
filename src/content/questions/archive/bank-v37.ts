import type { Question } from "../model";
import { bankV36 } from "./bank-v36";
import { publishedCorrectionsV37 } from "../published-v37";
const corrections = new Map(publishedCorrectionsV37.map((q) => [q.id, q]));
export const bankV37: readonly Question[] = bankV36.map((q) => corrections.get(q.id) ?? q);
