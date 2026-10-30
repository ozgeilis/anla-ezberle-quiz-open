import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { questionsV72 } from "../src/content/questions/questions-v72";
import { questionsV73Candidate } from "../src/content/questions/questions-v73.candidate";
import {
  playCategories,
  belongsToPlayCategory,
} from "../src/domain/game/play-categories";
import { qualityWarnings, styleOnlyGuess } from "./question-quality";
import type { Question } from "../src/content/questions/model";
import { editorialOverlap, type OverlapDecision } from "./editorial-overlap";

export interface EditorialDecision {
  id: string;
  reviewedCandidateSha256: string;
  disposition: "retained" | "revised" | "blocked";
  defects: string[];
  reason: string;
  optionReview: Record<string, string>;
  explanationReview: string;
  ambiguityReview: string;
  difficultyReview: string;
  duplicateReview: string;
  source: {
    status: "compared" | "pending";
    url: string;
    locator: string;
    note: string;
    readAt?: string;
    sourceSha256?: string;
  };
}
export const auditSnapshot = (q: Question) =>
  createHash("sha256")
    .update(
      JSON.stringify({
        question: q.question,
        options: q.options,
        correctOptionId: q.correctOptionId,
        explanation: q.explanation,
        sources: q.sources,
        difficulty: q.difficulty,
      }),
    )
    .digest("hex");

const folder = "src/content/questions/editorial-v73";
const priority: string[] = JSON.parse(
  readFileSync(`${folder}/round2-priority.json`, "utf8"),
);
const decisions: EditorialDecision[] = JSON.parse(
  readFileSync(`${folder}/round2-decisions.json`, "utf8"),
);
const original = new Map(questionsV72.map((q) => [q.id, q]));
const next = new Map(questionsV73Candidate.map((q) => [q.id, q]));
if (
  priority.length !== 220 ||
  new Set(priority).size !== 220 ||
  priority.some((id) => !original.has(id))
)
  throw Error("Original 220-question priority queue changed");
const byId = new Map(decisions.map((d) => [d.id, d]));
const overlap = editorialOverlap(
  questionsV73Candidate,
  JSON.parse(
    readFileSync(`${folder}/round2-overlap-decisions.json`, "utf8"),
  ) as OverlapDecision[],
);
if (byId.size !== decisions.length) throw Error("Repeated editorial decision");
for (const d of decisions) {
  const q = next.get(d.id);
  if (!q || auditSnapshot(q) !== d.reviewedCandidateSha256)
    throw Error(`Decision needs re-review after candidate change: ${d.id}`);
  if (
    !d.reason ||
    !d.explanationReview ||
    !d.ambiguityReview ||
    !d.difficultyReview ||
    !d.duplicateReview ||
    q.options.some((o) => !d.optionReview[o.id]) ||
    Object.keys(d.optionReview).length !== 4
  )
    throw Error(`Incomplete semantic review: ${d.id}`);
  if (
    !["retained", "revised", "blocked"].includes(d.disposition) ||
    !["compared", "pending"].includes(d.source.status)
  )
    throw Error(`Invalid review status: ${d.id}`);
  if (
    d.source.status === "compared" &&
    (!d.source.readAt ||
      !d.source.locator ||
      !d.source.url ||
      !/^[a-f0-9]{64}$/.test(d.source.sourceSha256 ?? ""))
  )
    throw Error(`Missing source reading evidence: ${d.id}`);
}
const order = [
  ...priority,
  ...questionsV72.map((q) => q.id).filter((id) => !priority.includes(id)),
];
const records = order.map((id, i) => {
  const old = original.get(id)!,
    candidate = next.get(id)!;
  const category = playCategories.find((c) => belongsToPlayCategory(id, c.id));
  if (!category) throw Error(`Missing current category: ${id}`);
  return {
    sequence: i + 1,
    sourceSequence: questionsV72.findIndex((q) => q.id === id) + 1,
    id,
    category: category.id,
    difficulty: candidate.difficulty,
    priorityFromRound1: i < 220,
    before: {
      question: old.question,
      options: old.options,
      correctOptionId: old.correctOptionId,
      correctAnswer: old.options.find((o) => o.id === old.correctOptionId)!
        .text,
      explanation: old.explanation,
      sources: old.sources,
    },
    after: {
      question: candidate.question,
      options: candidate.options,
      correctOptionId: candidate.correctOptionId,
      correctAnswer: candidate.options.find(
        (o) => o.id === candidate.correctOptionId,
      )!.text,
      explanation: candidate.explanation,
      sources: candidate.sources,
    },
    automaticBefore: qualityWarnings(old),
    automaticAfter: qualityWarnings(candidate),
    semanticReview: byId.has(id) ? "reviewed-by-codex" : "pending",
    decision: byId.get(id) ?? null,
    independentExpertApproval: false,
    publicationApproval: false,
  };
});
if (records.length !== 1500 || new Set(records.map((r) => r.id)).size !== 1500)
  throw Error("Audit must cover exactly 1,500 unique current questions");
