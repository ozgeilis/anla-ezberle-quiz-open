import assert from "node:assert/strict";
import { test } from "node:test";
import { bankV14 } from "../src/content/questions/archive/bank-v14";
import { playableQuestions } from "../src/content/questions";
import {
 allResearchDraftsV3, reviewSourceCheckedV3, reviewExcludedV3,
 reviewStageForIdV3, sourceCheckedCandidateQuestionsV3,
} from "../src/content/questions/learning-source-checked-v3";
import { selectionConceptKeys } from "../src/domain/game/engine";

test("100 taslağın kaynak kararları ayrık, eksiksiz ve tarihli; arşiv v14 hâlâ 500", () => {
 assert.equal(allResearchDraftsV3.length, 100);
 assert.equal(new Set(allResearchDraftsV3.map(q=>q.id)).size,100);
 assert.equal(reviewSourceCheckedV3.length,31);
 assert.equal(reviewExcludedV3.length,6);
 assert.equal(sourceCheckedCandidateQuestionsV3.length,31);
 assert.equal(bankV14.length,500);
 assert.equal(playableQuestions().length, 1500);
 assert.equal(playableQuestions("prototype").length, 1500);
 const bankIds=new Set(bankV14.map(q=>q.id));
 const checked = new Set(reviewSourceCheckedV3.map(([id])=>id));
 const excluded=new Set(reviewExcludedV3.map(([id])=>id));
 assert.equal(checked.size,31);
 assert.equal(excluded.size,6);
 assert.ok([...checked].every(id=>!excluded.has(id)&&!bankIds.has(id)));
 assert.ok(allResearchDraftsV3.every(q=>q.reviewStatus==="draft"));
 assert.equal(allResearchDraftsV3.filter(q=>reviewStageForIdV3(q.id)==="source_check_pending").length,63);
 assert.ok(reviewExcludedV3.every(([id,reason])=>reviewStageForIdV3(id)==="excluded_for_rework"&&reason.length>20));
 assert.ok(sourceCheckedCandidateQuestionsV3.every(q=>reviewStageForIdV3(q.id)==="source_checked_pending_approval"));
});
test("31 kaynak karşılaştırmalı aday gözden geçirilmiş, kaynakları belirtilmiş ve canlı değil", () => {
 const all = new Map(allResearchDraftsV3.map(q=>[q.id,q]));
 const groups:Record<string,string[]>= {};
 for(const q of sourceCheckedCandidateQuestionsV3) {
  const original=all.get(q.id)!;
  assert.ok(original);
  assert.equal(q.reviewStatus,"reviewed");
  assert.ok(q.reviewNotes.includes("nihai yayım onayı henüz yoktur"));
  assert.equal(q.question,original.question);
  assert.deepEqual(q.options,original.options);
  assert.equal(q.correctOptionId,original.correctOptionId);
  assert.equal(q.explanation,original.explanation);
  assert.equal(q.difficulty,original.difficulty);
  assert.equal(q.categoryId,original.categoryId);
  assert.equal(q.sources.length,1);
  assert.equal(q.sources[0]!.checkStatus,"supported");
  assert.equal(q.sources[0]!.checkedAt,"2026-10-20");
  assert.equal(q.sources[0]!.url,original.sources[0]!.url);
  assert.ok(q.sources[0]!.locator.length>5);
  assert.ok(q.sources[0]!.url.startsWith("https://"));
  assert.equal(new Set(q.options.map(x=>x.text)).size,4);
  assert.ok(q.options.some(x=>x.id===q.correctOptionId));
  assert.ok(!bankV14.some(old=>old.id===q.id));
  const keys=selectionConceptKeys(q);
  assert.equal(new Set(keys).size, keys.length);
  groups[q.conceptGroup]??=[];
  groups[q.conceptGroup]!.push(q.id);
 }
 assert.deepEqual(groups["kadın-sahabe-hafsa"],["learn-women-011","learn-women-012"]);
 assert.deepEqual(groups["kadın-sahabe-sevde"],["learn-women-013","learn-women-014"]);
 assert.deepEqual(groups["kadın-sahabe-rukiyye"],["learn-women-021","learn-women-022"]);
});
