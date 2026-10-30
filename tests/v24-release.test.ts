import assert from "node:assert/strict";
import {test} from "node:test";
import {bankV23} from "../src/content/questions/archive/bank-v23";
import {bankV24} from "../src/content/questions/archive/bank-v24";
import {publishedNewQuestionsV24,publishedNewQuestionTopicsV24} from "../src/content/questions/published-v24";
import {BANK_VERSION,questions,playableQuestions} from "../src/content/questions";
import {knownQuestion,gameQuestion} from "../src/content/questions/registry";
import {belongsToLearningTopic} from "../src/domain/game/learning";
import {createSession,answerQuestion,advanceQuestion,finishSession} from "../src/domain/game/engine";
import {appendGame,emptyData,parseData} from "../src/storage/schema";
test("v24 adds two independently sourced duas and freezes v23",()=>{
 assert.equal(BANK_VERSION, 73);assert.equal(bankV23.length,585);assert.equal(bankV24.length,587);
 assert.equal(questions.length, 1500);assert.equal(playableQuestions().length, 1500);assert.equal(publishedNewQuestionsV24.length,2);
 assert.ok(bankV23.every((q,i)=>q===bankV24[i]));assert.equal(new Set(bankV24.map(q=>q.id)).size,587);
 const norm=(s:string)=>s.normalize("NFKC").toLocaleLowerCase("tr-TR").replace(/[^\p{L}\p{N}]+/gu," ").trim();
 assert.equal(new Set(bankV24.map(q=>norm(q.question))).size,587);
 for(const q of publishedNewQuestionsV24){
  assert.equal(q.reviewStatus,"approved");assert.equal(q.options.length,4);
  assert.equal(new Set(q.options.map(o=>o.text)).size,4);assert.ok(q.explanation.length>85);
  assert.equal(q.sources[0]!.checkStatus,"supported");assert.equal(q.sources[0]!.checkedAt,"2026-10-20");
  assert.match(q.sources[0]!.url,/^https:\/\/kuran\.diyanet\.gov\.tr\//);
  assert.equal(knownQuestion(23,q.id),false);assert.equal(knownQuestion(24,q.id),true);
  assert.ok(belongsToLearningTopic(q.id,publishedNewQuestionTopicsV24[q.id]!));
  const order={[q.id]:q.options.map(o=>o.id)};
  assert.equal(gameQuestion({bankVersion:23,optionOrders:order},q.id),undefined);
  const item=gameQuestion({bankVersion:24,optionOrders:order},q.id)!;
  assert.equal(item.options[item.correct],q.options.find(o=>o.id===q.correctOptionId)!.text);
 }
});
test("v24 games can be restored and historic v23 answer records remain stable",()=>{
 const start=1800000000000;let s=createSession("mixed",undefined,start,{difficulty:"medium"});assert.equal(s.bankVersion, 73);
 for(let i=0;i<10;i++){s=answerQuestion(s,0,start+1000*(i+1));if(i<9)s=advanceQuestion(s)}
 const record=finishSession(s);assert.deepEqual(parseData(JSON.stringify(appendGame(emptyData(),record))).games[0],record);
 const old=bankV23[0]!,order={[old.id]:old.options.map(o=>o.id)};
 assert.deepEqual(gameQuestion({bankVersion:23,optionOrders:order},old.id),gameQuestion({bankVersion:24,optionOrders:order},old.id));
});
