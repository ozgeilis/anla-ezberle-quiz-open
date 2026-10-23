import assert from "node:assert/strict";
import test from "node:test";
import { questions } from "../src/content/questions";
import evidence from "../docs/source-verification/evidence/v71-batch-05-0201-0250.json";
test("v71 canonical positions 201–250 keep direct TDV/Diyanet source comparisons and qualifiers", () => {
 assert.equal(evidence.count, 50);
 assert.deepEqual(evidence.range, [201,250]);
 assert.equal(evidence.entries.length,50);
 assert.equal(new Set(evidence.entries.map(e=>e.id)).size,50);
 const counts: Record<string,number>={};
 for(const [i,e] of evidence.entries.entries()){
   const q=questions[i+200]!;
   assert.equal(e.position,i+201);
   assert.equal(e.id,q.id);
   assert.equal(e.question,q.question);
   assert.equal(e.correctOptionId,q.correctOptionId);
   assert.equal(e.correctAnswer,q.options.find(o=>o.id===q.correctOptionId)?.text);
   assert.deepEqual(e.allOptions,q.options);
   assert.deepEqual(e.existingSourceUrls,q.sources.map(s=>s.url));
   assert.ok(e.sourceEvidenceUrl.startsWith("https://"));
   assert.ok(e.passageSummary.length>35);
   counts[e.sourceAccess]=(counts[e.sourceAccess]??0)+1;
 }
 assert.deepEqual(counts,evidence.sourceAccessCounts);
 assert.equal(evidence.entries.find(e=>e.position===240)?.conclusion,"supported-mainstream-interpretation-other-readings-exist");
 assert.equal(evidence.entries.filter(e=>e.conclusion==="supported-by-indexed-text-direct-open-pending").length,3);
});
