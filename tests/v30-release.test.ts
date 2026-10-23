import assert from "node:assert/strict";
import {test} from "node:test";
import {bankV29} from "../src/content/questions/archive/bank-v29";
import {bankV30} from "../src/content/questions/archive/bank-v30";
import {publishedNewQuestionsV30,publishedNewQuestionTopicsV30} from "../src/content/questions/published-v30";
import {BANK_VERSION,questions,playableQuestions} from "../src/content/questions";
import {knownQuestion,gameQuestion} from "../src/content/questions/registry";
import {belongsToLearningTopic} from "../src/domain/game/learning";
import {createSession,answerQuestion,advanceQuestion,finishSession} from "../src/domain/game/engine";
import {appendGame,emptyData,parseData} from "../src/storage/schema";
test("v30 appends two cited women-companion questions and freezes v29 bank",()=>{
 assert.equal(BANK_VERSION, 72);assert.equal(bankV29.length,597);assert.equal(bankV30.length,599);
 assert.equal(questions.length, 1500);assert.equal(playableQuestions().length, 1500);
 assert.equal(publishedNewQuestionsV30.length,2);
 assert.ok(bankV29.every((q,i)=>q===bankV30[i]));
 assert.equal(new Set(bankV30.map(q=>q.id)).size,599);
 const normalize=(s:string)=>s.normalize("NFKC").toLocaleLowerCase("tr-TR").replace(/[^\p{L}\p{N}]+/gu," ").trim();
 assert.equal(new Set(bankV30.map(q=>normalize(q.question))).size,599);
 for(const q of publishedNewQuestionsV30){
  assert.equal(q.reviewStatus,"approved");assert.equal(q.options.length,4);
  assert.equal(new Set(q.options.map(o=>o.text)).size,4);assert.ok(q.explanation.length>100);
  assert.equal(q.sources[0]!.checkStatus,"supported");assert.equal(q.sources[0]!.publisher,"TDV İslâm Araştırmaları Merkezi");
  assert.match(q.sources[0]!.url,/^https:\/\/islamansiklopedisi\.org\.tr\//);
  assert.equal(knownQuestion(29,q.id),false);assert.equal(knownQuestion(30,q.id),true);
  assert.ok(belongsToLearningTopic(q.id,publishedNewQuestionTopicsV30[q.id]!));
  const order={[q.id]:q.options.map(o=>o.id)};
  assert.equal(gameQuestion({bankVersion:29,optionOrders:order},q.id),undefined);
  const item=gameQuestion({bankVersion:30,optionOrders:order},q.id)!;
  assert.equal(item.options[item.correct],q.options.find(o=>o.id===q.correctOptionId)!.text);
 }
});
test("v30 saved game and archived v29 scores stay compatible",()=>{
 const t=1800000000000;let session=createSession("mixed",undefined,t,{difficulty:"medium"});assert.equal(session.bankVersion, 72);
 for(let i=0;i<10;i++){session=answerQuestion(session,0,t+1000*(i+1));if(i<9)session=advanceQuestion(session)}
 const record=finishSession(session);
 assert.deepEqual(parseData(JSON.stringify(appendGame(emptyData(),record))).games[0],record);
 const q=bankV29[0]!,order={[q.id]:q.options.map(o=>o.id)};
 assert.deepEqual(gameQuestion({bankVersion:29,optionOrders:order},q.id),gameQuestion({bankVersion:30,optionOrders:order},q.id));
});