import type { Question } from "../src/content/questions/model";
export type QualityFlag = { kind: string; detail: string };
export const normalizeOptionText = (s: string) =>
  s
    .normalize("NFKC")
    .toLocaleLowerCase("tr-TR")
    .replace(/[^\p{L}\p{N} ]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
const clean = normalizeOptionText;
const containsPhrase = (text: string, phrases: readonly string[]) =>
  phrases.some((phrase) => ` ${clean(text)} `.includes(` ${phrase} `));
const restrictivePhrases = [
  "yalnız",
  "yalnızca",
  "sadece",
  "sırf",
  "tek başına",
  "salt",
  "ancak",
  "bir tek",
] as const;
const absolutePhrases = [
  "her zaman",
  "asla",
  "hiçbir zaman",
  "kesinlikle",
  "mutlaka",
  "daima",
  "tamamen",
  "bütün",
  "herkes",
  "herkesin",
  "herkese",
  "herkesi",
  "herkesten",
  "hiç kimse",
  "hiç kimsenin",
  "hiç kimseye",
  "hiç kimseyi",
  "hiç kimseden",
] as const;
export const optionStyleSignals = (text: string) => ({
  restrictive: containsPhrase(text, restrictivePhrases),
  absolute: containsPhrase(text, absolutePhrases),
});
const bad =
  /kibir|haksız|hile|alay|iftira|gıybet|zarar|küçümse|öldür|yalan|zul|azarl|nankör|savurgan|israf|kırıcı|çekiştir|böbür|inkâr|korkut|başkalarını suçla|ihanet/iu;
const good =
  /yardım|adalet|merhamet|iyilik|şük|şükür|sabır|sabret|doğru|koru|gözet|paylaş|şefkat|öğren|iyiye|güzel|mütevaz|alçak gönül|iman|bağış/iu;
const semanticSets = [
  ["kıyamet günü", "hesap günü", "mahşer günü", "toplanma günü"],
  ["örtü", "perde", "gölgelik"],
  ["cömertlik", "eli açıklık"],
  ["böbürlenmek", "kibirlenmek"],
];
/** Review signals, never an approval/rejection or a theological truth engine. */
export function qualityWarnings(q: Question): QualityFlag[] {
  const f: QualityFlag[] = [];
  const texts = q.options.map((o) => o.text),
    norm = texts.map(clean);
  const correct = q.options.findIndex((o) => o.id === q.correctOptionId);
  const styles = texts.map(optionStyleSignals);
  const add = (kind: string, detail: string) => f.push({ kind, detail });
  const tones = norm.map((t) => (bad.test(t) ? -1 : good.test(t) ? 1 : 0));
  if (tones.filter((x) => x === -1).length === 3 && tones.includes(1))
    add("tone-3-negative", "Üç olumsuz, bir olumlu sözcük kümesi");
  if (tones.filter((x) => x === 1).length === 3 && tones.includes(-1))
    add("tone-3-positive", "Üç olumlu, bir olumsuz sözcük kümesi");
  const lens = texts.map((t) => t.length).sort((a, b) => a - b);
  if (lens[3]! > Math.max(24, lens[2]! * 1.7) || lens[0]! < lens[1]! * 0.45)
    add("length-outlier", "Tek belirgin uzun/kısa seçenek");
  if (new Set(norm).size < 4) add("duplicate", "Aynı normalize seçenek");
  if (styles.filter((s) => s.restrictive || s.absolute).length >= 2)
    add("absolute-language", "Birden fazla mutlak sınırlayıcı ifade");
  for (const key of ["restrictive", "absolute"] as const) {
    const count = styles.filter((s) => s[key]).length;
    if (count === 3 && !styles[correct]?.[key])
      add(
        `three-${key}-distractors`,
        "Üç yanlış seçenekte ortak sınırlayıcı/mutlaklık, doğru seçenekte yok; anlamsal inceleme gerekir",
      );
    if (count === 1 && styles[correct]?.[key])
      add(
        `only-correct-${key}`,
        "Doğru cevap tek sınırlayıcı/mutlak ifade; ifade tek başına hata değildir",
      );
  }
  const firstWords = norm.map((n) => n.split(" ")[0]);
  if (
    firstWords.filter((w) => w !== firstWords[correct]).length === 3 &&
    new Set(firstWords.filter((_, i) => i !== correct)).size === 1
  )
    add(
      "correct-prefix-outlier",
      "Üç yanlış aynı sözcükle başlıyor, doğru cevap farklı; yalnız biçimsel uyarı",
    );
  const off = texts.filter((t) =>
    /tüccar|hükümdar|saray|ticaret|gemi|şehir|bilet|kervan/iu.test(t),
  );
  if (
    off.length >= 2 &&
    !/ticaret|yolculuk|savaş|tarih|kazanç|deniz|gemi|kervan/iu.test(q.question)
  )
    add(
      "domain-mismatch",
      "Kök bağlamına göre meslek/mekân çeldiricileri incelenmeli",
    );
  const shape = texts.map((t) =>
    /m[ae]k(?:\s|$)/iu.test(t)
      ? "infinitive"
      : /m[ae]s[ıi]/iu.test(t)
        ? "verbal-noun"
        : "other",
  );
  if (
    new Set(shape).size > 1 &&
    shape.some((x) => shape.filter((y) => y === x).length === 1)
  )
    add("grammar-shape", "Fiil/isim biçimleri arasında tekil ayrışma");
  for (const set of semanticSets)
    if (norm.filter((n) => set.includes(n)).length > 1) {
      add(
        "possible-synonyms",
        "Yakın anlamlı kavramlar birden fazla cevaba işaret edebilir",
      );
      break;
    }
  if (
    /hangisi.*(iyi|doğru)|hangi davranış.*(güzel|uygun)|tavsiye edilir|hangisi.*öğütlerindendir|hangisi yapılmalıdır/iu.test(
      q.question,
    )
  )
    add(
      "broad-stem",
      "Kaynak/bağlam sınırı ve birden fazla doğru ihtimali incelenmeli",
    );
  const termOverlap = norm.map(
    (n) => new Set(n.split(" ").filter((w) => w.length > 4)),
  );
  for (let i = 0; i < 4; i++)
    for (let j = i + 1; j < 4; j++) {
      const a = termOverlap[i]!,
        b = termOverlap[j]!;
      if (
        a.size &&
        b.size &&
        [...a].filter((x) => b.has(x)).length / Math.min(a.size, b.size) > 0.85
      )
        add(
          "semantic-overlap",
          "Ortak anahtar sözcükler: eş anlam/alt küme/çoklu doğru incelemesi",
        );
    }
  return f;
}

/** Deliberately knowledge-free guesser. Abstains when cues conflict; not a truth test. */
export function styleOnlyGuess(q: Pick<Question, "options">): string | null {
  const signals = q.options.map((o) => optionStyleSignals(o.text));
  const guesses = new Set<number>();
  for (const key of ["restrictive", "absolute"] as const) {
    if (signals.filter((s) => s[key]).length === 3)
      guesses.add(signals.findIndex((s) => !s[key]));
  }
  const tones = q.options.map((o) =>
    bad.test(clean(o.text)) ? -1 : good.test(clean(o.text)) ? 1 : 0,
  );
  if (tones.filter((x) => x === -1).length === 3 && tones.includes(1))
    guesses.add(tones.indexOf(1));
  const lengths = q.options.map((o) => [...o.text].length);
  const sorted = [...lengths].sort((a, b) => a - b);
  if (sorted[3]! > Math.max(24, sorted[2]! * 1.7))
    guesses.add(lengths.indexOf(sorted[3]!));
  return guesses.size === 1 ? q.options[[...guesses][0]!]!.id : null;
}
