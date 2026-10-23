import type { Question } from "../model";
import { bankV4 } from "./bank-v4";

// v1-v4 snapshots are immutable; only editorial metadata changes for new games.
// Owner approved use of the 216 candidates on 2026-10-19.
// No independent theological/editorial review is claimed.
export const bankV5: readonly Question[] = bankV4.map((q): Question => ({
  ...q,
  reviewStatus: "approved",
  reviewNotes:
    "Ürün sahibinin 2026-10-19 tarihli kararıyla uygulamada kullanım için onaylandı. " +
    "Bağımsız editör veya dinî uzman değerlendirmesi yapıldığı iddia edilmez. " +
    "Kaynak, açıklama ve çeldirici denetimi sürdürülür.",
  updatedAt: "2026-10-19",
}));
