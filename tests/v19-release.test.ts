import assert from "node:assert/strict";
import { test } from "node:test";
import { bankV18 } from "../src/content/questions/archive/bank-v18";
import { bankV19 } from "../src/content/questions/archive/bank-v19";
import { publishedNewQuestionsV19, publishedNewQuestionTopicsV19 } from "../src/content/questions/published-v19";
import { BANK_VERSION,playableQuestions,questions } from "../src/content/questions";
import { knownQuestion,gameQuestion } from "../src/content/questions/registry";
import { belongsToLearningTopic } from "../src/domain/game/learning";
import { createSession,answerQuestion,advanceQuestion,finishSession } from "../src/domain/game/engine";
import { appendGame,emptyData,parseData } from "../src/storage/schema";

test("v19 has ten independently sourced new verses and leaves 561 v18 questions immutable",()=>{
 assert.equal(BANK_VERSION, 72);
 assert.equal(bankV18.length,561);
 assert.equal(bankV19.length,571);
 assert.equal(publishedNewQuestionsV19.length,10);
 assert.equal(questions.length, 1500);
 assert.equal(playableQuestions().length, 1500);
 assert.ok(bankV18.every((q,i)=>q===bankV19[i]));
 assert.equal(new Set(bankV19.map(q=>q.id)).size,571);
 const norm=(s:string)=>s.normalize("NFKC").toLocaleLowerCase("tr-TR").replace(/[^\p{L}\p{N}]+/gu," ").trim();
 assert.equal(new Set(bankV19.map(q=>norm(q.question))).size,571);
 const oldSourceLocators=new Set(bankV18.flatMap(q=>q.sources.map(s=>s.locator)));
 for(const q of publishedNewQuestionsV19) {
  assert.equal(q.reviewStatus,"approved");
  assert.equal(q.sources[0]!.checkStatus,"supported");
  assert.equal(q.sources[0]!.checkedAt,"2026-10-20");
  assert.equal(q.sources[0]!.publisher,"Diyanet İşleri Başkanlığı");
  assert.match(q.sources[0]!.url,/^https:\/\/kuran\.diyanet\.gov\.tr\//);
  assert.equal(oldSourceLocators.has(q.sources[0]!.locator),false);
  assert.ok(q.explanation.length>65);
  assert.equal(q.options.length,4);
  assert.equal(new Set(q.options.map(x=>x.text)).size,4);
  assert.ok(q.options.some(x=>x.id===q.correctOptionId));
  assert.equal(knownQuestion(18,q.id),false);
  assert.equal(knownQuestion(19,q.id),true);
  assert.ok(belongsToLearningTopic(q.id,publishedNewQuestionTopicsV19[q.id]!));
  const order={[q.id]:q.options.map(o=>o.id)};
  assert.equal(gameQuestion({bankVersion:18,optionOrders:order},q.id),undefined);
  const current=gameQuestion({bankVersion:19,optionOrders:order},q.id)!;
  assert.equal(current.options[current.correct],q.options.find(o=>o.id===q.correctOptionId)!.text);
  assert.equal(current.explanation,q.explanation);
 }
 const sums=publishedNewQuestionsV19.reduce((m,q)=>{m[publishedNewQuestionTopicsV19[q.id]==="dualar"?"dua":"akaid"]++;return m;},{dua:0,akaid:0});
 assert.deepEqual(sums,{dua:6,akaid:4});
});

test("v19 topic round saves and v18 historical scoring is untouched",()=>{
 const time=1800000000000;
 let s=createSession("mixed",undefined,time,{learningTopic:"dualar",difficulty:"medium"});
 assert.equal(s.bankVersion, 72);
 for(let i=0;i<10;i++){s=answerQuestion(s,0,time+1000*(i+1));if(i<9)s=advanceQuestion(s)}
 const rec=finishSession(s);
 assert.deepEqual(parseData(JSON.stringify(appendGame(emptyData(),rec))).games[0],rec);
 const old=bankV18[0]!,order={[old.id]:old.options.map(o=>o.id)};
 assert.deepEqual(gameQuestion({bankVersion:18,optionOrders:order},old.id),gameQuestion({bankVersion:19,optionOrders:order},old.id));
});
