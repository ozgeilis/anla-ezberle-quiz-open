import assert from "node:assert/strict";
import { test } from "node:test";
import { bankV14 } from "../src/content/questions/archive/bank-v14";
import { bankV15 } from "../src/content/questions/archive/bank-v15";
import { bankV16 } from "../src/content/questions/archive/bank-v16";
import { BANK_VERSION, playableQuestions, questions } from "../src/content/questions";
import { publishedNewQuestionsV16, publishedNewQuestionTopicsV16 } from "../src/content/questions/published-v16";
import { gameQuestion, knownQuestion } from "../src/content/questions/registry";
import { belongsToLearningTopic, learningTopicPool } from "../src/domain/game/learning";
import { advanceQuestion, answerQuestion, createSession, finishSession, selectionConceptKeys } from "../src/domain/game/engine";
import { appendGame, emptyData, parseData } from "../src/storage/schema";

const clock = 1800000000000;
const complete = (session: ReturnType<typeof createSession>) => {
  for(let i=0;i<10;i++) {
    session=answerQuestion(session,0,clock+1000*(i+1));
    if(i<9)session=advanceQuestion(session);
  }
  return finishSession(session);
};

test("v16, 531 unchanged v15 questions plus 12 Diyanet-checked questions; no hidden drafts",()=>{
  assert.equal(BANK_VERSION, 73);
  assert.equal(bankV14.length,500);
  assert.equal(bankV15.length,531);
  assert.equal(bankV16.length,543);
  assert.equal(publishedNewQuestionsV16.length,12);
  assert.equal(questions.length, 1500);
  assert.equal(playableQuestions().length, 1500);
  assert.ok(bankV15.every((q,i)=>q===bankV16[i]));
  assert.deepEqual(bankV16.slice(0,bankV15.length),bankV15);
  assert.equal(new Set(bankV16.map(q=>q.id)).size,543);
  const oldPrompts = new Set(bankV15.map(q=>q.question.normalize("NFKC").toLocaleLowerCase("tr-TR")));
  const allPrompts = new Set(bankV16.map(q=>q.question.normalize("NFKC").toLocaleLowerCase("tr-TR")));
  assert.equal(allPrompts.size,543);
  for(const q of publishedNewQuestionsV16) {
    assert.equal(oldPrompts.has(q.question.normalize("NFKC").toLocaleLowerCase("tr-TR")),false);
    assert.equal(knownQuestion(15,q.id),false);
    assert.equal(knownQuestion(16,q.id),true);
    assert.equal(q.reviewStatus,"approved");
    assert.equal(q.sources.length,1);
    assert.equal(q.sources[0]!.checkStatus,"supported");
    assert.equal(q.sources[0]!.checkedAt,"2026-10-20");
    assert.equal(q.sources[0]!.publisher,"Diyanet İşleri Başkanlığı");
    assert.match(q.sources[0]!.url,/^https:\/\/kuran\.diyanet\.gov\.tr\//);
    assert.ok(q.sources[0]!.locator.length>6);
    assert.equal(q.options.length,4);
    assert.equal(new Set(q.options.map(o=>o.text)).size,4);
    assert.ok(q.options.some(o=>o.id===q.correctOptionId));
    assert.ok(q.explanation.length>=35);
    assert.ok(selectionConceptKeys(q).length>=2);
    assert.ok(belongsToLearningTopic(q.id,publishedNewQuestionTopicsV16[q.id]!));
  }
  const topics=["dualar","akaid"] as const;
  assert.deepEqual(topics.map(topic=>publishedNewQuestionsV16.filter(q=>belongsToLearningTopic(q.id,topic)).length),[9,3]);
  for(const topic of topics) {
    const selected=learningTopicPool(bankV16,topic);
    assert.ok(selected.some(q=>q.id.startsWith("learn-")));
    assert.ok(selected.every(q=>q.reviewStatus==="approved"));
  }
});

test("v16 new questions display correctly, while historic v15 question IDs remain hidden from v15 registry",()=>{
  const q=publishedNewQuestionsV16[0]!;
  const order={ [q.id]: q.options.map(x=>x.id) };
  const current=gameQuestion({bankVersion:16,optionOrders:order},q.id)!;
  assert.equal(current.options[current.correct],q.options.find(x=>x.id===q.correctOptionId)!.text);
  assert.equal(current.explanation,q.explanation);
  assert.equal(current.source.locator,q.sources[0]!.locator);
  assert.equal(gameQuestion({bankVersion:15,optionOrders:order},q.id),undefined);
  const old=bankV15[0]!;
  const oldOrder={ [old.id]: old.options.map(x=>x.id) };
  assert.deepEqual(
    gameQuestion({bankVersion:15,optionOrders:oldOrder},old.id),
    gameQuestion({bankVersion:16,optionOrders:oldOrder},old.id),
  );
});

test("new v16 topic records and old v15 round preserve score, metadata, and save validity",()=>{
  const now=complete(createSession("mixed",undefined,clock,{difficulty:"easy",learningTopic:"dualar"}));
  assert.equal(now.bankVersion, 73);
  assert.equal(now.learningTopic,"dualar");
  assert.equal(now.learningTopicVersion,3);
  assert.equal(now.questionIds.length,10);
  assert.ok(now.questionIds.every(id=>belongsToLearningTopic(id,"dualar")));
  assert.deepEqual(parseData(JSON.stringify(appendGame(emptyData(),now))).games[0],now);
  const old=bankV15[0]!;
  const order=old.options.map(o=>o.id);
  assert.ok(gameQuestion({bankVersion:15,optionOrders:{[old.id]:order}},old.id));
  assert.throws(()=>parseData(JSON.stringify({...emptyData(),games:[{...now,bankVersion:15}]})),/doğrulanamadı/);
});
