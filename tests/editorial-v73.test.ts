import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { questionsV72 } from "../src/content/questions/questions-v72";
import { questionsV73Candidate } from "../src/content/questions/questions-v73.candidate";
import { approvedNewQuestionsV72 } from "../src/content/questions/release-v72-meaning";
import { BANK_VERSION, questions } from "../src/content/questions";
import {
  SUPPORTED_BANK_VERSIONS,
  historicalQuestion,
} from "../src/content/questions/registry";
import { createSession } from "../src/domain/game/engine";
import { qualityWarnings } from "../scripts/question-quality";
import summary from "../docs/editorial-v73/summary.json";
import review from "../docs/editorial-v73/iman-review.json";
import sources from "../src/content/questions/editorial-v73/sources.json";
const original = new Map(questionsV72.map((q) => [q.id, q]));
test("v73 candidate: 1,500 unique IDs, option keys, category/difficulty and 30 v72 meaning replacements remain intact", () => {
  assert.equal(questionsV73Candidate.length, 1500);
  assert.equal(new Set(questionsV73Candidate.map((q) => q.id)).size, 1500);
  for (const q of questionsV73Candidate) {
    const old = original.get(q.id)!;
    assert(old, q.id);
    assert.equal(q.categoryId, old.categoryId);
    assert.equal(q.difficulty, old.difficulty);
    assert.equal(q.conceptGroup, old.conceptGroup);
    assert.equal(q.correctOptionId, old.correctOptionId);
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options.map((o) => o.id)).size, 4);
    assert.equal(
      new Set(q.options.map((o) => o.text.toLocaleLowerCase("tr-TR").trim()))
        .size,
      4,
    );
    assert.equal(q.options.filter((o) => o.id === q.correctOptionId).length, 1);
    assert.deepEqual(
      q.options.map((o) => o.id).sort(),
      old.options.map((o) => o.id).sort(),
    );
    if (q.version !== old.version) {
      assert.equal(q.reviewStatus, "draft");
      assert(!q.reviewedAt);
      assert(q.sources.every((s) => s.checkStatus === "supported"));
    }
  }
  for (const q of approvedNewQuestionsV72)
    assert.deepEqual(
      questionsV73Candidate.find((x) => x.id === q.id),
      original.get(q.id),
    );
});
test("v73 stays unpublished; frozen v72 and historical registry are untouched; evidence does not imply human approval", () => {
  assert.equal(BANK_VERSION, 72);
  assert.equal(questions, questionsV72);
  assert(!(SUPPORTED_BANK_VERSIONS as readonly number[]).includes(73));
  assert.equal(
    createHash("sha256")
      .update(readFileSync("src/content/questions/questions-v72.ts"))
      .digest("hex"),
    "d1dcd3e92f4d331d187fcbf4c3459a1837ef979413a743c0d3ec4a43d7023115",
  );
  assert.equal(summary.total, 1500);
  assert.equal(summary.imanReviewed, 260);
  assert.equal(review.length, 260);
  assert.equal(summary.imanRevised + summary.imanRetained, 260);
  assert.equal(summary.releaseEnabled, false);
  for (const row of sources) {
    assert.equal(row.sourceStatus, "source-compared");
    assert.equal(row.humanApproval, false);
    assert.match(row.sourceSha256, /^[a-f0-9]{64}$/);
  }
  execFileSync(
    process.execPath,
    ["--import", "tsx", "scripts/build-editorial-v73.ts", "--check"],
    { stdio: "pipe" },
  );
});
test("new candidate content revisions never reuse an occupied id/version from local v2–v72 snapshots", () => {
  const revised = questionsV73Candidate.filter(
    (q) => q.version !== original.get(q.id)!.version,
  );
  assert(revised.length > 0);
  for (const bank of SUPPORTED_BANK_VERSIONS) {
    // v1 predates the versioned Question model; its replay has separate tests.
    if (bank === 1) continue;
    for (const q of revised) {
      const saved = historicalQuestion(bank, q.id);
      if (!saved || !("version" in saved)) continue;
      assert.notEqual(
        saved.version,
        q.version,
        `${q.id}@${q.version} already belongs to bank ${bank}`,
      );
    }
  }
});
test("answer positions use actual runtime shuffling, not the historically biased raw option array", () => {
  const counts = [0, 0, 0, 0];
  for (let seed = 1; seed <= 80; seed++) {
    let state = seed;
    const random = () =>
      (state = (Math.imul(state, 1664525) + 1013904223) >>> 0) / 4294967296;
    const s = createSession("mixed", undefined, 1800000000000 + seed, {
      channel: "prototype",
      random,
    });
    for (const id of s.questionIds) {
      const q = original.get(id)!;
      const i = s.optionOrders![id]!.indexOf(q.correctOptionId);
      counts[i]!++;
    }
  }
  assert.equal(
    counts.reduce((a, b) => a + b, 0),
    800,
  );
  for (const n of counts) assert(n > 130 && n < 270, JSON.stringify(counts));
});
test("quality warnings flag tone, length, duplication, grammar, absolutes, synonyms and ambiguity without approving truth", () => {
  const q = questionsV72[0]!;
  const warning = (stem: string, texts: string[]) =>
    qualityWarnings({
      ...q,
      question: stem,
      options: texts.map((text, i) => ({
        id: `o${i + 1}`,
        text,
      })) as unknown as typeof q.options,
    }).map((x) => x.kind);
  assert(
    warning("Hangi davranış tavsiye edilir?", [
      "Yardım etmek",
      "Hile yapmak",
      "Yalan söylemek",
      "İftira etmek",
    ]).includes("tone-3-negative"),
  );
  assert(
    warning("Hangisi eleştirilir?", [
      "Yardım etmek",
      "İyilik yapmak",
      "Adaletli olmak",
      "Hile yapmak",
    ]).includes("tone-3-positive"),
  );
  assert(
    warning("Kavram hangisi?", [
      "Örtü",
      "Perde",
      "Örtü",
      "Uzun uzun açıklanan ve yalnız burada bu kadar çok sözcük bulunan seçenek",
    ]).includes("duplicate"),
  );
  assert(
    warning("Kavram hangisi?", ["Örtü", "Perde", "Kandil", "Döşek"]).includes(
      "possible-synonyms",
    ),
  );
  assert(
    warning("Hangisi doğru davranıştır?", [
      "Daima yardım etmek",
      "Asla konuşmamak",
      "Sadaka",
      "Tevazu",
    ]).includes("absolute-language"),
  );
  assert(
    warning("Hangisi doğrudur?", [
      "Yalnızca öğrenmek",
      "Yardım",
      "İyilik",
      "Adalet",
    ]).includes("grammar-shape"),
  );
  assert(
    warning("Hangi davranış güzel ahlaka uygundur?", [
      "Sabır",
      "Şükür",
      "Takva",
      "Merhamet",
    ]).includes("broad-stem"),
  );
});

test("quality review also flags length, unrelated domains and paraphrase overlap without a semantic verdict", () => {
  const q = questionsV72[0]!;
  const probe = (texts: string[]) =>
    qualityWarnings({
      ...q,
      question: "Hangi kavram anlatılır?",
      options: texts.map((text, i) => ({
        id: `o${i + 1}`,
        text,
      })) as unknown as typeof q.options,
    }).map((x) => x.kind);
  assert(
    probe([
      "Tevazu",
      "Sabır",
      "Şükür",
      "Allah’a inanarak ve çok uzun bir açıklamayla belirtilen bütün ayrıntıları yerine getirmek",
    ]).includes("length-outlier"),
  );
  assert(
    probe(["Saray muhafızları", "Tüccarlar", "İyilik", "Tevazu"]).includes(
      "domain-mismatch",
    ),
  );
  assert(
    probe(["Adaletli bir söz", "Adaletli söz", "Sabır", "Merhamet"]).includes(
      "semantic-overlap",
    ),
  );
});
