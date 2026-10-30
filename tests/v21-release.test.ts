import assert from "node:assert/strict";
import {test} from "node:test";
import {bankV20} from "../src/content/questions/archive/bank-v20";
import {bankV21} from "../src/content/questions/archive/bank-v21";
import {publishedNewQuestionsV21,publishedNewQuestionTopicsV21} from "../src/content/questions/published-v21";
import {BANK_VERSION,questions,playableQuestions} from "../src/content/questions";
import {knownQuestion,gameQuestion} from "../src/content/questions/registry";
import {belongsToLearningTopic} from "../src/domain/game/learning";
import {createSession,answerQuestion,advanceQuestion,finishSession} from "../src/domain/game/engine";
import {appendGame,emptyData,parseData} from "../src/storage/schema";
test("v21 appends exactly three Diyanet citations, preserving immutable v20 bank",()=>{
 assert.equal(BANK_VERSION, 73);assert.equal(bankV20.length,577);assert.equal(bankV21.length,580);
 assert.equal(publishedNewQuestionsV21.length,3);assert.equal(questions.length, 1500);assert.equal(playableQuestions().length, 1500);
 assert.ok(bankV20.every((q,i)=>q===bankV21[i]));
 assert.equal(new Set(bankV21.map(q=>q.id)).size,580);
 const norm=(s:string)=>s.normalize("NFKC").toLocaleLowerCase("tr-TR").replace(/[^\p{L}\p{N}]+/gu," ").trim();
 assert.equal(new Set(bankV21.map(q=>norm(q.question))).size,580);
 for(const q of publishedNewQuestionsV21){
  assert.ok(q.explanation.length>=55);
  assert.equal(q.reviewStatus,"approved");
  assert.equal(q.options.length,4);
  assert.equal(new Set(q.options.map(o=>o.text)).size,4);
  assert.equal(q.sources.length,1);
  assert.equal(q.sources[0]!.publisher,"Diyanet İşleri Başkanlığı");
  assert.equal(q.sources[0]!.checkStatus,"supported");
  assert.match(q.sources[0]!.url,/^https:\/\/kuran\.diyanet\.gov\.tr\//);
  assert.equal(knownQuestion(20,q.id),false);assert.equal(knownQuestion(21,q.id),true);
  assert.ok(belongsToLearningTopic(q.id,publishedNewQuestionTopicsV21[q.id]!));
  const order={[q.id]:q.options.map(o=>o.id)};
  assert.equal(gameQuestion({bankVersion:20,optionOrders:order},q.id),undefined);
  const current=gameQuestion({bankVersion:21,optionOrders:order},q.id)!;
  assert.equal(current.options[current.correct],q.options.find(o=>o.id===q.correctOptionId)!.text);
 }
});
test("v21 saved results and v20 historic answers remain compatible",()=>{
 const time=1800000000000;
 let s=createSession("mixed",undefined,time,{difficulty:"medium"});
 assert.equal(s.bankVersion, 73);
 for(let i=0;i<10;i++){s=answerQuestion(s,0,time+1000*(i+1));if(i<9)s=advanceQuestion(s)}
 const rec=finishSession(s);
 assert.deepEqual(parseData(JSON.stringify(appendGame(emptyData(),rec))).games[0],rec);
 const old=bankV20[0]!,order={[old.id]:old.options.map(o=>o.id)};
 assert.deepEqual(gameQuestion({bankVersion:20,optionOrders:order},old.id),gameQuestion({bankVersion:21,optionOrders:order},old.id));
});
