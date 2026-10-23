import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { questions } from "../src/content/questions";
import type { Question } from "../src/content/questions/model";

const STOP = new Set(["ve","veya","ile","icin","gore","hangi","hangisi","nedir","kimdir","olarak","bir","bu","da","de","en","ne","nasıl","hangilerini","hangisidir","verilir","edilir","asagidakilerden","suresinde","ayetinde","ayetine","gore"]);
export const normalized = (s:string):string => s.normalize("NFKC").toLocaleLowerCase("tr-TR").replace(/[^\p{L}\p{N}]+/gu," ").trim();
export const terms = (s:string):Set<string> => new Set(normalized(s).split(" ").filter(t=>t.length>=3&&!STOP.has(t)));
export const similarity = (a:string,b:string):number => {
 const A=terms(a),B=terms(b);if(!A.size||!B.size)return 0;
 let shared=0;for(const t of A)if(B.has(t))shared++;
 return shared/(A.size+B.size-shared);
};
type SimilarQuestion = Pick<Question,"id"|"question"|"conceptGroup"|"options"|"correctOptionId">;
export interface Pair {a:string;b:string;score:number;sameAnswer:boolean;sameConcept:boolean;}
const answer=(q:SimilarQuestion)=>normalized(q.options.find(o=>o.id===q.correctOptionId)?.text??"");
export function similarityCandidates(items:readonly SimilarQuestion[], minScore=0.45):Pair[]{
 const out:Pair[]=[];
 for(let i=0;i<items.length;i++)for(let j=i+1;j<items.length;j++){
  const a=items[i]!,b=items[j]!;
  const score=similarity(a.question,b.question);
  const sameConcept=Boolean(a.conceptGroup&&a.conceptGroup===b.conceptGroup);
  const sameAnswer=Boolean(answer(a)&&answer(a)===answer(b));
  if(score>=minScore || (sameConcept&&score>=0.2))out.push({a:a.id,b:b.id,score:Number(score.toFixed(3)),sameAnswer,sameConcept});
 }
 return out.sort((x,y)=>Number(y.sameConcept)-Number(x.sameConcept)||Number(y.sameAnswer)-Number(x.sameAnswer)||y.score-x.score||x.a.localeCompare(y.a));
}

export type ReviewSignal = "same-answer-and-concept" | "same-answer" | "same-concept" | "text-overlap";
export const reviewSignal = (pair:Pair):ReviewSignal =>
 pair.sameAnswer && pair.sameConcept ? "same-answer-and-concept" :
 pair.sameAnswer ? "same-answer" :
 pair.sameConcept ? "same-concept" : "text-overlap";
export function reviewQueue(pairs:readonly Pair[]):(Pair & {signal:ReviewSignal})[]{
 const priority:Record<ReviewSignal,number>={
  "same-answer-and-concept":0,"same-answer":1,"same-concept":2,"text-overlap":3
 };
 return pairs.map(p=>({...p,signal:reviewSignal(p)}))
  .sort((a,b)=>priority[a.signal]-priority[b.signal] || b.score-a.score || a.a.localeCompare(b.a) || a.b.localeCompare(b.b));
}
// Candidate pairs are suggestions for human review; similarity cannot establish actual duplication.
if(process.argv[1] && import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 const pairs=similarityCandidates(questions);
 const queue=reviewQueue(pairs);
 const byId=new Map(questions.map(q=>[q.id,q]));
 const reviewDetails=queue.map(p=>({
  ...p,
  questions:[p.a,p.b].map(id=>{
   const q=byId.get(id)!;
   return {id,question:q.question,answer:q.options.find(o=>o.id===q.correctOptionId)?.text??"",explanation:q.explanation,category:q.categoryId,conceptGroup:q.conceptGroup,sourceUrls:q.sources.map(source=>source.url)};
  }),
 }));
 const signalCounts=Object.fromEntries(["same-answer-and-concept","same-answer","same-concept","text-overlap"].map(signal=>[signal,queue.filter(p=>p.signal===signal).length]));
 process.stdout.write(JSON.stringify({questions:questions.length,candidatePairs:pairs.length,method:"Turkish-normalized token Jaccard; not proof of duplication",signalCounts,reviewQueue:queue,reviewDetails,pairs},null,2)+"\n");
}
