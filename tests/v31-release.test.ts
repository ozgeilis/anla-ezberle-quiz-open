import assert from "node:assert/strict";
import {test} from "node:test";
import {bankV30} from "../src/content/questions/archive/bank-v30";
import {bankV31} from "../src/content/questions/archive/bank-v31";
import {publishedNewQuestionsV31,publishedNewQuestionTopicsV31} from "../src/content/questions/published-v31";
import {BANK_VERSION,questions,playableQuestions} from "../src/content/questions";
import {knownQuestion,gameQuestion} from "../src/content/questions/registry";
import {belongsToLearningTopic} from "../src/domain/game/learning";
import {createSession,answerQuestion,advanceQuestion,finishSession} from "../src/domain/game/engine";
import {appendGame,emptyData,parseData} from "../src/storage/schema";
test("v31 appends exactly one unique verified question without rewriting v30",()=>{
 assert.equal(BANK_VERSION, 73);assert.equal(bankV30.length,599);assert.equal(bankV31.length,600);
 assert.equal(questions.length, 1500);assert.equal(playableQuestions().length, 1500);assert.equal(publishedNewQuestionsV31.length,1);
 assert.ok(bankV30.every((q,i)=>q===bankV31[i]));assert.equal(new Set(bankV31.map(q=>q.id)).size,600);
 const q=publishedNewQuestionsV31[0]!;
 assert.equal(q.reviewStatus,"approved");assert.equal(q.options.length,4);
 assert.equal(new Set(q.options.map(o=>o.text)).size,4);assert.ok(q.explanation.length>100);
 assert.equal(q.sources[0]!.checkStatus,"supported");
 assert.match(q.sources[0]!.url,/^https:\/\/kuran\.diyanet\.gov\.tr\//);
 assert.equal(knownQuestion(30,q.id),false);assert.equal(knownQuestion(31,q.id),true);
 assert.ok(belongsToLearningTopic(q.id,publishedNewQuestionTopicsV31[q.id]!));
 const order={[q.id]:q.options.map(o=>o.id)};
 assert.equal(gameQuestion({bankVersion:30,optionOrders:order},q.id),undefined);
 const item=gameQuestion({bankVersion:31,optionOrders:order},q.id)!;
 assert.equal(item.options[item.correct],q.options.find(o=>o.id===q.correctOptionId)!.text);
});
test("v31 new games and historical v30 questions preserve scoring",()=>{
 const t=1800000000000;let s=createSession("mixed",undefined,t,{difficulty:"medium"});assert.equal(s.bankVersion, 73);
 for(let i=0;i<10;i++){s=answerQuestion(s,0,t+1000*(i+1));if(i<9)s=advanceQuestion(s)}
 const record=finishSession(s);
 assert.deepEqual(parseData(JSON.stringify(appendGame(emptyData(),record))).games[0],record);
 const q=bankV30[0]!,order={[q.id]:q.options.map(o=>o.id)};
 assert.deepEqual(gameQuestion({bankVersion:30,optionOrders:order},q.id),gameQuestion({bankVersion:31,optionOrders:order},q.id));
});
