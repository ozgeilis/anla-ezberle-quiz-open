import type { Question } from "../model";
import { bankV5 } from "./bank-v5";

// V5 is immutable. Only the three deliberately wrong numeric choices change;
// the correct option ID, answer, factual question, source and concept stay fixed.
// Earlier verse-count choices all exceeded the true answer (a guessing shortcut).
export const v6VerseCountDistractors: Readonly<Record<string, readonly [number, number, number]>> = {
  "e150-quran-001": [206, 213, 219], // correct: 200
  "e150-quran-003": [164, 170, 182], // correct: 176
  "e150-quran-005": [113, 126, 134], // correct: 120
  "e150-quran-007": [152, 158, 163], // correct: 165
  "e150-quran-009": [199, 213, 221], // correct: 206
  "e150-quran-011": [79, 84, 91], // correct: 75
  "e150-quran-013": [114, 121, 126], // correct: 129
  "e150-quran-015": [99, 105, 116], // correct: 109
  "e150-quran-017": [112, 119, 130], // correct: 123
  "e150-quran-019": [104, 118, 129], // correct: 111
  "e150-quran-021": [47, 54, 62], // correct: 43
  "e150-quran-023": [40, 46, 49], // correct: 52
  "e150-quran-025": [84, 92, 97], // correct: 99
  "e150-quran-027": [135, 143, 151], // correct: 128
  "e150-quran-029": [102, 115, 124], // correct: 111
  "e150-quran-031": [98, 106, 119], // correct: 110
  "e150-quran-033": [104, 112, 121], // correct: 98
  "e150-quran-035": [121, 129, 133], // correct: 135
  "e150-quran-037": [101, 107, 120], // correct: 112
  "e150-quran-039": [72, 85, 96], // correct: 78
};

export const bankV6: readonly Question[] = bankV5.map((q): Question => {
  const distractors = v6VerseCountDistractors[q.id];
  if (!distractors) return q;
  let wrongIndex = 0;
  const options = q.options.map((option) =>
    option.id === q.correctOptionId
      ? option
      : { ...option, text: String(distractors[wrongIndex++]!) },
  ) as unknown as Question["options"];
  return {
    ...q,
    version: q.version + 1,
    options,
    updatedAt: "2026-10-19",
    reviewNotes: q.reviewNotes +
      " v6: Sayısal yanlış seçenekler, cevap bilgisi ve kaynak değişmeden dengelendi.",
  };
});
