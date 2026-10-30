import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { questionsV72 } from "../src/content/questions/questions-v72";
import {
  belongsToPlayCategory,
  playCategories,
} from "../src/domain/game/play-categories";
import { approvedNewQuestionsV72 } from "../src/content/questions/release-v72-meaning";
import { questionSnapshot } from "./question-snapshot";
import { qualityWarnings } from "./question-quality";
import type { Question } from "../src/content/questions/model";
const folder = "src/content/questions/editorial-v73";
const lines = ["iman-edits.txt", "other-edits.txt", "round2-edits.txt"].flatMap(
  (file) =>
    readFileSync(`${folder}/${file}`, "utf8")
      .split("\n")
      .filter((l) => l && !l.startsWith("#")),
);
const explanations: Record<string, string> = JSON.parse(
  readFileSync(`${folder}/explanations.json`, "utf8"),
);
interface Evidence {
  id: string;
  sourceUrl: string;
  locator: string;
  sourceStatus: string;
  sourceSha256: string;
  humanApproval: boolean;
  claimParaphrase: string;
  checkedAt?: string;
  representation?: string;
}
const sources: Evidence[] = JSON.parse(
  readFileSync(`${folder}/sources.json`, "utf8"),
);
const sourceById = new Map(sources.map((s) => [s.id, s]));
const edits = new Map(
  lines.map((line) => {
    const [id, stem, ...options] = line.split("|");
    if (!id || !stem || options.length !== 4) throw Error(`Invalid edit ${id}`);
    return [id, { stem, options }] as const;
  }),
);
if (edits.size !== lines.length) throw Error("Repeated edit ID");
const protectedIds = new Set(approvedNewQuestionsV72.map((q) => q.id));
// Product-owner permission on 2026-10-30 covers exactly the documented patch
// in PROTECTED-MEANING-QUESTION-PROPOSAL.md, only in this unpublished candidate.
const approvedMeaningPatchSha256 =
  "c838578d533753feb398d9c6f848ad1d505dda6b8f3cbc1bfeeb40dc723c6e1d";
