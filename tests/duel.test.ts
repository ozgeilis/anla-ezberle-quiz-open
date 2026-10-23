import assert from "node:assert/strict";
import { test } from "node:test";
import {
  appendDuelEvent,
  createDemoDocument,
  demoPlayers,
  DuelDocument,
  DuelCommand,
  parseDemo,
  restoreDemo,
  Role,
} from "../src/domain/duel/machine";
import { gameQuestion } from "../src/content/questions/registry";
import { stats } from "../src/domain/game/engine";

const time = Date.parse("2026-10-18T12:00:00Z");
const send = (doc: DuelDocument, event: DuelCommand) =>
  appendDuelEvent(doc, { ...event, at: restoreDemo(doc).updatedAt + 1 });
function start(doc: DuelDocument, role: Role) {
  return send(doc, {
    type: "start",
    playerId: demoPlayers[role].id,
  });
}
function play(doc: DuelDocument, role: Role, correct: number) {
  let next = start(doc, role);
  for (let i = 0; i < 10; i++) {
    const match = restoreDemo(next);
    const session = match.players[role].session!;
    const question = gameQuestion(session, session.questionIds[i]!)!;
    next = appendDuelEvent(next, {
      type: "answer",
      playerId: demoPlayers[role].id,
      option: i < correct ? question.correct : (question.correct + 1) % 4,
      at: match.updatedAt + (role === "b" ? 3000 : 1000),
    });
    if (i < 9)
      next = send(next, {
        type: "next",
        playerId: demoPlayers[role].id,
      });
  }
  return send(next, {
    type: "finish",
    playerId: demoPlayers[role].id,
  });
}
const invited = () => send(createDemoDocument(time), { type: "invite" });

test("demo A ve B aynı sürümlü soru/set sırasını kullanır; cevapları ayrıdır ve A kendine rakip olamaz", () => {
  const doc = invited();
  const initial = restoreDemo(doc);
  const afterA = play(doc, "a", 8);
  assert.equal(restoreDemo(afterA).state, "waiting_for_result");
  assert.throws(() => start(afterA, "a"), /ikinci kez/);
  const withB = start(afterA, "b");
  const match = restoreDemo(withB);
  assert.deepEqual(
    match.players.a.result!.questionIds,
    match.players.b.session!.questionIds,
  );
  assert.deepEqual(
    match.players.a.result!.optionOrders,
    match.players.b.session!.optionOrders,
  );
  assert.deepEqual(match.manifest, initial.manifest);
  for (const id of match.manifest.questionIds)
    assert.equal(
      gameQuestion(match.players.b.session!, id)!.version,
      match.manifest.questionVersions[id],
    );
  assert.notEqual(match.players.a.result!.id, match.players.b.session!.id);
  assert.equal(match.players.a.result!.answers.length, 10);
  assert.deepEqual(match.players.b.session!.answers, []);
  const changed = appendDuelEvent(withB, {
    type: "answer",
    playerId: demoPlayers.b.id,
    option: 0,
    at: match.updatedAt + 1,
  });
  assert.deepEqual(
    restoreDemo(changed).players.a.result,
    match.players.a.result,
  );
  assert.equal(restoreDemo(changed).players.b.session!.answers.length, 1);
});

test("iki tamamlanmış tur ortak puan motoruyla karşılaştırılır; kazanan ve sabit sonuç doğru olur", () => {
  const a = play(invited(), "a", 8);
  const b = play(a, "b", 6);
  assert.equal(restoreDemo(b).state, "waiting_for_result");
  const complete = restoreDemo(send(b, { type: "resolve" }));
  assert.equal(complete.state, "completed");
  assert.equal(complete.outcome!.winner, "a");
  assert.deepEqual(complete.outcome!.a, stats(complete.players.a.result!));
  assert.deepEqual(complete.outcome!.b, stats(complete.players.b.result!));
  assert.equal(complete.outcome!.a.score, 800);
  assert.equal(complete.outcome!.b.score, 600);
  assert.equal(complete.outcome!.a.wrong, 2);
});

test("eşit doğrular farklı sürelere rağmen beraberliktir; süre bonusu eklenmez", () => {
  const both = play(play(invited(), "a", 5), "b", 5);
  const match = restoreDemo(send(both, { type: "resolve" }));
  assert.notEqual(match.outcome!.a.seconds, match.outcome!.b.seconds);
  assert.equal(match.outcome!.winner, "tie");
  assert.equal(match.outcome!.a.score, 500);
  assert.equal(match.outcome!.b.score, 500);
});

