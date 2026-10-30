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
import { questionsV73 } from "./questions-v73";
import type { Question } from "./model";

// Banka sürümleri bağımsız çözülür: yeni soru eklemek eski cevapları değiştirmez.
const snapshots: Readonly<Record<number, readonly Question[]>> = {
  2: bankV2,
  3: bankV3,
  4: bankV4,
  5: bankV5,
  6: bankV6,
  7: bankV7,
  8: bankV8,
  9: bankV9,
  10: bankV10,
  11: bankV11,
  12: bankV12,
  13: bankV13,
  14: bankV14,
  15: bankV15,
  16: bankV16,
  17: bankV17,
  18: bankV18,
  19: bankV19,
  20: bankV20,
  21: bankV21,
  22: bankV22,
  23: bankV23,
  24: bankV24,
  25: bankV25,
  26: bankV26,
  27: bankV27,
  28: bankV28,
  29: bankV29,
  30: bankV30,
  31: bankV31,
  32: bankV32,
  33: bankV33,
  34: bankV34,
  35: bankV35,
  36: bankV36,
  37: bankV37,
  38: bankV38,
  39: bankV39,
  40: bankV40,
  41: bankV41,
  42: bankV42,
  43: bankV43,
  44: bankV44,
  45: bankV45,
  46: bankV46,
  47: bankV47,
  48: bankV48,
  49: bankV49,
  50: bankV50,
  51: bankV51,
  52: bankV52,
  53: bankV53,
  54: bankV54,
  55: bankV55,
  56: bankV56,
  57: bankV57,
  58: bankV58,
  59: bankV59,
  60: bankV60,
  61: bankV61,
  62: bankV62,
  63: bankV63,
  64: bankV64,
  65: bankV65,
  66: bankV66,
  67: bankV67,
  68: bankV68,
  69: bankV69,
  70: bankV70,
  71: questions1500,
  72: questionsV72,
  73: questionsV73,
};
export const SUPPORTED_BANK_VERSIONS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41,
  42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
  61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73,
] as const;

export interface GameContent {
  bankVersion: number;
  optionOrders?: Record<string, string[]>;
}
// Build only the indexes a player actually reads. Loading every historical
// map up front adds avoidable Android startup/GC work; snapshots remain frozen.
const loadedCatalogs = new Map<number, ReadonlyMap<string, Question>>();
function catalog(version: number): ReadonlyMap<string, Question> | undefined {
  if (!Number.isInteger(version) || version < 2 || !snapshots[version])
    return undefined;
  const loaded = loadedCatalogs.get(version);
  if (loaded) return loaded;
  const index = new Map(snapshots[version]!.map((q) => [q.id, q]));
  loadedCatalogs.set(version, index);
  return index;
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
    return q
      ? {
          id,
          question: q.text,
          categoryId: q.category,
          conceptGroup: `legacy:${id}`,
        }
      : undefined;
  }
  return catalog(bankVersion)?.get(id);
}
export function questionCategory(bankVersion: number, id: string) {
  return bankVersion === 1
    ? legacy.get(id)?.category
    : catalog(bankVersion)?.get(id)?.categoryId;
}
