import assert from "node:assert/strict";
import {test} from "node:test";
import {bankV28} from "../src/content/questions/archive/bank-v28";
import {bankV29} from "../src/content/questions/archive/bank-v29";
import {publishedNewQuestionsV29,publishedNewQuestionTopicsV29} from "../src/content/questions/published-v29";
import {BANK_VERSION,questions,playableQuestions} from "../src/content/questions";
import {knownQuestion,gameQuestion} from "../src/content/questions/registry";
import {belongsToLearningTopic} from "../src/domain/game/learning";
import {createSession,answerQuestion,advanceQuestion,finishSession} from "../src/domain/game/engine";
import {appendGame,emptyData,parseData} from "../src/storage/schema";
test("v29 preserves 595 prior questions and adds two source-checked ayat facts",()=>{
 assert.equal(BANK_VERSION, 73);assert.equal(bankV28.length,595);assert.equal(bankV29.length,597);
 assert.equal(questions.length, 1500);assert.equal(playableQuestions().length, 1500);assert.equal(publishedNewQuestionsV29.length,2);
 assert.ok(bankV28.every((q,i)=>q===bankV29[i]));assert.equal(new Set(bankV29.map(q=>q.id)).size,597);
 const norm=(s:string)=>s.normalize("NFKC").toLocaleLowerCase("tr-TR").replace(/[^\p{L}\p{N}]+/gu," ").trim();
 assert.equal(new Set(bankV29.map(q=>norm(q.question))).size,597);
 for(const q of publishedNewQuestionsV29){
  assert.equal(q.reviewStatus,"approved");assert.equal(q.options.length,4);assert.equal(new Set(q.options.map(o=>o.text)).size,4);
  assert.ok(q.explanation.length>90);assert.equal(q.sources[0]!.checkStatus,"supported");
  assert.match(q.sources[0]!.url,/^https:\/\/kuran\.diyanet\.gov\.tr\//);
  assert.equal(knownQuestion(28,q.id),false);assert.equal(knownQuestion(29,q.id),true);
  assert.ok(belongsToLearningTopic(q.id,publishedNewQuestionTopicsV29[q.id]!));
  const order={[q.id]:q.options.map(o=>o.id)};
  assert.equal(gameQuestion({bankVersion:28,optionOrders:order},q.id),undefined);
  const item=gameQuestion({bankVersion:29,optionOrders:order},q.id)!;
  assert.equal(item.options[item.correct],q.options.find(o=>o.id===q.correctOptionId)!.text);
 }
});
test("v29 stored games and v28 old scoring remain valid",()=>{
 const start=1800000000000;let s=createSession("mixed",undefined,start,{difficulty:"medium"});assert.equal(s.bankVersion, 73);
 for(let i=0;i<10;i++){s=answerQuestion(s,0,start+1000*(i+1));if(i<9)s=advanceQuestion(s)}
 const record=finishSession(s);assert.deepEqual(parseData(JSON.stringify(appendGame(emptyData(),record))).games[0],record);
 const old=bankV28[0]!,order={[old.id]:old.options.map(o=>o.id)};
 assert.deepEqual(gameQuestion({bankVersion:28,optionOrders:order},old.id),gameQuestion({bankVersion:29,optionOrders:order},old.id));
});