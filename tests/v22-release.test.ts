import assert from "node:assert/strict";
import {test} from "node:test";
import {bankV21} from "../src/content/questions/archive/bank-v21";
import {bankV22} from "../src/content/questions/archive/bank-v22";
import {publishedNewQuestionsV22,publishedNewQuestionTopicsV22} from "../src/content/questions/published-v22";
import {BANK_VERSION,questions,playableQuestions} from "../src/content/questions";
import {knownQuestion,gameQuestion} from "../src/content/questions/registry";
import {belongsToLearningTopic} from "../src/domain/game/learning";
import {createSession,answerQuestion,advanceQuestion,finishSession} from "../src/domain/game/engine";
import {appendGame,emptyData,parseData} from "../src/storage/schema";
test("v22 adds three documented Diyanet questions without mutating v21",()=>{
 assert.equal(BANK_VERSION, 72);assert.equal(bankV21.length,580);assert.equal(bankV22.length,583);assert.equal(questions.length, 1500);assert.equal(playableQuestions().length, 1500);
 assert.equal(publishedNewQuestionsV22.length,3);assert.ok(bankV21.every((q,i)=>q===bankV22[i]));
 assert.equal(new Set(bankV22.map(q=>q.id)).size,583);
 const norm=(s:string)=>s.normalize("NFKC").toLocaleLowerCase("tr-TR").replace(/[^\p{L}\p{N}]+/gu," ").trim();
 assert.equal(new Set(bankV22.map(q=>norm(q.question))).size,583);
 for(const q of publishedNewQuestionsV22){
  assert.equal(q.reviewStatus,"approved");assert.equal(q.options.length,4);assert.equal(new Set(q.options.map(o=>o.text)).size,4);
  assert.ok(q.explanation.length>65);assert.equal(q.sources[0]!.checkStatus,"supported");assert.equal(q.sources[0]!.checkedAt,"2026-10-20");
  assert.match(q.sources[0]!.url,/^https:\/\/kuran\.diyanet\.gov\.tr\//);
  assert.equal(knownQuestion(21,q.id),false);assert.equal(knownQuestion(22,q.id),true);
  assert.ok(belongsToLearningTopic(q.id,publishedNewQuestionTopicsV22[q.id]!));
  const order={[q.id]:q.options.map(o=>o.id)};
  assert.equal(gameQuestion({bankVersion:21,optionOrders:order},q.id),undefined);
  const item=gameQuestion({bankVersion:22,optionOrders:order},q.id)!;
  assert.equal(item.options[item.correct],q.options.find(o=>o.id===q.correctOptionId)!.text);
 }
});
test("new v22 save/old v21 answer history works",()=>{
 const start=1800000000000;let s=createSession("mixed",undefined,start,{difficulty:"medium"});assert.equal(s.bankVersion, 72);
 for(let i=0;i<10;i++){s=answerQuestion(s,0,start+1000*(i+1));if(i<9)s=advanceQuestion(s)}
 const record=finishSession(s);assert.deepEqual(parseData(JSON.stringify(appendGame(emptyData(),record))).games[0],record);
 const old=bankV21[0]!,order={[old.id]:old.options.map(o=>o.id)};
 assert.deepEqual(gameQuestion({bankVersion:21,optionOrders:order},old.id),gameQuestion({bankVersion:22,optionOrders:order},old.id));
});
