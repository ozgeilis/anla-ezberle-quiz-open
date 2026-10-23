import type { Question } from "../model";
import { bankV9 } from "./bank-v9";
import { newCandidatesV10 } from "../candidates-v10";

// Archive v1-v9 catalogs for backwards-compatible scoring.
export const bankV10: readonly Question[] = [...bankV9, ...newCandidatesV10];
