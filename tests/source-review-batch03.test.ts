import assert from "node:assert/strict";
import test from "node:test";
import { questions } from "../src/content/questions";
import evidence from "../docs/source-verification/evidence/v71-batch-03-0101-0150.json";

test("original Diyanet/TDV passages support questions 101–150 with exact saved answer IDs", () => {
  assert.deepEqual(evidence.range, [101,150]);
  assert.equal(evidence.count,50);
  assert.equal(evidence.entries.length,50);
  assert.equal(new Set(evidence.entries.map(x=>x.id)).size,50);
  const sourceCount: Record<string,number>={};
  for(const [i,x] of evidence.entries.entries()){
    const q=questions[i+100]!;
    assert.equal(x.position,i+101);
    assert.equal(x.id,q.id);
    assert.equal(x.question,q.question);
    assert.equal(x.answerId,q.correctOptionId);
    assert.equal(x.answerText,q.options.find(o=>o.id===q.correctOptionId)?.text);
    assert.deepEqual(x.options,q.options);
    assert.deepEqual(x.sourceUrls,q.sources.map(s=>s.url));
    assert.ok(x.externalOfficialEvidenceUrl.startsWith("https://"));
    assert.ok(x.independentlyReadPassageSummary.length>38);
    assert.equal(x.verdict,"supports-current-answer");
    if(x.fihristEntry){
      const name=(str:string)=>str.toLocaleLowerCase("tr-TR").replace(/[^\p{L}\p{N}]/gu,"");
      if(i%2===0) assert.equal(x.answerText,String(x.fihristEntry.verses));
      else assert.equal(name(x.answerText),name(x.fihristEntry.name));
    }
    sourceCount[x.evidenceKind]=(sourceCount[x.evidenceKind]??0)+1;
  }
  assert.deepEqual(sourceCount,evidence.officialSourceComparisonCounts);
  assert.deepEqual(sourceCount,{"diyanet-pdf-fihrist-direct":6,"diyanet-pdf-verse-passage-direct":40,"tdv-original-entry-body":4});
  assert.equal(evidence.entries.find(q=>q.position===141)?.externalOfficialEvidenceUrl,
    "https://kuran.diyanet.gov.tr/tefsir/Meryem-suresi/2257/7-ayet-tefsiri");
});