const statsFor = (rows: typeof records) => ({
  total: rows.length,
  individuallyReviewed: rows.filter((r) => r.decision).length,
  pendingReview: rows.filter((r) => !r.decision).length,
  sourceComparedThisRound: rows.filter(
    (r) => r.decision?.source.status === "compared",
  ).length,
  blocked: rows.filter((r) => r.decision?.disposition === "blocked").length,
  flaggedBefore: rows.filter((r) => r.automaticBefore.length).length,
  flaggedAfter: rows.filter((r) => r.automaticAfter.length).length,
});
const guessResults = (bank: readonly Question[]) => {
  let guessed = 0,
    correct = 0;
  for (const q of bank) {
    const choice = styleOnlyGuess(q);
    if (choice) {
      guessed++;
      if (choice === q.correctOptionId) correct++;
    }
  }
  return {
    guessed,
    correct,
    abstained: bank.length - guessed,
    conditionalAccuracy: guessed ? correct / guessed : null,
    limitation:
      "Lexical cues only, no religious knowledge; not a correctness or editorial approval test",
  };
};
const optionTextChanged = (id: string) => {
  const before = original.get(id)!,
    after = next.get(id)!;
  return before.options.some(
    (o) => after.options.find((a) => a.id === o.id)?.text !== o.text,
  );
};
const contentChanged = (id: string) => {
  const before = original.get(id)!,
    after = next.get(id)!;
  return (
    before.question !== after.question ||
    before.explanation !== after.explanation ||
    optionTextChanged(id)
  );
};
const multipleCorrectRiskCodes = new Set([
  "possible-multiple-correct",
  "possible-subset-overlap",
  "overlapping-groups",
  "overlapping-options",
  "geographic-option-ambiguity",
]);
const recordedMultipleCorrectRisks = decisions.filter((d) =>
  d.defects.some((code) => multipleCorrectRiskCodes.has(code)),
);

const summary = {
  reviewRound: 2,
  activeBankVersion: 72,
  candidateBankVersion: 73,
  ...statsFor(records),
  previousPriorityCount: 220,
  revisedAgainstV72: records.filter((r) => contentChanged(r.id)).length,
  stemsChangedAgainstV72: records.filter(
    (r) => r.before.question !== r.after.question,
  ).length,
  correctAnswerWordingChangedAgainstV72: records.filter(
    (r) => r.before.correctAnswer !== r.after.correctAnswer,
  ).length,
  explanationsChangedAgainstV72: records.filter(
    (r) => r.before.explanation !== r.after.explanation,
  ).length,
  distractorsOnlyChangedAgainstV72: records.filter(
    (r) =>
      optionTextChanged(r.id) &&
      r.before.question === r.after.question &&
      r.before.correctAnswer === r.after.correctAnswer &&
      r.before.explanation === r.after.explanation,
  ).length,
  automaticPatternCounts: Object.fromEntries(
    [
      "three-restrictive-distractors",
      "only-correct-restrictive",
      "three-absolute-distractors",
      "only-correct-absolute",
      "tone-3-negative",
      "tone-3-positive",
      "length-outlier",
      "possible-synonyms",
      "duplicate",
    ].map((kind) => [
      kind,
      {
        before: records.filter((r) =>
          r.automaticBefore.some((f) => f.kind === kind),
        ).length,
        after: records.filter((r) =>
          r.automaticAfter.some((f) => f.kind === kind),
        ).length,
      },
    ]),
  ),
  byCategory: Object.fromEntries(
    playCategories.map((c) => [
      c.id,
      statsFor(records.filter((r) => r.category === c.id)),
    ]),
  ),
  byDifficulty: Object.fromEntries(
    ["easy", "medium", "hard"].map((d) => [
      d,
      statsFor(records.filter((r) => r.difficulty === d)),
    ]),
  ),
  styleOnlyGuesser: {
    before: guessResults(questionsV72),
    after: guessResults(questionsV73Candidate),
  },
  criticalRemaining: records.some((r) => !r.decision)
    ? "not-yet-determined: individual review incomplete"
    : "requires independent editorial decision",
  recordedMultipleCorrectRisks: {
    method:
      "Unique individual semantic decisions with the listed risk tags; not an exhaustive automatic truth claim",
    codes: [...multipleCorrectRiskCodes],
    recorded: recordedMultipleCorrectRisks.length,
    stillBlocked: recordedMultipleCorrectRisks.filter(
      (d) => d.disposition === "blocked",
    ).length,
  },
  knownBlockingQuestions: records.filter(
    (r) => r.decision?.disposition === "blocked",
  ).length,
  overlapReview: {
    candidatePairs: overlap.candidatePairs,
    automaticCandidatePairs: overlap.automaticCandidatePairs,
    retainedExplicitPairs: overlap.retainedExplicitPairs,
    individuallyReviewedPairs: overlap.individuallyReviewedPairs,
    repeatedFactPairs: overlap.repeatedFactPairs,
    pendingPairs: overlap.pendingPairs,
  },
  independentExpertApproved: 0,
  publicationApproved: false,
  releaseEnabled: false,
};
const out = "docs/editorial-v73/batches";
mkdirSync(out, { recursive: true });
const outputs: Record<string, string> = {};
outputs["docs/editorial-v73/round2-overlap-review.json"] =
  JSON.stringify(overlap, null, 2) + "\n";
