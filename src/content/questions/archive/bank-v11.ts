import type { Question } from "../model";
import { bankV10 } from "./bank-v10";
import { newCandidatesV11 } from "../candidates-v11";

// Extend the catalog without modifying previously saved v1-v10 records.
export const bankV11: readonly Question[] = [...bankV10, ...newCandidatesV11];
