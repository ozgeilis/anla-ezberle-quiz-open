import type { Question } from "../src/content/questions/model";
export type QualityFlag = { kind: string; detail: string };
const clean = (s: string) =>
  s
    .toLocaleLowerCase("tr-TR")
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N} ]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
const bad =
  /kibir|haksız|hile|alay|iftira|gıybet|zarar|küçümse|öldür|yalan|zul|azarl|nankör|savurgan|israf|kırıcı|çekiştir|böbür|inkâr|korkut|başkalarını suçla|ihanet/iu;
const good =
  /yardım|adalet|merhamet|iyilik|şük|şükür|sabır|sabret|doğru|koru|gözet|paylaş|şefkat|öğren|iyiye|güzel|mütevaz|alçak gönül|iman|bağış/iu;
const absolute =
  /\b(asla|daima|sadece|yalnız)\b|her zaman|hiçbir zaman|tamamen/iu;
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
  if (texts.filter((t) => absolute.test(t)).length >= 2)
    add("absolute-language", "Birden fazla mutlak sınırlayıcı ifade");
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
    /hangisi.*(iyi|doğru)|hangi davranış.*(güzel|uygun)|tavsiye edilir/iu.test(
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