for (let i = 0; i < 30; i++) {
  const start = i * 50 + 1,
    end = start + 49;
  const batch = records.slice(start - 1, end);
  if (batch.length !== 50)
    throw Error("Batch must contain exactly 50 questions");
  outputs[
    `${out}/${String(start).padStart(4, "0")}-${String(end).padStart(4, "0")}.json`
  ] =
    JSON.stringify(
      { batch: i + 1, start, end, ...statsFor(batch), records: batch },
      null,
      2,
    ) + "\n";
}
outputs["docs/editorial-v73/audit-round2-summary.json"] =
  JSON.stringify(summary, null, 2) + "\n";
outputs["docs/editorial-v73/audit-round2-index.json"] =
  JSON.stringify(
    records.map(
      ({
        sequence,
        sourceSequence,
        id,
        category,
        difficulty,
        semanticReview,
      }) => ({
        sequence,
        sourceSequence,
        id,
        category,
        difficulty,
        semanticReview,
      }),
    ),
    null,
    2,
  ) + "\n";
const round2Ids = new Set(
  readFileSync(`${folder}/round2-edits.txt`, "utf8")
    .split("\n")
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => line.split("|")[0]),
);
const revisedThisRound = records.filter((r) => round2Ids.has(r.id));
const escapeMd = (text: string) =>
  text.replaceAll("|", "\\|").replaceAll("\n", " ");
const table = (rows: typeof records) =>
  "| ID | Eski kök ve dört şık | Yeni kök ve dört şık | Doğru: eski → yeni | Gerekçe | Kaynak / konum | Durum |\n|---|---|---|---|---|---|---|\n" +
  rows
    .map((r) => {
      const view = (q: typeof r.before) =>
        escapeMd(
          q.question +
            " — " +
            q.options.map((o) => `${o.id}: ${o.text}`).join(" / "),
        );
      return `|${r.id}|${view(r.before)}|${view(r.after)}|${escapeMd(r.before.correctAnswer + " → " + r.after.correctAnswer)}|${escapeMd(r.decision?.reason ?? "İkinci tur karar kaydı henüz yok")}|${r.decision?.source.url ?? r.after.sources[0]?.url}<br>${escapeMd(r.decision?.source.locator ?? "")}|${r.decision?.source.status === "compared" ? "Kaynak pasajı okundu; uzman/yayın onayı yok" : "Kaynak karşılaştırması bekliyor"}|\n`;
    })
    .join("");
const reportHeader = `# v73 ikinci tur — yayımlanmamış içerik düzeltmeleri\n\nBu rapor yalnız ikinci turdaki gerçek metin düzeltmeleridir. Şıkların yer değiştirmesi düzeltme sayılmaz. Bireysel inceleme ${summary.individuallyReviewed}/1500; kaynak karşılaştırması ${summary.sourceComparedThisRound}/1500. Bloke kayıt ${summary.blocked}; banka çapı tekrar incelemesi ve bağımsız kabul ayrıdır. Bu belge yayın onayı değildir. Önceki 271 değişiklik tam comparison.md içinde korunur.\n\n`;
outputs["docs/editorial-v73/round2-comparison.md"] =
  reportHeader + table(revisedThisRound);
