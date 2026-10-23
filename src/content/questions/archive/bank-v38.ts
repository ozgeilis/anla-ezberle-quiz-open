import type { Question } from "../model";
import { bankV37 } from "./bank-v37";
import { publishedCorrectionsV38 } from "../published-v38";
const corrections = new Map(publishedCorrectionsV38.map((q) => [q.id, q]));
export const bankV38: readonly Question[] = bankV37.map((q) => corrections.get(q.id) ?? q);
