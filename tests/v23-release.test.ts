import assert from "node:assert/strict";
import {test} from "node:test";
import {bankV22} from "../src/content/questions/archive/bank-v22";
import {bankV23} from "../src/content/questions/archive/bank-v23";
import {publishedNewQuestionsV23,publishedNewQuestionTopicsV23} from "../src/content/questions/published-v23";
import {BANK_VERSION,questions,playableQuestions} from "../src/content/questions";
import {knownQuestion,gameQuestion} from "../src/content/questions/registry";
import {belongsToLearningTopic} from "../src/domain/game/learning";
import {createSession,answerQuestion,advanceQuestion,finishSession} from "../src/domain/game/engine";
import {appendGame,emptyData,parseData} from "../src/storage/schema";
test("v23 appends only two source-supported Quran facts",()=>{
 assert.equal(BANK_VERSION, 73);assert.equal(bankV22.length,583);assert.equal(bankV23.length,585);
 assert.equal(questions.length, 1500);assert.equal(playableQuestions().length, 1500);assert.equal(publishedNewQuestionsV23.length,2);
 assert.ok(bankV22.every((q,i)=>q===bankV23[i]));assert.equal(new Set(bankV23.map(q=>q.id)).size,585);
 const norm=(s:string)=>s.normalize("NFKC").toLocaleLowerCase("tr-TR").replace(/[^\p{L}\p{N}]+/gu," ").trim();
 assert.equal(new Set(bankV23.map(q=>norm(q.question))).size,585);
 for(const q of publishedNewQuestionsV23){
 assert.equal(q.reviewStatus,"approved");assert.equal(q.options.length,4);
 assert.equal(new Set(q.options.map(o=>o.text)).size,4);assert.ok(q.explanation.length>80);
 assert.equal(q.sources[0]!.checkStatus,"supported");assert.equal(q.sources[0]!.checkedAt,"2026-10-20");
 assert.match(q.sources[0]!.url,/^https:\/\/kuran\.diyanet\.gov\.tr\//);
 assert.equal(knownQuestion(22,q.id),false);assert.equal(knownQuestion(23,q.id),true);
 assert.ok(belongsToLearningTopic(q.id,publishedNewQuestionTopicsV23[q.id]!));
 const order={[q.id]:q.options.map(o=>o.id)};assert.equal(gameQuestion({bankVersion:22,optionOrders:order},q.id),undefined);
 const current=gameQuestion({bankVersion:23,optionOrders:order},q.id)!;
 assert.equal(current.options[current.correct],q.options.find(o=>o.id===q.correctOptionId)!.text);
 }
});
test("historic v22 scores and current v23 saved records remain valid",()=>{
 const start=1800000000000;let s=createSession("mixed",undefined,start,{difficulty:"medium"});assert.equal(s.bankVersion, 73);
 for(let i=0;i<10;i++){s=answerQuestion(s,0,start+1000*(i+1));if(i<9)s=advanceQuestion(s)}
 const record=finishSession(s);assert.deepEqual(parseData(JSON.stringify(appendGame(emptyData(),record))).games[0],record);
 const old=bankV22[0]!,order={[old.id]:old.options.map(o=>o.id)};
 assert.deepEqual(gameQuestion({bankVersion:22,optionOrders:order},old.id),gameQuestion({bankVersion:23,optionOrders:order},old.id));
});
