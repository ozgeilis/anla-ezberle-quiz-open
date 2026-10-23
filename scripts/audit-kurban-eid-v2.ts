/**
 * Read-only, explicitly non-publishing Eid al-Adha 10-question editorial packet.
 *
 * Run: pnpm exec tsx scripts/audit-kurban-eid-v2.ts
 * Not a source crawler, expert approval, content promotion or real-device QA.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { BANK_VERSION, questions } from "../src/content/questions";
import { kurbanBayramiNewDraftsV2 } from "../src/content/questions/kurban-eid-drafts-v2";
import { kurbanBayramiEasyEditorialV2 } from "../src/content/questions/kurban-eid-editorial-v2";
import { seasonalQuestionsDraftsV1 } from "../src/content/questions/seasonal-questions-drafts-v1";
import { assessDifficultyRound, selectionConceptKeys } from "../src/domain/game/engine";

async function main() {
  const draftById = new Map(
    [...seasonalQuestionsDraftsV1, ...kurbanBayramiNewDraftsV2].map(q=>[q.id, q]),
  );
  const pairs = kurbanBayramiEasyEditorialV2.questionIds.map((id, index) => {
    const q = draftById.get(id);
    if (!q) throw new Error(`Missing curated source ID ${id}`);
    return {
      learningObjective: kurbanBayramiEasyEditorialV2.learningObjectives[index],
      question: q,
    };
  });
  const status = assessDifficultyRound(pairs.map(p=>p.question),"easy");
  const collisions = new Map<string,string[]>();
  for(const {question:q} of pairs){
    for(const key of selectionConceptKeys(q)) {
      const ids=collisions.get(key) ?? [];
      ids.push(q.id);
      collisions.set(key,ids);
    }
  }
  const report = {
    bankVersion: BANK_VERSION,
    unchangedPublishedCount: questions.length,
    collection: kurbanBayramiEasyEditorialV2.id,
    publicationStatus: "draft",
    publicationAuthorized: false,
    reviewedByReligiousExpert: false,
    physicalIPhoneVerified: false,
    tenQuestionTechnicalFeasibility: status,
    conceptKeyCollisions: [...collisions.entries()].filter(([,ids])=>ids.length>1).map(([key,ids])=>({key,ids})),
    editorialWarnings: kurbanBayramiEasyEditorialV2.openQuestions,
    checklist: pairs.map(({learningObjective,question:q}) => ({
      id:q.id,
      learningObjective,
      question:q.question,
      answer:q.options.find(o=>o.id===q.correctOptionId)?.text,
      options:q.options.map(o=>({id:o.id,text:o.text,correct:o.id===q.correctOptionId})),
      explanation:q.explanation,
      difficulty:q.difficulty,
      conceptGroup:q.conceptGroup,
      sources:q.sources.map(s=>({url:s.url,title:s.title,publisher:s.publisher,locator:s.locator,supports:s.supports,checkStatus:s.checkStatus,checkedAt:s.checkedAt})),
      sourceEditorialSignoffPending:true,
      optionsPedagogySignoffPending:true,
      realDeviceVerificationPending:true,
    })),
  };
  await mkdir("artifacts/special-collections-audit",{recursive:true});
  await writeFile("artifacts/special-collections-audit/kurban-eid-pilot.json",JSON.stringify(report,null,2)+"\n","utf8");
  console.log("Kurban Bayramı v2 review:",status.eligibleCount,"distinct technical candidates; selection possible:",status.canStart);
  console.log("Source/doc/physical iPhone review pending; publication NOT authorized.");
}
void main().catch((error: unknown)=>{console.error(error);process.exitCode=1;});
