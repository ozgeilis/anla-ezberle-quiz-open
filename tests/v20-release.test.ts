import assert from "node:assert/strict";
import { test } from "node:test";
import { bankV19 } from "../src/content/questions/archive/bank-v19";
import { bankV20 } from "../src/content/questions/archive/bank-v20";
import { publishedNewQuestionsV20,publishedNewQuestionTopicsV20 } from "../src/content/questions/published-v20";
import { BANK_VERSION,questions,playableQuestions } from "../src/content/questions";
import { knownQuestion,gameQuestion } from "../src/content/questions/registry";
import { belongsToLearningTopic,learningTopicPool } from "../src/domain/game/learning";
import { createSession,answerQuestion,advanceQuestion,finishSession } from "../src/domain/game/engine";
import { appendGame,emptyData,parseData } from "../src/storage/schema";

test("six TDV-checked original user200 morality facts add to immutable v19",()=>{
 assert.equal(BANK_VERSION, 73);
 assert.equal(bankV19.length,571);
 assert.equal(bankV20.length,577);
 assert.equal(publishedNewQuestionsV20.length,6);
 assert.equal(questions.length, 1500);
 assert.equal(playableQuestions().length, 1500);
 assert.ok(bankV19.every((q,i)=>q===bankV20[i]));
 assert.equal(new Set(bankV20.map(q=>q.id)).size,577);
 const norm=(s:string)=>s.normalize("NFKC").toLocaleLowerCase("tr-TR").replace(/[^\p{L}\p{N}]+/gu," ").trim();
 assert.equal(new Set(bankV20.map(q=>norm(q.question))).size,577);
 assert.deepEqual(publishedNewQuestionsV20.map(q=>q.id),["user200-103","user200-106","user200-107","user200-115","user200-118","user200-119"]);
 for(const q of publishedNewQuestionsV20){
  assert.equal(q.reviewStatus,"approved");
  assert.equal(q.categoryId,"general");
  assert.equal(publishedNewQuestionTopicsV20[q.id],"ahlak");
  assert.ok(belongsToLearningTopic(q.id,"ahlak"));
  assert.equal(knownQuestion(19,q.id),false);
  assert.equal(knownQuestion(20,q.id),true);
  assert.equal(q.options.length,4);
  assert.equal(new Set(q.options.map(x=>x.id)).size,4);
  assert.equal(new Set(q.options.map(x=>x.text)).size,4);
  assert.ok(q.options.some(x=>x.id===q.correctOptionId));
  assert.ok(q.explanation.length>=60);
  assert.equal(q.sources.length,1);
  assert.equal(q.sources[0]!.checkStatus,"supported");
  assert.equal(q.sources[0]!.publisher,"TDV İslâm Araştırmaları Merkezi");
  assert.equal(q.sources[0]!.checkedAt,"2026-10-20");
  assert.match(q.sources[0]!.url,/^https:\/\/islamansiklopedisi\.org\.tr\//);
  const order={[q.id]:q.options.map(o=>o.id)};
  assert.equal(gameQuestion({bankVersion:19,optionOrders:order},q.id),undefined);
  const newQ=gameQuestion({bankVersion:20,optionOrders:order},q.id)!;
  assert.equal(newQ.options[newQ.correct],q.options.find(o=>o.id===q.correctOptionId)!.text);
  assert.equal(newQ.explanation,q.explanation);
 }
 assert.ok(learningTopicPool(playableQuestions(),"ahlak").some(q=>q.id==="user200-103"));
});

test("v20 topic record persists; old v19 historical answers unchanged",()=>{
 const time=1800000000000;
 let session=createSession("mixed",undefined,time,{difficulty:"medium"});
 assert.equal(session.bankVersion, 73);
 for(let i=0;i<10;i++){
  session=answerQuestion(session,0,time+1000*(i+1));
  if(i<9)session=advanceQuestion(session);
 }
 const completed=finishSession(session);
 assert.deepEqual(parseData(JSON.stringify(appendGame(emptyData(),completed))).games[0],completed);
 const old=bankV19[0]!,order={[old.id]:old.options.map(o=>o.id)};
 assert.deepEqual(gameQuestion({bankVersion:19,optionOrders:order},old.id),gameQuestion({bankVersion:20,optionOrders:order},old.id));
});
