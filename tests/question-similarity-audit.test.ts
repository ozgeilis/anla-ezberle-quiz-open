import assert from "node:assert/strict";
import {test} from "node:test";
import {normalized,similarity,similarityCandidates,reviewQueue,reviewSignal} from "../scripts/audit-question-similarity";
const item=(id:string,question:string,answer:string,conceptGroup:string)=>({id,question,conceptGroup,correctOptionId:"o1",options:[{id:"o1",text:answer},{id:"o2",text:"B"},{id:"o3",text:"C"},{id:"o4",text:"D"}] as const});
test("semantic scan handles Turkish case and punctuation",()=>{
 assert.equal(normalized("İYİLİK, IŞIK!"),"iyilik ışık");
 assert.equal(similarity("Zilzâl 99/7'de hayır yapan ne görür?","Zilzâl 99 7'de hayır yapan ne görür?"),1);
});
test("semantic scan returns candidate pairs but never mutates entries",()=>{
 const a=item("a","Zilzâl 99/7 hayır yapan karşılığını görür mü?","Evet","iman");
 const b=item("b","Zilzâl 99/7'de hayır yapan karşılığını görür mü?","Evet","iman");
 const c=item("c","Selimiye Camii'ni hangi padişah yaptırdı?","II. Selim","mimari");
 const snapshot=JSON.stringify([a,b,c]);
 const candidates=similarityCandidates([a,b,c],0.5);
 assert.equal(candidates.length,1);assert.equal(candidates[0]!.a,"a");assert.equal(candidates[0]!.b,"b");
 assert.equal(candidates[0]!.sameAnswer,true);assert.equal(candidates[0]!.sameConcept,true);
 assert.equal(JSON.stringify([a,b,c]),snapshot);
});
test("different learning outcomes must not be automatically declared duplicates",()=>{
 assert.deepEqual(similarityCandidates([item("one","Nimetlere kim şükreder?","Hz. Süleyman","dua"),item("two","Namazı kim devamlı kılar?","Hz. İbrâhim","namaz")],0.8),[]);
});

test("review queue prioritizes signals without labeling pairs duplicates",()=>{
 const pairs=[
  {a:"text",b:"other",score:0.95,sameAnswer:false,sameConcept:false},
  {a:"concept",b:"other",score:0.5,sameAnswer:false,sameConcept:true},
  {a:"answer",b:"other",score:0.4,sameAnswer:true,sameConcept:false},
  {a:"both",b:"other",score:0.3,sameAnswer:true,sameConcept:true},
 ];
 const original=JSON.stringify(pairs);
 const queue=reviewQueue(pairs);
 assert.deepEqual(queue.map(p=>p.a),["both","answer","concept","text"]);
 assert.deepEqual(queue.map(p=>p.signal),["same-answer-and-concept","same-answer","same-concept","text-overlap"]);
 assert.equal(reviewSignal(pairs[0]!),"text-overlap");
 assert.equal(JSON.stringify(pairs),original);
});
