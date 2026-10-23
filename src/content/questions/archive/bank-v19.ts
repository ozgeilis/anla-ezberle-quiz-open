import type { Question } from "../model";
import { bankV18 } from "./bank-v18";
import { publishedNewQuestionsV19 } from "../published-v19";
/** Append-only: earlier snapshots kept intact for historical game records. */
export const bankV19: readonly Question[] = [...bankV18,...publishedNewQuestionsV19];
