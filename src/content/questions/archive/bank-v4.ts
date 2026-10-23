import type { Question } from "../model";
import { bankV3 } from "./bank-v3";
import { quranV4 } from "../candidates-v4-quran";
import { prophetsV4 } from "../candidates-v4-prophets";
import { historyV4 } from "../candidates-v4-history";
import { generalV4 } from "../candidates-v4-general";

// Append-only versioning: v1/v2/v3 catalogs remain frozen for saved results.
// Only prototype mode can play drafts; production must remain fail-closed.
export const newCandidatesV4: readonly Question[] = [
  ...quranV4,
  ...prophetsV4,
  ...historyV4,
  ...generalV4,
];

export const bankV4: readonly Question[] = [...bankV3, ...newCandidatesV4];