const weight = (r: (typeof records)[number]) =>
  r.automaticBefore.reduce(
    (n, f) => n + (/three-|tone-|length-outlier/.test(f.kind) ? 3 : 1),
    0,
  ) +
  (r.decision?.defects.length ?? 0) +
  (r.decision?.defects.some((defect) =>
    /answer-source-mismatch|multiple-correct|ambiguous-context/.test(defect),
  )
    ? 20
    : 0);
outputs["docs/editorial-v73/round2-top30.md"] =
  reportHeader +
  table(
    [...revisedThisRound]
      .sort((a, b) => weight(b) - weight(a) || a.sequence - b.sequence)
      .slice(0, 30),
  );
outputs["docs/editorial-v73/round2-open-items.md"] =
  "# İkinci tur açık kontroller\n\n" +
  `Bireysel inceleme bekleyen: **${summary.pendingReview}**. İncelenmiş ama bu tur kaynak karşılaştırması bekleyen: **${summary.individuallyReviewed - summary.sourceComparedThisRound}**. Bu liste yayın onayı değildir.\n\n` +
  "## Bloke kararlar\n\n" +
  records
    .filter((r) => r.decision?.disposition === "blocked")
    .map(
      (r) =>
        `- **${r.id}** (${r.category}): ${r.decision!.ambiguityReview} ${r.decision!.reason}\n`,
    )
    .join("") +
  "\nKorunan sorudaki [onaylanan düzeltme](PROTECTED-MEANING-QUESTION-PROPOSAL.md) yalnız v73 adayına uygulandı. Aktif v72 ve diğer 29 anlam sorusu korunur; yayın izni verilmedi.\n\n## İncelenenlerde kaynak karşılaştırması bekleyenler\n\n" +
  records
    .filter((r) => r.decision?.source.status === "pending")
    .map(
      (r) =>
        `- ${r.id}: [kaynak](${r.decision!.source.url}) — ${r.decision!.source.note}\n`,
    )
    .join("") +
  `\n## Banka çapında ek tekrar kontrolü\n\n${overlap.automaticCandidatePairs} güncel sözcük benzerliği önerisi ve eşik dışından korunan/elle eklenen ${overlap.retainedExplicitPairs} çift dahil toplam ${overlap.candidatePairs} çiftin ${overlap.individuallyReviewedPairs} tanesi ayrıca karşılaştırıldı; ${overlap.repeatedFactPairs} çiftte aynı bilgi tekrar soruluyor. İki aşamada 23 + 23 aynı-bilgi tekrarı ayrı kaynak hedefleriyle yeniden yazıldı; ikinci aşama önceki 19 açığı ve son okumada belirlenen dört ek çifti kapsar. Kalan ${overlap.pendingPairs} çift kararı bekliyor. Ayrı [çift kayıtları](round2-overlap-review.json) eşik altına düşen düzeltilmiş çiftleri de saklar. Yakın âyet, kişi veya olay bağlamı bulunan ancak farklı hedef soran çiftler gerekçeyle korunur; karşılıklı ipucu ihtimali de not edilir. Benzerlik taramasının üretemediği eş anlamlı kökler olabilir; bu araç bütün anlamsal tekrarların bulunmuş olduğu garantisini vermez.\n\n## Mevcut zorluk sınırı\n\nİman/Ahlak zor havuzu v72’de ve adayda 7 sorudur; mevcut 10 bağımsız soruluk zor tur açılamaz. Zorluk etiketleri onaysız değiştirilmedi. Adayın 18 kategori/zorluk birleşimi v72 ile karşılaştırılır; 17 kullanılabilir birleşim ve bu mevcut engel korunur.\n\n## Aynı bilgi içeren açık çiftler\n\n${overlap.records
    .filter((r) => r.decision?.verdict === "repeated-fact")
    .map((r) => `- **${r.a} / ${r.b}**: ${r.decision!.reason}`)
    .join(
      "\n",
    )}\n\nHer sorunun dört şık değerlendirmesi 30 paketlik kayıtta tutulur. Bağımsız uzman onayı ve adayla gerçek cihaz/çevrimiçi oyun kabulü tamamlanmadı.\n`;
for (const [path, value] of Object.entries(outputs)) {
  if (process.argv.includes("--check")) {
    if (readFileSync(path, "utf8") !== value)
      throw Error(`Stale audit output: ${path}`);
  } else writeFileSync(path, value);
}
console.log(JSON.stringify(summary));
