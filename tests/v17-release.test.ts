import assert from "node:assert/strict";
import { test } from "node:test";
import { bankV16 } from "../src/content/questions/archive/bank-v16";
import { bankV17 } from "../src/content/questions/archive/bank-v17";
import { publishedNewQuestionsV17, publishedNewQuestionTopicsV17 } from "../src/content/questions/published-v17";
import { BANK_VERSION, questions, playableQuestions } from "../src/content/questions";
import { gameQuestion, knownQuestion } from "../src/content/questions/registry";
import { belongsToLearningTopic } from "../src/domain/game/learning";
import { answerQuestion, advanceQuestion, createSession, finishSession } from "../src/domain/game/engine";
import { appendGame, emptyData, parseData } from "../src/storage/schema";

test("v17 adds nine distinct checked history questions without changing v16",()=>{
 assert.equal(BANK_VERSION, 73);
 assert.equal(bankV16.length,543);
 assert.equal(bankV17.length,552);
 assert.equal(publishedNewQuestionsV17.length,9);
 assert.equal(questions.length, 1500);
 assert.equal(playableQuestions().length, 1500);
 assert.ok(bankV16.every((q,i)=>q===bankV17[i]));
 assert.equal(new Set(bankV17.map(q=>q.id)).size,552);
 const norm=(s:string)=>s.normalize("NFKC").toLocaleLowerCase("tr-TR").replace(/[^\p{L}\p{N}]+/gu," ").trim();
 assert.equal(new Set(bankV17.map(q=>norm(q.question))).size,552);
 for(const q of publishedNewQuestionsV17) {
  assert.equal(q.reviewStatus,"approved");
  assert.equal(knownQuestion(16,q.id),false);
  assert.equal(knownQuestion(17,q.id),true);
  assert.equal(q.options.length,4);
  assert.equal(new Set(q.options.map(o=>o.text)).size,4);
  assert.ok(q.options.some(o=>o.id===q.correctOptionId));
  assert.ok(q.explanation.length>=35);
  assert.equal(q.sources[0]!.checkStatus,"supported");
  assert.equal(q.sources[0]!.checkedAt,"2026-10-20");
  assert.match(q.sources[0]!.url,/^https:\/\/islamansiklopedisi\.org\.tr\//);
  assert.ok(belongsToLearningTopic(q.id,publishedNewQuestionTopicsV17[q.id]!));
  const order={[q.id]:q.options.map(o=>o.id)};
  assert.equal(gameQuestion({bankVersion:16,optionOrders:order},q.id),undefined);
  const view=gameQuestion({bankVersion:17,optionOrders:order},q.id)!;
  assert.equal(view.options[view.correct],q.options.find(o=>o.id===q.correctOptionId)!.text);
 }
 assert.ok(!publishedNewQuestionsV17.some(q=>q.id==="learn-history-019"));
});

test("v17 game can be saved and v16 historic answers are retained",()=>{
 const time=1800000000000;
 let session=createSession("mixed",undefined,time,{difficulty:"medium",learningTopic:"medeniyet"});
 assert.equal(session.bankVersion, 73);
 for(let i=0;i<10;i++){
  session=answerQuestion(session,0,time+(i+1)*1000);
  if(i<9)session=advanceQuestion(session);
 }
 const saved=finishSession(session);
 assert.deepEqual(parseData(JSON.stringify(appendGame(emptyData(),saved))).games[0],saved);
 const old=bankV16[0]!;
 const opts={[old.id]:old.options.map(o=>o.id)};
 assert.deepEqual(gameQuestion({bankVersion:16,optionOrders:opts},old.id),gameQuestion({bankVersion:17,optionOrders:opts},old.id));
});
