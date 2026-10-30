import assert from "node:assert/strict";
import {test} from "node:test";
import {bankV26} from "../src/content/questions/archive/bank-v26";
import {bankV27} from "../src/content/questions/archive/bank-v27";
import {publishedNewQuestionsV27,publishedNewQuestionTopicsV27} from "../src/content/questions/published-v27";
import {BANK_VERSION,questions,playableQuestions} from "../src/content/questions";
import {knownQuestion,gameQuestion} from "../src/content/questions/registry";
import {belongsToLearningTopic} from "../src/domain/game/learning";
import {createSession,answerQuestion,advanceQuestion,finishSession} from "../src/domain/game/engine";
import {appendGame,emptyData,parseData} from "../src/storage/schema";
test("v27 appends two Diyanet-backed concepts, preserving archived v26 questions",()=>{
 assert.equal(BANK_VERSION, 73);assert.equal(bankV26.length,591);assert.equal(bankV27.length,593);
 assert.equal(questions.length, 1500);assert.equal(playableQuestions().length, 1500);assert.equal(publishedNewQuestionsV27.length,2);
 assert.ok(bankV26.every((q,i)=>q===bankV27[i]));assert.equal(new Set(bankV27.map(q=>q.id)).size,593);
 const norm=(s:string)=>s.normalize("NFKC").toLocaleLowerCase("tr-TR").replace(/[^\p{L}\p{N}]+/gu," ").trim();
 assert.equal(new Set(bankV27.map(q=>norm(q.question))).size,593);
 for(const q of publishedNewQuestionsV27){
  assert.equal(q.reviewStatus,"approved");assert.equal(q.options.length,4);
  assert.equal(new Set(q.options.map(o=>o.text)).size,4);assert.ok(q.explanation.length>90);
  assert.equal(q.sources[0]!.checkStatus,"supported");assert.equal(q.sources[0]!.checkedAt,"2026-10-20");
  assert.match(q.sources[0]!.url,/^https:\/\/kuran\.diyanet\.gov\.tr\//);
  assert.equal(knownQuestion(26,q.id),false);assert.equal(knownQuestion(27,q.id),true);
  assert.ok(belongsToLearningTopic(q.id,publishedNewQuestionTopicsV27[q.id]!));
  const order={[q.id]:q.options.map(o=>o.id)};
  assert.equal(gameQuestion({bankVersion:26,optionOrders:order},q.id),undefined);
  const item=gameQuestion({bankVersion:27,optionOrders:order},q.id)!;
  assert.equal(item.options[item.correct],q.options.find(o=>o.id===q.correctOptionId)!.text);
 }
});
test("v27 saved games and legacy v26 score records remain compatible",()=>{
 const start=1800000000000;let s=createSession("mixed",undefined,start,{difficulty:"medium"});assert.equal(s.bankVersion, 73);
 for(let i=0;i<10;i++){s=answerQuestion(s,0,start+1000*(i+1));if(i<9)s=advanceQuestion(s)}
 const record=finishSession(s);assert.deepEqual(parseData(JSON.stringify(appendGame(emptyData(),record))).games[0],record);
 const old=bankV26[0]!,order={[old.id]:old.options.map(o=>o.id)};
 assert.deepEqual(gameQuestion({bankVersion:26,optionOrders:order},old.id),gameQuestion({bankVersion:27,optionOrders:order},old.id));
});
