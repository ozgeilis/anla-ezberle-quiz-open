import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { test } from "node:test";
import { bankV31 } from "../src/content/questions/archive/bank-v31";
import { bankV41 } from "../src/content/questions/archive/bank-v41";
import coverage from "../docs/audits/RELIGIOUS-SOURCE-AUDIT-COVERAGE-20261021.json";

test("completed audit covers every frozen v31 ID exactly once at its published revision", () => {
  assert.equal(coverage.rows.length, 600);
  assert.equal(new Set(coverage.rows.map((r) => r.id)).size, 600);
  assert.deepEqual(coverage.rows.map((r) => r.id), bankV31.map((q) => q.id));
  assert.equal(coverage.summary.human_expert_signoff, false);
  for (const [i, row] of coverage.rows.entries()) {
    assert.equal(row.original_question_version, bankV31[i]!.version);
    assert.equal(row.current_question_version, bankV41[i]!.version);
    assert.ok(row.evidence_urls.length > 0 && row.evidence_locator && row.access_method);
    assert.equal(row.human_expert_signoff, false);
    assert.equal(bankV41[i]!.correctOptionId, bankV31[i]!.correctOptionId);
    assert.equal(bankV41[i]!.options.find((o) => o.id === bankV41[i]!.correctOptionId)!.text,
      bankV31[i]!.options.find((o) => o.id === bankV31[i]!.correctOptionId)!.text);
  }
  // The editorial audit pins the original module bytes. Restore only its two
  // relocated import paths before hashing; do not replace the audited digest.
  const originalSource = readFileSync("src/content/questions/archive/bank-v31.ts", "utf8")
    .replace('from "../model"', 'from "./model"')
    .replace('from "../published-v31"', 'from "./published-v31"');
  const digest = createHash("sha256").update(originalSource).digest("hex");
  assert.equal(createHash("sha256").update(JSON.stringify(bankV31)).digest("hex"),
    "a0a8b3ff481b2476ce46e542a1575a0fdb1b7407cbab1d6232ab4cb0408c9151");
  assert.equal(digest, "b43697e159e9f0c1a360d50667a1ed6c2637ad9d7224e7eed6eb6e60ecfa754f");
});
