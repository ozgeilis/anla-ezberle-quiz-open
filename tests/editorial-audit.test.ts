import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";
import { questionsV72 } from "../src/content/questions/questions-v72";
import { questionsV73Candidate } from "../src/content/questions/questions-v73.candidate";
import { belongsToPlayCategory } from "../src/domain/game/play-categories";
import {
  normalizeOptionText,
  optionStyleSignals,
  qualityWarnings,
  styleOnlyGuess,
} from "../scripts/question-quality";
import { buildOnlineContentRows } from "../scripts/online-content-export";
import { gameQuestion } from "../src/content/questions/registry";

const probe = (texts: [string, string, string, string], correctIndex = 3) => ({
  ...questionsV72[0]!,
  question: "Kaynakta hangi kavram anlatılır?",
  correctOptionId: `o${correctIndex + 1}`,
  options: texts.map((text, i) => ({
    id: `o${i + 1}`,
    text,
  })) as unknown as (typeof questionsV72)[number]["options"],
});
test("Turkish phrase boundaries detect the three restrictive distractors, including uppercase and punctuation", () => {
  assert.equal(normalizeOptionText("YALNIZCA, İYİLİK!"), "yalnızca iyilik");
  for (const phrase of [
    "YALNIZ",
    "Yalnızca",
    "SADECE",
    "Sırf",
    "Tek başına",
    "Salt",
    "Ancak",
    "Bir tek",
  ]) {
    const q = probe([
      `${phrase} sabır`,
      `${phrase} şükür`,
      `${phrase} kanaat`,
      "Tevazu",
    ]);
    assert(
      qualityWarnings(q).some(
        (f) => f.kind === "three-restrictive-distractors",
      ),
      phrase,
    );
    assert.equal(styleOnlyGuess(q), "o4", phrase);
  }
  assert.equal(optionStyleSignals("Yalnızlık ve sadelik").restrictive, false);
  assert.equal(optionStyleSignals("Bütünlük ve daimilik").absolute, false);
  assert.equal(optionStyleSignals("HİÇ KİMSENİN söylememesi").absolute, true);
  assert.equal(optionStyleSignals("Herkese mutlaka vermek").absolute, true);
});
test("Absolute and reversed cues are review warnings; balanced use is not a three-distractor cue", () => {
  const absolute = probe([
    "Her zaman beklemek",
    "Hiçbir zaman konuşmamak",
    "KESİNLİKLE, yazmak",
    "Araştırmak",
  ]);
  assert(
    qualityWarnings(absolute).some(
      (f) => f.kind === "three-absolute-distractors",
    ),
  );
  const inverse = probe(["Sabır", "Şükür", "Kanaat", "Yalnızca tevazu"]);
  assert(
    qualityWarnings(inverse).some((f) => f.kind === "only-correct-restrictive"),
  );
  assert.equal(styleOnlyGuess(inverse), null);
  const balanced = probe([
    "Yalnız sabır",
    "Yalnız şükür",
    "Yalnız kanaat",
    "Yalnız tevazu",
  ]);
  assert(!qualityWarnings(balanced).some((f) => f.kind.startsWith("three-")));
  assert.equal(styleOnlyGuess(balanced), null);
});
test("The style-only heuristic never reads the answer key and abstains on conflicting signals", () => {
  const q = probe([
    "Yalnız sabır",
    "Sadece şükür",
    "Yalnızca kanaat",
    "Tevazu",
  ]);
  const changedAnswerKey = { ...q, correctOptionId: "o1" };
  assert.equal(
    styleOnlyGuess({ options: q.options }),
    styleOnlyGuess(changedAnswerKey),
  );
  const conflict = probe([
    "Sadece çok uzun ve ayrıntılı bir anlatımla burada açıklanan sabır ve dayanıklılık davranışı",
    "Yalnız şükür",
    "Yalnız kanaat",
    "Tevazu",
  ]);
  assert.equal(styleOnlyGuess(conflict), null);
});
test("Thirty reproducible batches cover all 1,500 actual category memberships; pending is never counted as reviewed", () => {
  const files = readdirSync("docs/editorial-v73/batches")
    .filter((f) => f.endsWith(".json"))
    .sort();
  assert.equal(files.length, 30);
  const rows = files.flatMap((f) => {
    const batch = JSON.parse(
      readFileSync(`docs/editorial-v73/batches/${f}`, "utf8"),
    );
    assert.equal(batch.records.length, 50);
    assert.equal(batch.individuallyReviewed + batch.pendingReview, 50);
    return batch.records as {
      id: string;
      category: string;
      sequence: number;
      semanticReview: string;
      decision: null | {
        reviewedCandidateSha256: string;
        optionReview: Record<string, string>;
      };
      independentExpertApproval: boolean;
      publicationApproval: boolean;
    }[];
  });
  assert.equal(rows.length, 1500);
  assert.deepEqual(
    new Set(rows.map((r) => r.id)),
    new Set(questionsV72.map((q) => q.id)),
  );
  assert.equal(questionsV73Candidate.length, 1500);
  rows.forEach((r, i) => {
    assert.equal(r.sequence, i + 1);
    assert(
      belongsToPlayCategory(
        r.id,
        r.category as Parameters<typeof belongsToPlayCategory>[1],
      ),
      r.id,
    );
    assert.equal(r.semanticReview === "reviewed-by-codex", r.decision !== null);
    assert.equal(r.independentExpertApproval, false);
    assert.equal(r.publicationApproval, false);
  });
  execFileSync(
    process.execPath,
    ["--import", "tsx", "scripts/build-editorial-audit.ts", "--check"],
    { stdio: "pipe" },
  );
});

