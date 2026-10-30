import assert from "node:assert/strict";
import {test} from "node:test";
import {bankV25} from "../src/content/questions/archive/bank-v25";
import {bankV26} from "../src/content/questions/archive/bank-v26";
import {publishedNewQuestionsV26,publishedNewQuestionTopicsV26} from "../src/content/questions/published-v26";
import {BANK_VERSION,questions,playableQuestions} from "../src/content/questions";
import {knownQuestion,gameQuestion} from "../src/content/questions/registry";
import {belongsToLearningTopic} from "../src/domain/game/learning";
import {createSession,answerQuestion,advanceQuestion,finishSession} from "../src/domain/game/engine";
import {appendGame,emptyData,parseData} from "../src/storage/schema";
test("v26 appends two source-verified facts and preserves 589 historical questions",()=>{
 assert.equal(BANK_VERSION, 73);assert.equal(bankV25.length,589);assert.equal(bankV26.length,591);
 assert.equal(questions.length, 1500);assert.equal(playableQuestions().length, 1500);assert.equal(publishedNewQuestionsV26.length,2);
 assert.ok(bankV25.every((q,i)=>q===bankV26[i]));assert.equal(new Set(bankV26.map(q=>q.id)).size,591);
 const norm=(s:string)=>s.normalize("NFKC").toLocaleLowerCase("tr-TR").replace(/[^\p{L}\p{N}]+/gu," ").trim();
 assert.equal(new Set(bankV26.map(q=>norm(q.question))).size,591);
 for(const q of publishedNewQuestionsV26){
  assert.equal(q.reviewStatus,"approved");assert.equal(q.options.length,4);
  assert.equal(new Set(q.options.map(o=>o.text)).size,4);assert.ok(q.explanation.length>90);
  assert.equal(q.sources[0]!.checkStatus,"supported");assert.equal(q.sources[0]!.checkedAt,"2026-10-20");
  assert.match(q.sources[0]!.url,/^https:\/\/kuran\.diyanet\.gov\.tr\//);
  assert.equal(knownQuestion(25,q.id),false);assert.equal(knownQuestion(26,q.id),true);
  assert.ok(belongsToLearningTopic(q.id,publishedNewQuestionTopicsV26[q.id]!));
  const order={[q.id]:q.options.map(o=>o.id)};
  assert.equal(gameQuestion({bankVersion:25,optionOrders:order},q.id),undefined);
  const item=gameQuestion({bankVersion:26,optionOrders:order},q.id)!;
  assert.equal(item.options[item.correct],q.options.find(o=>o.id===q.correctOptionId)!.text);
 }
});
test("v26 saved game restoration and legacy v25 scoring remain compatible",()=>{
 const start=1800000000000;let s=createSession("mixed",undefined,start,{difficulty:"medium"});assert.equal(s.bankVersion, 73);
 for(let i=0;i<10;i++){s=answerQuestion(s,0,start+1000*(i+1));if(i<9)s=advanceQuestion(s)}
 const record=finishSession(s);assert.deepEqual(parseData(JSON.stringify(appendGame(emptyData(),record))).games[0],record);
 const old=bankV25[0]!,order={[old.id]:old.options.map(o=>o.id)};
 assert.deepEqual(gameQuestion({bankVersion:25,optionOrders:order},old.id),gameQuestion({bankVersion:26,optionOrders:order},old.id));
});
