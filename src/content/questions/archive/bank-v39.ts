import type { Question } from "../model";
import { bankV38 } from "./bank-v38";
import { publishedCorrectionsV39 } from "../published-v39";
const corrections = new Map(publishedCorrectionsV39.map((q) => [q.id, q]));
export const bankV39: readonly Question[] = bankV38.map((q) => corrections.get(q.id) ?? q);
