import { questionById as legacy } from "./archive/bank-v1";
import { bankV2 } from "./archive/bank-v2";
import { bankV3 } from "./archive/bank-v3";
import { bankV4 } from "./archive/bank-v4";
import { bankV5 } from "./archive/bank-v5";
import { bankV6 } from "./archive/bank-v6";
import { bankV7 } from "./archive/bank-v7";
import { bankV8 } from "./archive/bank-v8";
import { bankV9 } from "./archive/bank-v9";
import { bankV10 } from "./archive/bank-v10";
import { bankV11 } from "./archive/bank-v11";
import { bankV12 } from "./archive/bank-v12";
import { bankV13 } from "./archive/bank-v13";
import { bankV14 } from "./archive/bank-v14";
import { bankV15 } from "./archive/bank-v15";
import { bankV16 } from "./archive/bank-v16";
import { bankV17 } from "./archive/bank-v17";
import { bankV18 } from "./archive/bank-v18";
import { bankV19 } from "./archive/bank-v19";
import { bankV20 } from "./archive/bank-v20";
import { bankV21 } from "./archive/bank-v21";
import { bankV22 } from "./archive/bank-v22";
import { bankV23 } from "./archive/bank-v23";
import { bankV24 } from "./archive/bank-v24";
import { bankV25 } from "./archive/bank-v25";
import { bankV26 } from "./archive/bank-v26";
import { bankV27 } from "./archive/bank-v27";
import { bankV28 } from "./archive/bank-v28";
import { bankV29 } from "./archive/bank-v29";
import { bankV30 } from "./archive/bank-v30";
import { bankV31 } from "./archive/bank-v31";
import { bankV32 } from "./archive/bank-v32";
import { bankV33 } from "./archive/bank-v33";
import { bankV34 } from "./archive/bank-v34";
import { bankV35 } from "./archive/bank-v35";
import { bankV36 } from "./archive/bank-v36";
import { bankV37 } from "./archive/bank-v37";
import { bankV38 } from "./archive/bank-v38";
import { bankV39 } from "./archive/bank-v39";
import { bankV40 } from "./archive/bank-v40";
import { bankV41 } from "./archive/bank-v41";
import { bankV42 } from "./archive/bank-v42";
import { bankV43 } from "./archive/bank-v43";
import { bankV44 } from "./archive/bank-v44";
import { bankV45 } from "./archive/bank-v45";
import { bankV46 } from "./archive/bank-v46";
import { bankV47 } from "./archive/bank-v47";
import { bankV48 } from "./archive/bank-v48";
import { bankV49 } from "./archive/bank-v49";
import { bankV50 } from "./archive/bank-v50";
import { bankV51 } from "./archive/bank-v51";
import { bankV52 } from "./archive/bank-v52";
import { bankV53 } from "./archive/bank-v53";
import { bankV54 } from "./archive/bank-v54";
import { bankV55 } from "./archive/bank-v55";
import { bankV56 } from "./archive/bank-v56";
import { bankV57 } from "./archive/bank-v57";
import { bankV58 } from "./archive/bank-v58";
import { bankV59 } from "./archive/bank-v59";
import { bankV60 } from "./archive/bank-v60";
import { bankV61 } from "./archive/bank-v61";
import { bankV62 } from "./archive/bank-v62";
import { bankV63 } from "./archive/bank-v63";
import { bankV64 } from "./archive/bank-v64";
import { bankV65 } from "./archive/bank-v65";
import { bankV66 } from "./archive/bank-v66";
import { bankV67 } from "./archive/bank-v67";
import { bankV68 } from "./archive/bank-v68";
import { bankV69 } from "./archive/bank-v69";
import { bankV70 } from "./archive/bank-v70";
import { questions1500 } from "./questions-1500";
import { questionsV72 } from "./questions-v72";
import type { Question } from "./model";

