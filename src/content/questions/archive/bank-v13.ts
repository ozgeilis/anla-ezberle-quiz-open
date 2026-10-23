import type { Question } from "../model";
import { bankV12 } from "./bank-v12";
import { newCandidatesV13 } from "../candidates-v13";

// Extend previous catalogs without changing archived game results.
export const bankV13: readonly Question[] = [...bankV12, ...newCandidatesV13];
