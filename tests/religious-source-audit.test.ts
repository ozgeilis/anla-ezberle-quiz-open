import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  BANK_VERSION,
  playableQuestions,
} from "../src/content/questions";
import { bankV31 as questions } from "../src/content/questions/archive/bank-v31";
import { kurbanBayramiNewDraftsV2 } from "../src/content/questions/kurban-eid-drafts-v2";
import { kurbanBayramiEasyEditorialV2 } from "../src/content/questions/kurban-eid-editorial-v2";
import { seasonalQuestionsDraftsV1 } from "../src/content/questions/seasonal-questions-drafts-v1";
import { religiousSourceCorrectionsV1 } from "../src/content/questions/religious-source-corrections-v1";
import { preparationFromParams } from "../src/features/categories/preparation";

const load = (name: string) =>
  JSON.parse(readFileSync(`docs/audits/${name}`, "utf8"));

test("source audit cannot silently rewrite any published v31 question, options, answers or metadata", () => {
  assert.equal(BANK_VERSION, 73);
  assert.equal(questions.length, 600);
  assert.equal(
    createHash("sha256").update(JSON.stringify(questions)).digest("hex"),
    "a0a8b3ff481b2476ce46e542a1575a0fdb1b7407cbab1d6232ab4cb0408c9151",
  );
  for (const channel of ["production", "prototype"] as const)
    assert.equal(playableQuestions(channel).length, 1500);
  for (const proposal of religiousSourceCorrectionsV1) {
    const original = questions.find((q) => q.id === proposal.questionId)!;
    assert.equal(original.version, proposal.baseQuestionVersion);
    assert.equal(proposal.proposedQuestionVersion, original.version + 1);
    assert.equal(proposal.publicationStatus, "proposal");
    assert.equal("approved" in proposal, false);
  }
});

test("Hac 22/36 and Kadr 97/5 sources target the verse in the actual question", () => {
  const sharing = kurbanBayramiNewDraftsV2.find(
    (q) => q.id === "special-sacrifice-sharing-002",
  )!;
  const dawn = seasonalQuestionsDraftsV1.find(
    (q) => q.id === "special-kadir-dawn-001",
  )!;
  for (const [question, surah, verse] of [
    [sharing, "22", "36"],
    [dawn, "97", "5"],
  ] as const) {
    const source = question.sources[0];
    assert(source);
    const url = new URL(source.url);
    assert.equal(url.hostname, "kuran.diyanet.gov.tr");
    assert.equal(url.searchParams.get("sure"), surah);
    assert.equal(url.searchParams.get("ayet"), verse);
    assert.equal(question.version, 2);
    assert.equal(question.reviewStatus, "draft");
    assert.equal(question.reviewedAt, undefined);
  }
});

test("source fixes distinguish family reward, school-specific partnership and holiday versus cutting duration", () => {
  const small = kurbanBayramiNewDraftsV2.find(
    (q) => q.id === "special-sacrifice-smallshare-002",
  )!;
  const large = kurbanBayramiNewDraftsV2.find(
    (q) => q.id === "special-sacrifice-largeshare-002",
  )!;
  const days = seasonalQuestionsDraftsV1.find(
    (q) => q.id === "special-sacrifice-length-001",
  )!;
  assert.match(small.explanation, /aile.*sevaba/);
  assert.match(large.question, /Diyanet/);
  assert.match(large.explanation, /Mâlikî/);
  assert.match(days.explanation, /Hanefî.*üçüncü.*Şâfiî.*dördüncü/);
  assert.equal(
    days.options.find((o) => o.id === days.correctOptionId)!.text,
    "Dört gün",
  );
  assert.equal(
    kurbanBayramiEasyEditorialV2.pedagogicalIndependence,
    "not-established",
  );
  assert.equal(kurbanBayramiEasyEditorialV2.published, false);
  assert.equal(
    preparationFromParams({ topic: "kurban_bayrami" }).topic,
    undefined,
  );
});

test("the ledger separates 50 assessed published questions from 550 unassessed questions", () => {
  const audit = load("RELIGIOUS-SOURCE-AUDIT-20261021.json");
  assert.equal(audit.rows.length, 618);
  assert.equal(audit.summary.published_assessed, 50);
  assert.equal(audit.summary.published_not_reviewed, 550);
  assert.equal(audit.summary.drafts_assessed, 18);
  assert.equal(new Set(audit.rows.map((r: { id: string }) => r.id)).size, 618);
  for (let batch = 1; batch <= 12; batch++)
    assert.equal(
      audit.plan.filter((p: { batch: number }) => p.batch === batch).length,
      50,
    );
  for (const row of audit.rows) {
    assert.equal(row.publication_authorized, false);
    assert.equal(
      row.option_a.length > 0 &&
        row.option_b.length > 0 &&
        row.option_c.length > 0 &&
        row.option_d.length > 0,
      true,
    );
    if (row.review_state === "NOT_REVIEWED") {
      assert.equal(row.check_result, null);
      assert.equal(row.assessment_date, null);
      assert.deepEqual(row.evidence_urls, []);
    } else {
      assert(
        ["BLOCK", "FIX", "VERIFIED", "NEEDS_SECOND_SOURCE"].includes(
          row.check_result,
        ),
      );
      assert(row.controversy.length > 30);
      assert(row.evidence_urls.length > 0);
      if (row.check_result === "VERIFIED") {
        assert.equal(row.second_source_obtained, true);
        assert(
          new Set(row.evidence_urls.map((url: string) => new URL(url).hostname))
            .size >= 2,
        );
      }
    }
  }
});

test("HTTP success is never stored as religious claim verification", () => {
  const access = load("RELIGIOUS-SOURCE-ACCESS-20261021.json");
  assert.equal(access.records.length, access.uniqueUrlCount);
  assert(
    access.records.every(
      (r: { claimVerified: boolean }) => r.claimVerified === false,
    ),
  );
  const blocked = access.records.filter(
    (r: { status: number }) => r.status !== 200,
  );
  assert(blocked.length > 0);
  assert(
    blocked.every(
      (r: { requestedAt: string; receivedAt: string }) =>
        Date.parse(r.receivedAt) >= Date.parse(r.requestedAt),
    ),
  );
});