test("The draft v73 cannot pass the unchanged canonical online export approval gate", () => {
  assert.throws(
    () => buildOnlineContentRows(questionsV73Candidate),
    /Source\/conditional-approval gate|Only the unchanged canonical v72/,
  );
});

test("A source correction changes only the draft text; historical v72 still resolves its saved answer and order", () => {
  const id = "q67-ankebut-40";
  const old = questionsV72.find((q) => q.id === id)!;
  const candidate = questionsV73Candidate.find((q) => q.id === id)!;
  assert.equal(
    candidate.options.find((o) => o.id === candidate.correctOptionId)?.text,
    "Korkunç ses",
  );
  assert.equal(candidate.correctOptionId, old.correctOptionId);
  assert.equal(candidate.version, old.version + 1);
  assert.equal(candidate.reviewStatus, "draft");
  const savedOrder = old.options.map((o) => o.id).reverse();
  const replay = gameQuestion(
    { bankVersion: 72, optionOrders: { [id]: savedOrder } },
    id,
  )!;
  assert.equal(replay.correct, savedOrder.indexOf(old.correctOptionId));
  assert.equal(replay.options[replay.correct], "Şiddetli sarsıntı");
  assert.equal(replay.text, old.question);
});

test("The Nuh three-restrictive-option regression is removed in the draft without rewriting its historical question", () => {
  const id = "q57-nuhcift";
  const old = questionsV72.find((q) => q.id === id)!;
  const candidate = questionsV73Candidate.find((q) => q.id === id)!;
  assert(
    qualityWarnings(old).some(
      (warning) => warning.kind === "three-restrictive-distractors",
    ),
  );
  assert(
    !qualityWarnings(candidate).some(
      (warning) => warning.kind === "three-restrictive-distractors",
    ),
  );
  assert.equal(styleOnlyGuess(candidate), null);
  assert.equal(candidate.correctOptionId, old.correctOptionId);
  assert.equal(candidate.version, old.version + 1);
  const savedOrder = old.options.map((option) => option.id).reverse();
  const replay = gameQuestion(
    { bankVersion: 72, optionOrders: { [id]: savedOrder } },
    id,
  )!;
  assert.equal(replay.text, old.question);
  assert(replay.options.includes("Her türden birer çift"));
});
