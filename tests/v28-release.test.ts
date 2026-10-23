import assert from "node:assert/strict";
import {test} from "node:test";
import {bankV27} from "../src/content/questions/archive/bank-v27";
import {bankV28} from "../src/content/questions/archive/bank-v28";
import {publishedNewQuestionsV28,publishedNewQuestionTopicsV28} from "../src/content/questions/published-v28";
import {BANK_VERSION,questions,playableQuestions} from "../src/content/questions";
import {knownQuestion,gameQuestion} from "../src/content/questions/registry";
import {belongsToLearningTopic} from "../src/domain/game/learning";
import {createSession,answerQuestion,advanceQuestion,finishSession} from "../src/domain/game/engine";
import {appendGame,emptyData,parseData} from "../src/storage/schema";
test("v28 adds exactly two verified TDV history questions without changing v27",()=>{
 assert.equal(BANK_VERSION, 72);assert.equal(bankV27.length,593);assert.equal(bankV28.length,595);
 assert.equal(questions.length, 1500);assert.equal(playableQuestions().length, 1500);assert.equal(publishedNewQuestionsV28.length,2);
 assert.ok(bankV27.every((q,i)=>q===bankV28[i]));assert.equal(new Set(bankV28.map(q=>q.id)).size,595);
 const norm=(s:string)=>s.normalize("NFKC").toLocaleLowerCase("tr-TR").replace(/[^\p{L}\p{N}]+/gu," ").trim();
 assert.equal(new Set(bankV28.map(q=>norm(q.question))).size,595);
 for(const q of publishedNewQuestionsV28){
  assert.equal(q.reviewStatus,"approved");assert.equal(q.options.length,4);
  assert.equal(new Set(q.options.map(o=>o.text)).size,4);assert.ok(q.explanation.length>90);
  assert.equal(q.sources[0]!.publisher,"TDV İslâm Araştırmaları Merkezi");assert.equal(q.sources[0]!.checkStatus,"supported");
  assert.match(q.sources[0]!.url,/^https:\/\/islamansiklopedisi\.org\.tr\//);
  assert.equal(knownQuestion(27,q.id),false);assert.equal(knownQuestion(28,q.id),true);
  assert.ok(belongsToLearningTopic(q.id,publishedNewQuestionTopicsV28[q.id]!,1));
  const order={[q.id]:q.options.map(o=>o.id)};
  assert.equal(gameQuestion({bankVersion:27,optionOrders:order},q.id),undefined);
  const item=gameQuestion({bankVersion:28,optionOrders:order},q.id)!;
  assert.equal(item.options[item.correct],q.options.find(o=>o.id===q.correctOptionId)!.text);
 }
});
test("v28 saved games and v27 historic scores are compatible",()=>{
 const start=1800000000000;let s=createSession("mixed",undefined,start,{difficulty:"medium"});assert.equal(s.bankVersion, 72);
 for(let i=0;i<10;i++){s=answerQuestion(s,0,start+1000*(i+1));if(i<9)s=advanceQuestion(s)}
 const record=finishSession(s);assert.deepEqual(parseData(JSON.stringify(appendGame(emptyData(),record))).games[0],record);
 const old=bankV27[0]!,order={[old.id]:old.options.map(o=>o.id)};
 assert.deepEqual(gameQuestion({bankVersion:27,optionOrders:order},old.id),gameQuestion({bankVersion:28,optionOrders:order},old.id));
});