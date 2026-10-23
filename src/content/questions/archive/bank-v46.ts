import type { Question } from "../model";
import { bankV45 } from "./bank-v45";
import { publishedCorrectionsV46 } from "../published-v46";
const corrections=new Map(publishedCorrectionsV46.map(q=>[q.id,q]));
export const bankV46: readonly Question[] = bankV45.map(q=>corrections.get(q.id)??q);