test("çift cevap, yinelenen bitirme ve sonuç isteği yeniden puan/sonuç üretmez", () => {
  const first = start(invited(), "a");
  const answered = appendDuelEvent(first, {
    type: "answer",
    playerId: demoPlayers.a.id,
    option: 0,
    at: restoreDemo(first).updatedAt + 1,
  });
  assert.equal(
    appendDuelEvent(answered, {
      type: "answer",
      playerId: demoPlayers.a.id,
      option: 1,
      at: restoreDemo(answered).updatedAt + 1,
    }),
    answered,
  );
  const a = play(invited(), "a", 10);
  assert.equal(
    send(a, { type: "finish", playerId: demoPlayers.a.id } as Parameters<
      typeof send
    >[1]),
    a,
  );
  const complete = send(play(a, "b", 0), { type: "resolve" });
  assert.equal(send(complete, { type: "resolve" }), complete);
  assert.equal(
    send(complete, { type: "finish", playerId: demoPlayers.a.id } as Parameters<
      typeof send
    >[1]),
    complete,
  );
  assert.equal(restoreDemo(complete).outcome!.a.score, 1000);
});

test("geçersiz geçişler ve yabancı oyuncu reddedilir; cancelled/expired terminaldir", () => {
  const created = createDemoDocument(time);
  assert.throws(() => start(created, "a"));
  assert.throws(() => send(created, { type: "resolve" }));
  const doc = invited();
  assert.throws(() => start(doc, "b"));
  assert.throws(() => send(doc, { type: "invite" }));
  assert.throws(() =>
    send(doc, { type: "start", playerId: "unknown" } as Parameters<
      typeof send
    >[1]),
  );
  const active = start(doc, "a");
  assert.throws(() =>
    send(active, { type: "next", playerId: demoPlayers.a.id } as Parameters<
      typeof send
    >[1]),
  );
  assert.throws(() =>
    appendDuelEvent(active, {
      type: "answer",
      playerId: demoPlayers.b.id,
      option: 0,
      at: restoreDemo(active).updatedAt + 1,
    }),
  );
  assert.throws(() =>
    send(active, { type: "finish", playerId: demoPlayers.a.id } as Parameters<
      typeof send
    >[1]),
  );
  const cancelled = send(active, { type: "cancel" });
  assert.equal(restoreDemo(cancelled).state, "cancelled");
  assert.equal(restoreDemo(cancelled).outcome, undefined);
  assert.throws(() => start(cancelled, "b"));
  assert.throws(() => send(active, { type: "expire" }));
  const deadline = restoreDemo(active).expiresAt;
  assert.throws(() =>
    appendDuelEvent(active, {
      type: "answer",
      playerId: demoPlayers.a.id,
      option: 0,
      at: deadline,
    }),
  );
  const expired = appendDuelEvent(active, { type: "expire", at: deadline });
  assert.equal(restoreDemo(expired).state, "expired");
  assert.throws(() => send(expired, { type: "cancel" }));
});

test("demo kaydı yeniden çözülür; bozuk manifest/geçiş reddedilir, sahte skor alanları kullanılmaz", () => {
  const complete = send(play(play(invited(), "a", 7), "b", 4), {
    type: "resolve",
  });
  assert.deepEqual(
    restoreDemo(parseDemo(JSON.stringify(complete))!),
    restoreDemo(complete),
  );
  const forged = {
    ...complete,
    score: 99999,
    outcome: { winner: "b", a: { score: 0 }, b: { score: 1000 } },
  };
  assert.equal(
    restoreDemo(parseDemo(JSON.stringify(forged))!).outcome!.winner,
    "a",
  );
  assert.equal(
    restoreDemo(parseDemo(JSON.stringify(forged))!).outcome!.a.score,
    700,
  );
  assert.equal(parseDemo(null), null);
  for (const bad of [
    "{",
    "{}",
    JSON.stringify({ ...complete, version: 99 }),
    JSON.stringify({ ...complete, questionVersions: {} }),
    JSON.stringify({
      ...complete,
      seed: {
        ...complete.seed,
        questionIds: Array(10).fill(complete.seed.questionIds[0]),
      },
    }),
    JSON.stringify({
      ...complete,
      events: [{ type: "resolve", at: time + 1 }],
    }),
  ])
    assert.throws(() => parseDemo(bad));
});
