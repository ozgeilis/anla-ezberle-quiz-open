import assert from "node:assert/strict";
import test from "node:test";
import { playableQuestions } from "../src/content/questions";
import { bankV46 as questions } from "../src/content/questions/archive/bank-v46";
import { bankV45 } from "../src/content/questions/archive/bank-v45";
import { publishedCorrectionsV46 } from "../src/content/questions/published-v46";
import { gameQuestion,knownQuestion } from "../src/content/questions/registry";

test("v46 only corrects one question, preserves 669 IDs and previous game version", () => {
  assert.equal(questions.length,669);
  assert.equal(playableQuestions("production",questions).length,669);
  assert.equal(bankV45.length,669);
  assert.equal(publishedCorrectionsV46.length,1);
  const old=bankV45.find(q=>q.id==="q44-duha-10")!;
  const corrected=questions.find(q=>q.id===old.id)!;
  assert.equal(corrected.version,old.version+1);
  assert.equal(corrected.question,"Duhâ 93/10'da yardım isteyene karşı hangi davranıştan sakınılması öğütlenir?");
  assert.equal(corrected.options.find(o=>o.id===corrected.correctOptionId)?.text,"Azarlamak");
  assert.ok(corrected.explanation.includes("azarlamamak"));
  assert.equal(knownQuestion(45,old.id),true);
  assert.equal(knownQuestion(46,old.id),true);
  const previousOrder=old.options.map(o=>o.id);
  const oldView=gameQuestion({bankVersion:45,optionOrders:{[old.id]:previousOrder}},old.id);
  const newView=gameQuestion({bankVersion:46,optionOrders:{[old.id]:previousOrder}},old.id);
  assert.equal(oldView?.options[1],"Azarlamamak");
  assert.equal(newView?.options[1],"Azarlamak");
  for(let i=0;i<questions.length;i++){
    if(questions[i]?.id===old.id)continue;
    assert.deepEqual(questions[i],bankV45[i]);
  }
});
