import type { Question } from "../model";
import { bankV6 } from "./bank-v6";
import { newCandidatesV7 } from "../candidates-v7";

// Eski bankalara dokunma: v1-v6 sonuçları aynı soru ve şıklarla çözülür.
export const bankV7: readonly Question[] = [...bankV6, ...newCandidatesV7];
