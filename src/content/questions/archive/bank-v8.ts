import type { Question } from "../model";
import { bankV7 } from "./bank-v7";
import { newCandidatesV8 } from "../candidates-v8";

// Preserve v1–v7 catalogs exactly to protect score and explanation histories.
export const bankV8: readonly Question[] = [...bankV7, ...newCandidatesV8];
