import assert from "node:assert/strict";
import { test } from "node:test";
import { bankV13 } from "../src/content/questions/archive/bank-v13";
import { bankV14 } from "../src/content/questions/archive/bank-v14";
import { bankV15 } from "../src/content/questions/archive/bank-v15";
import { publishedNewQuestionsV15, publishedNewQuestionTopicsV15 } from "../src/content/questions/published-v15";
import { BANK_VERSION, questions, playableQuestions } from "../src/content/questions";
import { gameQuestion, knownQuestion } from "../src/content/questions/registry";
import { selectionConceptKeys, createSession, answerQuestion, advanceQuestion, finishSession, stats } from "../src/domain/game/engine";
import { learningTopicPool, belongsToLearningTopic } from "../src/domain/game/learning";
import { appendGame, emptyData, parseData } from "../src/storage/schema";

const normalize=(v:string)=>v.normalize("NFKC").toLocaleLowerCase("tr-TR").replace(/[\\s\\p{P}\\p{S}]+/gu," ").trim();

test("v15 includes exactly 31 approved source-checked questions; v13 and v14 snapshots are unchanged", () => {
  assert.equal(BANK_VERSION, 73);
  assert.equal(bankV13.length, 500);
  assert.equal(bankV14.length, 500);
  assert.equal(bankV15.length, 531);
  assert.equal(questions.length, 1500);
  assert.equal(playableQuestions().length, 1500);
  assert.equal(publishedNewQuestionsV15.length, 31);
  assert.deepEqual(bankV15.slice(0,500),bankV14);
  assert.equal(new Set(bankV15.map(q=>q.id)).size,531);
  assert.equal(new Set(bankV15.map(q=>normalize(q.question))).size,531);
  for(const q of publishedNewQuestionsV15) {
    assert.equal(q.reviewStatus,"approved");
    assert.equal(q.sources.length,1);
    assert.equal(q.sources[0]!.checkStatus,"supported");
    assert.equal(q.sources[0]!.checkedAt,"2026-10-20");
    assert.match(q.sources[0]!.url, /^https:\/\/(islamansiklopedisi\.org\.tr|kuran\.diyanet\.gov\.tr)\//);
    assert.ok(q.sources[0]!.locator.length > 5);
    assert.equal(q.options.length,4);
    assert.equal(new Set(q.options.map(o=>o.id)).size,4);
    assert.equal(new Set(q.options.map(o=>normalize(o.text))).size,4);
    assert.ok(q.options.some(o=>o.id===q.correctOptionId));
    assert.ok(q.explanation.length > 20);
    assert.ok(publishedNewQuestionTopicsV15[q.id]);
    assert.ok(belongsToLearningTopic(q.id,publishedNewQuestionTopicsV15[q.id]!,1));
    assert.equal(knownQuestion(14,q.id),false);
    assert.equal(knownQuestion(15,q.id),true);
    const ordered={ [q.id]:q.options.map(o=>o.id) };
    const view=gameQuestion({bankVersion:15,optionOrders:ordered},q.id)!;
    assert.equal(view.options[view.correct],q.options.find(o=>o.id===q.correctOptionId)!.text);
  }
  assert.deepEqual(
    publishedNewQuestionsV15.reduce((v,q)=>{
      const topic=publishedNewQuestionTopicsV15[q.id]!;
      if(topic==="sahabe"||topic==="dualar"||topic==="islam_tarihi")v[topic]++;
      return v;
    }, {sahabe:0,dualar:0,islam_tarihi:0}),
    {sahabe:19,dualar:2,islam_tarihi:10},
  );
  assert.ok(learningTopicPool(playableQuestions(),"sahabe").some(q=>q.id.startsWith("learn-")));
  assert.equal(new Set(bankV15.flatMap(q=>selectionConceptKeys(q)).filter(key=>key.startsWith("id:"))).size, 0);
});

test("old v13/v14 game records preserve their answers, scores and XP alongside v15", () => {
  const time=1_800_000_000_000;
  const createOld=(version:13|14, list:typeof bankV13)=>{
    const qs=list.slice(0,10);
    const ids=qs.map(q=>q.id);
    const record={
      id:`quiz-old-bank-${version}`,mode:"mixed" as const,bankVersion:version,
      questionIds:ids,
      optionOrders:Object.fromEntries(qs.map(q=>[q.id,q.options.map(o=>o.id)])),
      startedAt:time,
      completedAt:time+10000,
      answers:qs.map((q,i)=>({questionId:q.id,option:q.options.findIndex(o=>o.id===q.correctOptionId),at:time+1000*(i+1)})),
    };
    return record;
  };
  const old13=createOld(13,bankV13);
  const old14=createOld(14,bankV14);
  const before=[stats(old13).score,stats(old14).score];
  let data=emptyData();
  data=appendGame(data,old13);
  data=appendGame(data,old14);
  const untouched=JSON.stringify(data);
  let session=createSession("mixed",undefined,time+20000,{difficulty:"easy"});
  for(let i=0;i<10;i++){session=answerQuestion(session,0,time+20000+(i+1)*1000);if(i<9)session=advanceQuestion(session);}
  const latest=finishSession(session);
  assert.equal(latest.bankVersion, 73);
  const loaded=parseData(JSON.stringify(appendGame(data,latest)));
  assert.deepEqual(loaded.games.slice(0,2),[old13,old14]);
  assert.deepEqual(loaded.games.slice(0,2).map(x=>stats(x).score),before);
  assert.equal(JSON.stringify(data),untouched);
  assert.equal(loaded.games[2]?.bankVersion,73);
});