// Banka sürümleri bağımsız çözülür: yeni soru eklemek eski cevapları değiştirmez.
const catalogs: Readonly<Record<number, ReadonlyMap<string, Question>>> = {
  2: new Map(bankV2.map((q) => [q.id, q])),
  3: new Map(bankV3.map((q) => [q.id, q])),
  4: new Map(bankV4.map((q) => [q.id, q])),
  5: new Map(bankV5.map((q) => [q.id, q])),
  6: new Map(bankV6.map((q) => [q.id, q])),
  7: new Map(bankV7.map((q) => [q.id, q])),
  8: new Map(bankV8.map((q) => [q.id, q])),
  9: new Map(bankV9.map((q) => [q.id, q])),
  10: new Map(bankV10.map((q) => [q.id, q])),
  11: new Map(bankV11.map((q) => [q.id, q])),
  12: new Map(bankV12.map((q) => [q.id, q])),
  13: new Map(bankV13.map((q) => [q.id, q])),
  14: new Map(bankV14.map((q) => [q.id, q])),
  15: new Map(bankV15.map((q) => [q.id, q])),
  16: new Map(bankV16.map((q) => [q.id, q])),
  17: new Map(bankV17.map((q) => [q.id, q])),
  18: new Map(bankV18.map((q) => [q.id, q])),
  19: new Map(bankV19.map((q) => [q.id, q])),
  20: new Map(bankV20.map((q) => [q.id, q])),
  21: new Map(bankV21.map((q) => [q.id, q])),
  22: new Map(bankV22.map((q) => [q.id, q])),
  23: new Map(bankV23.map((q) => [q.id, q])),
  24: new Map(bankV24.map((q) => [q.id, q])),
  25: new Map(bankV25.map((q) => [q.id, q])),
  26: new Map(bankV26.map((q) => [q.id, q])),
  27: new Map(bankV27.map((q) => [q.id, q])),
  28: new Map(bankV28.map((q) => [q.id, q])),
  29: new Map(bankV29.map((q) => [q.id, q])),
  30: new Map(bankV30.map((q) => [q.id, q])),
  31: new Map(bankV31.map((q) => [q.id, q])),
  32: new Map(bankV32.map((q) => [q.id, q])),
  33: new Map(bankV33.map((q) => [q.id, q])),
  34: new Map(bankV34.map((q) => [q.id, q])),
  35: new Map(bankV35.map((q) => [q.id, q])),
  36: new Map(bankV36.map((q) => [q.id, q])),
  37: new Map(bankV37.map((q) => [q.id, q])),
  38: new Map(bankV38.map((q) => [q.id, q])),
  39: new Map(bankV39.map((q) => [q.id, q])),
  40: new Map(bankV40.map((q) => [q.id, q])),
  41: new Map(bankV41.map((q) => [q.id, q])),
  42: new Map(bankV42.map((q) => [q.id, q])),
  43: new Map(bankV43.map((q) => [q.id, q])),
  44: new Map(bankV44.map((q) => [q.id, q])),
  45: new Map(bankV45.map((q) => [q.id, q])),
  46: new Map(bankV46.map((q) => [q.id, q])),
  47: new Map(bankV47.map((q) => [q.id, q])),
  48: new Map(bankV48.map((q) => [q.id, q])),
  49: new Map(bankV49.map((q) => [q.id, q])),
  50: new Map(bankV50.map((q) => [q.id, q])),
  51: new Map(bankV51.map((q) => [q.id, q])),
  52: new Map(bankV52.map((q) => [q.id, q])),
  53: new Map(bankV53.map((q) => [q.id, q])),
  54: new Map(bankV54.map((q) => [q.id, q])),
  55: new Map(bankV55.map((q) => [q.id, q])),
  56: new Map(bankV56.map((q) => [q.id, q])),
  57: new Map(bankV57.map((q) => [q.id, q])),
  58: new Map(bankV58.map((q) => [q.id, q])),
  59: new Map(bankV59.map((q) => [q.id, q])),
  60: new Map(bankV60.map((q) => [q.id, q])),
  61: new Map(bankV61.map((q) => [q.id, q])),
  62: new Map(bankV62.map((q) => [q.id, q])),
  63: new Map(bankV63.map((q) => [q.id, q])),
  64: new Map(bankV64.map((q) => [q.id, q])),
  65: new Map(bankV65.map((q) => [q.id, q])),
  66: new Map(bankV66.map((q) => [q.id, q])),
  67: new Map(bankV67.map((q) => [q.id, q])),
  68: new Map(bankV68.map((q) => [q.id, q])),
  69: new Map(bankV69.map((q) => [q.id, q])),
  70: new Map(bankV70.map((q) => [q.id, q])),
  71: new Map(questions1500.map((q) => [q.id, q])),
  72: new Map(questionsV72.map((q) => [q.id, q])),
};
export const SUPPORTED_BANK_VERSIONS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41,
  42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
  61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72,
] as const;

export interface GameContent {
  bankVersion: number;
  optionOrders?: Record<string, string[]>;
}
function catalog(version: number): ReadonlyMap<string, Question> | undefined {
  return Number.isInteger(version) &&
    version >= 2 &&
    SUPPORTED_BANK_VERSIONS.some((v) => v === version)
    ? catalogs[version]
    : undefined;
}
// Ekranlara sunulan görünüm, o oturumun banka sürümü ve seçenek sırasına bağlıdır.
export function gameQuestion(game: GameContent, id: string) {
  if (game.bankVersion === 1) return legacy.get(id);
  const q = catalog(game.bankVersion)?.get(id);
  const order = game.optionOrders?.[id];
  if (
    !q ||
    !order ||
    order.length !== 4 ||
    new Set(order).size !== 4 ||
    !order.every((option) => q.options.some((o) => o.id === option))
  )
    return undefined;
  return {
    id: q.id,
    category: q.categoryId,
    text: q.question,
    options: order.map(
      (option) => q.options.find((o) => o.id === option)!.text,
    ),
    correct: order.indexOf(q.correctOptionId),
    explanation: q.explanation,
    difficulty: q.difficulty,
    source: q.sources[0]!,
    version: q.version,
    reviewStatus: q.reviewStatus,
  };
}
export function knownQuestion(bankVersion: number, id: string) {
  return bankVersion === 1
    ? legacy.has(id)
    : (catalog(bankVersion)?.has(id) ?? false);
}
// Internal selection history uses the immutable full snapshot, never a current
// replacement for historical scoring. v1 IDs also resolve via the current ID index.
export function historicalQuestion(bankVersion: number, id: string) {
  if (bankVersion === 1) {
    const q = legacy.get(id);
    return q ? { id, question: q.text, categoryId: q.category, conceptGroup: `legacy:${id}` } : undefined;
  }
  return catalog(bankVersion)?.get(id);
}
export function questionCategory(bankVersion: number, id: string) {
  return bankVersion === 1
    ? legacy.get(id)?.category
    : catalog(bankVersion)?.get(id)?.categoryId;
}