const candidate = questionsV72.map((q): Question => {
  const edit = edits.get(q.id);
  if (!edit) return q;
  if (
    protectedIds.has(q.id) &&
    (q.id !== "quran-meaning-v72-024" ||
      q.version !== 72 ||
      createHash("sha256")
        .update(
          JSON.stringify({
            stem: edit.stem,
            options: edit.options,
            explanation: explanations[q.id],
          }),
        )
        .digest("hex") !== approvedMeaningPatchSha256)
  )
    throw Error(
      "v72 meaning release protected; candidate amendment not approved",
    );
  const proof = sourceById.get(q.id);
  if (!proof || proof.sourceStatus !== "source-compared")
    throw Error(`Source review pending: ${q.id}`);
  const ids = [
    q.correctOptionId,
    ...q.options.filter((o) => o.id !== q.correctOptionId).map((o) => o.id),
  ];
  let options = edit.options.map((text, i) => ({ id: ids[i]!, text }));
  const offset = createHash("sha256").update(q.id).digest()[0]! % 4;
  options = [...options.slice(offset), ...options.slice(0, offset)];
  const question = edit.stem === "=" ? q.question : edit.stem;
  return {
    ...q,
    version: q.version + 1,
    question,
    options: options as unknown as Question["options"],
    explanation: explanations[q.id] ?? q.explanation,
    sources: [
      {
        title: proof.sourceUrl.includes("diyanet")
          ? "Diyanet — Kur’an Yolu Meali"
          : "TDV İslâm Ansiklopedisi",
        publisher: proof.sourceUrl.includes("diyanet")
          ? "Diyanet İşleri Başkanlığı"
          : "Türkiye Diyanet Vakfı",
        url: proof.sourceUrl,
        locator: proof.locator,
        supports: proof.claimParaphrase,
        checkStatus: "supported",
        checkedAt: proof.checkedAt ?? "2026-10-27",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "v73 editoryal aday. Codex kaynak karşılaştırması yapıldı; bağımsız insan editör/uzman ve ürün sahibi yayın onayı değildir.",
    reviewedAt: undefined,
    updatedAt: proof.checkedAt ?? "2026-10-27",
  };
});
for (const id of edits.keys())
  if (!questionsV72.some((q) => q.id === id)) throw Error(`Unknown ID ${id}`);
const nextById = new Map(candidate.map((q) => [q.id, q]));
const inventory = questionsV72.filter((q) =>
  belongsToPlayCategory(q.id, "iman_ahlak"),
);
const report = questionsV72.map((q) => ({
  id: q.id,
  category: playCategories.find((c) => belongsToPlayCategory(q.id, c.id))?.id,
  flags: qualityWarnings(q),
}));
const review = inventory.map((q) => ({
  id: q.id,
  disposition: edits.has(q.id) ? "revised" : "retained",
  reason: edits.has(q.id)
    ? "Tahmin ipucunu azaltmak için konuya bağlı, dil/uzunluğu dengeli seçenekler ve gerektiğinde kesin kaynak bağlamı."
    : "Mevcut kavram ailesindeki dört seçenek ve tek kaynak ayrımı korundu.",
  humanApproval: false,
  sourceStatus: sourceById.get(q.id)?.sourceStatus ?? "pending-source-review",
  oldFlags: qualityWarnings(q),
  newFlags: qualityWarnings(nextById.get(q.id)!),
}));
const positionHistogram = (bank: readonly Question[]) =>
  [0, 1, 2, 3].map(
    (i) => bank.filter((q) => q.options[i]!.id === q.correctOptionId).length,
  );
const out = "docs/editorial-v73";
mkdirSync(out, { recursive: true });
const summary = {
  activeVersion: 72,
  candidateVersion: 73,
  total: candidate.length,
  imanReviewed: inventory.length,
  imanRevised: inventory.filter((q) => edits.has(q.id)).length,
  imanRetained: inventory.filter((q) => !edits.has(q.id)).length,
  otherRevised: edits.size - inventory.filter((q) => edits.has(q.id)).length,
  stemsChanged: inventory.filter(
    (q) => edits.get(q.id) && edits.get(q.id)!.stem !== "=",
  ).length,
  onlyOptionsChanged: inventory.filter((q) => edits.get(q.id)?.stem === "=")
    .length,
  distractorsOnlyChanged: inventory.filter(
    (q) =>
      edits.get(q.id)?.stem === "=" &&
      edits.get(q.id)!.options[0] ===
        q.options.find((o) => o.id === q.correctOptionId)!.text &&
      (explanations[q.id] ?? q.explanation) === q.explanation,
  ).length,
  correctWordingChanged: inventory.filter(
    (q) =>
      edits.has(q.id) &&
      edits.get(q.id)!.options[0] !==
        q.options.find((o) => o.id === q.correctOptionId)!.text,
  ).length,
  explanationsChanged: inventory.filter(
    (q) => explanations[q.id] && explanations[q.id] !== q.explanation,
  ).length,
  automaticFlagsByCategory: Object.fromEntries(
    playCategories.map((c) => [
      c.id,
      report.filter((r) => r.category === c.id && r.flags.length).length,
    ]),
  ),
  sourceCompared: sources.length,
  editedSourceCompared: sources.filter(
    (s) => edits.has(s.id) && s.sourceStatus === "source-compared",
  ).length,
  independentExpertApproved: 0,
  independentExpertPending: edits.size,
  otherSuspicious: report.filter(
    (r) => r.category !== "iman_ahlak" && r.flags.length,
  ).length,
  oldPositionHistogram: positionHistogram(questionsV72),
  candidatePositionHistogram: positionHistogram(candidate),
  humanApproval: false,
  releaseEnabled: false,
  v72FileSha256: createHash("sha256")
    .update(readFileSync("src/content/questions/questions-v72.ts"))
    .digest("hex"),
};
const md = (s: string) => s.replaceAll("|", "\\|").replaceAll("\n", " ");
const header =
  "# v73 — Yayımlanmamış editoryal karşılaştırma\n\nKaynak karşılaştırması Codex tarafından yapıldı; bağımsız insan editör/uzman onayı bekler. Otomatik uyarılar anlam/hüküm denetimi değildir. Aktif v72 değişmedi. PDF sayfaları 1 tabanlıdır.\n\n|ID|Eski soru ve şıklar|Yeni soru ve şıklar|Eski / yeni doğru|Gerekçe|Kaynak ve ilgili kavram|Durum|\n|---|---|---|---|---|---|---|\n";
const tableRow = (before: Question) => {
  const after = nextById.get(before.id)!,
    proof = sourceById.get(before.id)!;
  const options = (q: Question) =>
    q.options.map((o) => `${o.id}: ${o.text}`).join(" / ");
  return `|${before.id}|${md(before.question + " — " + options(before))}|${md(after.question + " — " + options(after))}|${md(before.options.find((o) => o.id === before.correctOptionId)!.text)} / ${md(after.options.find((o) => o.id === after.correctOptionId)!.text)}|${edits.has(before.id) ? "Dengeli/ilgili çeldiriciler; bağlam sınırı" : "Mevcut kavram ayrımı korundu"}|${proof.sourceUrl}<br>${md(proof.locator)}<br>${md(proof.claimParaphrase)}|Kaynak karşılaştırıldı; uzman ve yayın onayı bekliyor|\n`;
};
const highlightIds = [
  "v12-general-004",
  "v13-general-006",
  "q43-nebe-10",
  "q43-mutaffifin-9",
  "q43-mulk-30",
  "q44-duha-10",
  "q53-beled-018",
  "q54-tarik-009",
  "q55-infitar-013",
  "q55-infitar-014",
  "q55-infitar-016",
  "q55-kiyamet-027",
  "q65-isra-36",
  "q65-hadid-2",
  "q62-sadaka-genis",
  "q62-sadaka-soyl",
  "q65-furkan-73",
  "q67-rum-38",
  "e150-general-008",
  "q68-hadis-semail",
];
// Include the two user-requested verse examples by their actual existing IDs.
const examples = questionsV72.filter(
  (q) =>
    edits.has(q.id) &&
    (/Bakara 2\/152|Nahl 16\/90/.test(q.question) ||
      highlightIds.includes(q.id)),
);
const otherWarnings =
  "# Diğer kategoriler — otomatik inceleme kuyruğu\n\nUyarılar kesin kusur veya birden fazla doğru cevabın kanıtı değildir. Bu kuyruk, bütün banka için insan incelemesini yönlendirir.\n\n|ID|Kategori|Soru|Uyarılar|\n|---|---|---|---|\n" +
  report
    .filter((r) => r.category !== "iman_ahlak" && r.flags.length)
    .map(
      (r) =>
        `|${r.id}|${r.category}|${md(originalQuestion(r.id).question)}|${r.flags.map((f) => f.kind).join(", ")}|\n`,
    )
    .join("");
function originalQuestion(id: string) {
  return questionsV72.find((q) => q.id === id)!;
}
const outputs: Record<string, string> = {
  "src/content/questions/questions-v73.candidate.ts": `// UNPUBLISHED v73 candidate. Never import into active index/registry without final approval.\nimport type {Question} from './model';\nexport const questionsV73Candidate: readonly Question[] = ${questionSnapshot(candidate)};\n`,
  [out + "/other-suspicious.md"]: otherWarnings,
  [out + "/automatic-warnings.json"]: JSON.stringify(report, null, 2) + "\n",
  [out + "/iman-review.json"]: JSON.stringify(review, null, 2) + "\n",
  [out + "/summary.json"]: JSON.stringify(summary, null, 2) + "\n",
  [out + "/comparison.md"]:
    header +
    questionsV72
      .filter(
        (q) => edits.has(q.id) || belongsToPlayCategory(q.id, "iman_ahlak"),
      )
      .map(tableRow)
      .join(""),
  [out + "/review-examples.md"]: header + examples.map(tableRow).join(""),
};
if (examples.length < 20)
  throw Error("At least 20 concrete review examples required");
for (const [path, text] of Object.entries(outputs)) {
  if (process.argv.includes("--check")) {
    if (readFileSync(path, "utf8") !== text)
      throw Error(`Stale candidate/report ${path}`);
  } else writeFileSync(path, text);
}
console.log(JSON.stringify(summary));
