import assert from "node:assert/strict";
import {test} from "node:test";
import {bankV24} from "../src/content/questions/archive/bank-v24";
import {bankV25} from "../src/content/questions/archive/bank-v25";
import {publishedNewQuestionsV25,publishedNewQuestionTopicsV25} from "../src/content/questions/published-v25";
import {BANK_VERSION,questions,playableQuestions} from "../src/content/questions";
import {knownQuestion,gameQuestion} from "../src/content/questions/registry";
import {belongsToLearningTopic} from "../src/domain/game/learning";
import {createSession,answerQuestion,advanceQuestion,finishSession} from "../src/domain/game/engine";
import {appendGame,emptyData,parseData} from "../src/storage/schema";
test("v25 adds two verse-specific questions without changing historical v24 bank",()=>{
 assert.equal(BANK_VERSION, 73);assert.equal(bankV24.length,587);assert.equal(bankV25.length,589);
 assert.equal(questions.length, 1500);assert.equal(playableQuestions().length, 1500);assert.equal(publishedNewQuestionsV25.length,2);
 assert.ok(bankV24.every((q,i)=>q===bankV25[i]));assert.equal(new Set(bankV25.map(q=>q.id)).size,589);
 const norm=(s:string)=>s.normalize("NFKC").toLocaleLowerCase("tr-TR").replace(/[^\p{L}\p{N}]+/gu," ").trim();
 assert.equal(new Set(bankV25.map(q=>norm(q.question))).size,589);
 for(const q of publishedNewQuestionsV25){
  assert.equal(q.reviewStatus,"approved");assert.equal(q.options.length,4);
  assert.equal(new Set(q.options.map(o=>o.text)).size,4);assert.ok(q.explanation.length>70);
  assert.equal(q.sources[0]!.checkStatus,"supported");assert.equal(q.sources[0]!.checkedAt,"2026-10-20");
  assert.match(q.sources[0]!.url,/^https:\/\/kuran\.diyanet\.gov\.tr\//);
  assert.equal(knownQuestion(24,q.id),false);assert.equal(knownQuestion(25,q.id),true);
  assert.ok(belongsToLearningTopic(q.id,publishedNewQuestionTopicsV25[q.id]!));
  const order={[q.id]:q.options.map(o=>o.id)};
  assert.equal(gameQuestion({bankVersion:24,optionOrders:order},q.id),undefined);
  const item=gameQuestion({bankVersion:25,optionOrders:order},q.id)!;
  assert.equal(item.options[item.correct],q.options.find(o=>o.id===q.correctOptionId)!.text);
 }
});
test("v25 saved games and archived v24 answers are compatible",()=>{
 const start=1800000000000;let s=createSession("mixed",undefined,start,{difficulty:"medium"});assert.equal(s.bankVersion, 73);
 for(let i=0;i<10;i++){s=answerQuestion(s,0,start+1000*(i+1));if(i<9)s=advanceQuestion(s)}
 const record=finishSession(s);assert.deepEqual(parseData(JSON.stringify(appendGame(emptyData(),record))).games[0],record);
 const old=bankV24[0]!,order={[old.id]:old.options.map(o=>o.id)};
 assert.deepEqual(gameQuestion({bankVersion:24,optionOrders:order},old.id),gameQuestion({bankVersion:25,optionOrders:order},old.id));
});
