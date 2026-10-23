import type { Question } from "../model";
import { bankV40 } from "./bank-v40";
import { publishedCorrectionsV41 } from "../published-v41";
const corrections = new Map(publishedCorrectionsV41.map((q) => [q.id, q]));
export const bankV41: readonly Question[] = bankV40.map((q) => corrections.get(q.id) ?? q);
