import type { Question } from "../model";
import { bankV39 } from "./bank-v39";
import { publishedCorrectionsV40 } from "../published-v40";
const corrections = new Map(publishedCorrectionsV40.map((q) => [q.id, q]));
export const bankV40: readonly Question[] = bankV39.map((q) => corrections.get(q.id) ?? q);
