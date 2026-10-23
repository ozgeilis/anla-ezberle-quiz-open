/**
 * Non-publishing audit of the HUMAN-CURATED five special-time previews.
 * Source URLs are recorded for inspection; this does not verify each live page
 * or imply religious-specialist editorial approval.
 */
import {mkdir,writeFile} from "node:fs/promises";
import {questions,BANK_VERSION} from "../src/content/questions";
import {assessDifficultyRound,selectionConceptKeys} from "../src/domain/game/engine";
import {seasonalReviewCatalogV1} from "../src/content/questions/seasonal-review-catalog-v1";
import {seasonalDraftRowsV1,seasonalQuestionsDraftsV1} from "../src/content/questions/seasonal-questions-drafts-v1";

const questionById=new Map(questions.map(q=>[q.id,q]));
const levels=["easy","medium","hard"] as const;

async function main(){
 const categories=seasonalReviewCatalogV1.map(catalog=>{
  const existing=catalog.existingQuestionIds.map(id=>questionById.get(id)!);
  const drafts=seasonalQuestionsDraftsV1.filter(q=>seasonalDraftRowsV1.some(r=>r.id===q.id&&r.season===catalog.id));
  const hypothetical=[...existing,...drafts];
  const calculations=Object.fromEntries(levels.map(level=>[
    level,
    {
      existingOnly:assessDifficultyRound(existing,level),
      includingUnpublishedDrafts:assessDifficultyRound(hypothetical,level),
    },
  ]));
  const groups=new Map<string,string[]>();
  for(const q of hypothetical){
    for(const key of selectionConceptKeys(q)){
      const ids=groups.get(key)??[];
      ids.push(q.id);
      groups.set(key,ids);
    }
  }
  return {
    id:catalog.id,
    title:catalog.title,
    publicationStatus:"draft" as const,
    existingApprovedCandidateIds:catalog.existingQuestionIds,
    draftCandidateIds:drafts.map(q=>q.id),
    existingApprovedCount:existing.length,
    newDraftCount:drafts.length,
    levels:calculations,
    keyConflicts:[...groups.entries()].filter(([,ids])=>ids.length>1).map(([key,ids])=>({key,ids})),
    editorialWarnings:catalog.editorialWarnings,
    questions:hypothetical.map(q=>({
      id:q.id,question:q.question,answer:q.options.find(o=>o.id===q.correctOptionId)?.text,
      options:q.options,explanation:q.explanation,difficulty:q.difficulty,
      reviewStatus:q.reviewStatus,conceptGroup:q.conceptGroup,
      sources:q.sources.map(s=>({url:s.url,locator:s.locator,checkStatus:s.checkStatus})),
    })),
    requiresHumanApproval:true,
    requiresRealIphoneAcceptance:true,
    canPublish:false,
  };
 });
 const out={bankVersion:BANK_VERSION,bankCount:questions.length,locked:true,scope:"Editorial pilot only; never a release decision",categories};
 await mkdir("artifacts/special-collections-audit",{recursive:true});
 await writeFile("artifacts/special-collections-audit/editorial-catalog.json",JSON.stringify(out,null,2)+"\n","utf8");
 for(const row of categories){
   const lv=row.levels as Record<(typeof levels)[number],{existingOnly:{eligibleCount:number;canStart:boolean};includingUnpublishedDrafts:{eligibleCount:number;canStart:boolean}}>;
   console.log(`${row.title}: ${row.existingApprovedCount} existing + ${row.newDraftCount} unpublished drafts; `+
     levels.map(level=>`${level}=${lv[level].existingOnly.eligibleCount} existing / ${lv[level].includingUnpublishedDrafts.eligibleCount} including drafts`).join(", ")+
     `; publisher-approved=NO`);
 }
}
void main().catch((error:unknown)=>{console.error(error);process.exitCode=1;});
