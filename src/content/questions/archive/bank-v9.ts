import type { Question } from "../model";
import { bankV8 } from "./bank-v8";
import { newCandidatesV9 } from "../candidates-v9";

// Previously saved v1-v8 catalogs must remain byte-for-byte compatible.
export const bankV9: readonly Question[] = [...bankV8, ...newCandidatesV9];
