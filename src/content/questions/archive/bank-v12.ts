import type { Question } from "../model";
import { bankV11 } from "./bank-v11";
import { newCandidatesV12 } from "../candidates-v12";

// Never modify archived versions; v12 is append-only.
export const bankV12: readonly Question[] = [...bankV11, ...newCandidatesV12];
