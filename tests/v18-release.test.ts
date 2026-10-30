import assert from "node:assert/strict";
import { test } from "node:test";
import { bankV17 } from "../src/content/questions/archive/bank-v17";
import { bankV18 } from "../src/content/questions/archive/bank-v18";
import { publishedNewQuestionsV18,publishedNewQuestionTopicsV18 } from "../src/content/questions/published-v18";
import { questions,playableQuestions,BANK_VERSION } from "../src/content/questions";
import { knownQuestion,gameQuestion } from "../src/content/questions/registry";
import { belongsToLearningTopic } from "../src/domain/game/learning";
import { createSession,answerQuestion,advanceQuestion,finishSession } from "../src/domain/game/engine";
import { appendGame,emptyData,parseData } from "../src/storage/schema";

test("v18 appends nine directly checked questions; v17 remains immutable",()=>{
 assert.equal(BANK_VERSION, 73);
 assert.equal(bankV17.length,552);
 assert.equal(bankV18.length,561);
 assert.equal(publishedNewQuestionsV18.length,9);
 assert.equal(questions.length, 1500);
 assert.equal(playableQuestions().length, 1500);
 assert.ok(bankV17.every((q,i)=>q===bankV18[i]));
 assert.equal(new Set(bankV18.map(q=>q.id)).size,561);
 const norm=(s:string)=>s.normalize("NFKC").toLocaleLowerCase("tr-TR").replace(/[^\p{L}\p{N}]+/gu," ").trim();
 assert.equal(new Set(bankV18.map(q=>norm(q.question))).size,561);
 for(const q of publishedNewQuestionsV18){
  assert.equal(knownQuestion(17,q.id),false);
  assert.equal(knownQuestion(18,q.id),true);
  assert.equal(q.reviewStatus,"approved");
  assert.equal(q.options.length,4);
  assert.equal(new Set(q.options.map(o=>o.text)).size,4);
  assert.ok(q.options.some(o=>o.id===q.correctOptionId));
  assert.ok(q.explanation.length>=30);
  assert.equal(q.sources.length,1);
  assert.equal(q.sources[0]!.checkStatus,"supported");
  assert.equal(q.sources[0]!.checkedAt,"2026-10-20");
  assert.match(q.sources[0]!.url,/^https:\/\/(islamansiklopedisi\.org\.tr|kuran\.diyanet\.gov\.tr)\//);
  assert.ok(belongsToLearningTopic(q.id,publishedNewQuestionTopicsV18[q.id]!));
  const opts={[q.id]:q.options.map(o=>o.id)};
  assert.equal(gameQuestion({bankVersion:17,optionOrders:opts},q.id),undefined);
  const live=gameQuestion({bankVersion:18,optionOrders:opts},q.id)!;
  assert.equal(live.options[live.correct],q.options.find(o=>o.id===q.correctOptionId)!.text);
 }
 assert.deepEqual(publishedNewQuestionsV18.reduce((m,q)=>{m[q.id.startsWith("learn-dua")?"dua":"women"]++;return m;},{women:0,dua:0}),{women:7,dua:2});
});
test("v18 saved score and v17 historic answers remain valid",()=>{
 const time=1800000000000;
 let s=createSession("mixed",undefined,time,{difficulty:"medium",learningTopic:"sahabe"});
 assert.equal(s.bankVersion, 73);
 for(let i=0;i<10;i++){s=answerQuestion(s,0,time+(i+1)*1000);if(i<9)s=advanceQuestion(s)}
 const rec=finishSession(s);
 assert.deepEqual(parseData(JSON.stringify(appendGame(emptyData(),rec))).games[0],rec);
 const old=bankV17[0]!,order={[old.id]:old.options.map(o=>o.id)};
 assert.deepEqual(gameQuestion({bankVersion:17,optionOrders:order},old.id),gameQuestion({bankVersion:18,optionOrders:order},old.id));
});
