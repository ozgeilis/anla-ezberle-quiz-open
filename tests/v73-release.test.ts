import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import {
  BANK_VERSION,
  questions,
  playableQuestions,
} from "../src/content/questions";
import { questionsV72 } from "../src/content/questions/questions-v72";
import { questionsV73 } from "../src/content/questions/questions-v73";
import { questionsV73Candidate } from "../src/content/questions/questions-v73.candidate";
import approval from "../src/content/questions/releases/v73.json";
import {
  canonicalV73Source,
  releasedQuestionsV73,
} from "../scripts/build-release-v73";
import {
  createSession,
  answerQuestion,
  advanceQuestion,
  finishSession,
  stats,
  type GameRecord,
} from "../src/domain/game/engine";
import { gameQuestion } from "../src/content/questions/registry";
import { emptyData, parseData, validRecord } from "../src/storage/schema";
import { progress } from "../src/domain/scoring/progress";
import {
  buildOnlineContentRows,
  buildOnlineSeedSql,
} from "../scripts/online-content-export";
import { liveContent } from "../scripts/live-content";

test("v73 is the active 1500-question production bank and exactly matches owner-authorized content", () => {
  assert.equal(BANK_VERSION, 73);
  assert.equal(questions, questionsV73);
  assert.deepEqual(questions, releasedQuestionsV73());
  assert.equal(questions.length, 1500);
  assert.equal(playableQuestions("production").length, 1500);
  assert.equal(playableQuestions("prototype").length, 1500);
  assert.equal(approval.approvalType, "product-owner-publication");
  assert.equal(approval.independentExpertApproval, false);
  assert.equal(
    readFileSync("src/content/questions/questions-v73.ts", "utf8"),
    canonicalV73Source(),
  );
  for (const [i, q] of questions.entries()) {
    const candidate = questionsV73Candidate[i]!;
    assert.deepEqual(
      [
        q.id,
        q.version,
        q.question,
        q.options,
        q.correctOptionId,
        q.explanation,
        q.sources,
        q.categoryId,
        q.difficulty,
        q.conceptGroup,
      ],
      [
        candidate.id,
        candidate.version,
        candidate.question,
        candidate.options,
        candidate.correctOptionId,
        candidate.explanation,
        candidate.sources,
        candidate.categoryId,
        candidate.difficulty,
        candidate.conceptGroup,
      ],
    );
    assert.equal(q.reviewStatus, "approved");
    if (candidate.reviewStatus === "draft") {
      assert.equal(q.reviewedAt, undefined);
      assert.match(q.reviewNotes, /Ürün sahibinin/);
      assert.match(q.reviewNotes, /bağımsız ilahiyat uzmanı onayı değildir/);
    }
  }
});

test("new mixed, daily and category rounds display v73, finish and restore with real keys and score", () => {
  const start = 1800000000000;
  const preparations = [
    ...(["easy", "medium", "hard"] as const).map((difficulty) => ({
      difficulty,
    })),
    ...(
      [
        "quran_dualar",
        "siyer_sahabe",
        "peygamberler",
        "fikih",
        "iman_ahlak",
        "tarih_medeniyet",
      ] as const
    ).map((playCategory) => ({ playCategory, difficulty: "easy" as const })),
  ];
  const rounds = [
    ...preparations.map((options) => ({ mode: "mixed" as const, options })),
    { mode: "daily" as const, options: {} },
  ];
  for (const { mode, options } of rounds) {
    let session = createSession(mode, undefined, start, {
      ...options,
      channel: "production",
    });
    assert.equal(session.bankVersion, 73);
    for (let i = 0; i < 10; i++) {
      const view = gameQuestion(session, session.questionIds[i]!)!;
      const source = questions.find((q) => q.id === view.id)!;
      assert.equal(view.text, source.question);
      assert.equal(
        view.options[view.correct],
        source.options.find((o) => o.id === source.correctOptionId)!.text,
      );
      assert.equal(view.explanation, source.explanation);
      session = answerQuestion(session, view.correct, start + (i + 1) * 1000);
      if (i < 9) session = advanceQuestion(session);
    }
    const record = finishSession(session);
    assert.equal(stats(record).score, 1000);
      assert(!validRecord({ ...record, bankVersion: 74 }));
      if (record.playCategory)
        assert(!validRecord({ ...record, playCategoryVersion: 1 }));
    const restored = parseData(
      JSON.stringify({ ...emptyData(), games: [record] }),
    );
    assert.deepEqual(restored.games, [record]);
  }
});

test("saved v72 answers, wording, score and XP survive new v73 games without migration or rescoring", () => {
  const old = questionsV72.slice(0, 10);
  const saved: GameRecord = {
    id: "quiz-historical-v72-before-v73",
    bankVersion: 72,
    mode: "mixed",
    startedAt: 1800000000000,
    completedAt: 1800000010000,
    questionIds: old.map((q) => q.id),
    optionOrders: Object.fromEntries(
      old.map((q) => [q.id, q.options.map((o) => o.id).reverse()]),
    ),
    answers: old.map((q, i) => ({
      questionId: q.id,
      option: [...q.options]
        .reverse()
        .findIndex((o) => o.id === q.correctOptionId),
      at: 1800000000000 + (i + 1) * 1000,
    })),
  };
  const before = {
    views: saved.questionIds.map((id) => gameQuestion(saved, id)),
    score: stats(saved),
    xp: progress([saved]),
  };
  const roundTrip = parseData(
    JSON.stringify({ ...emptyData(), games: [saved] }),
  ).games[0]!;
  assert.deepEqual(roundTrip, saved);
  assert.deepEqual(
    {
      views: roundTrip.questionIds.map((id) => gameQuestion(roundTrip, id)),
      score: stats(roundTrip),
      xp: progress([roundTrip]),
    },
    before,
  );
  const id = "q67-ankebut-40";
  const order = questionsV72.find((q) => q.id === id)!.options.map((o) => o.id);
  const prior = gameQuestion(
    { bankVersion: 72, optionOrders: { [id]: order } },
    id,
  )!;
  const current = gameQuestion(
    { bankVersion: 73, optionOrders: { [id]: order } },
    id,
  )!;
  assert.equal(prior.options[prior.correct], "Şiddetli sarsıntı");
  assert.equal(current.options[current.correct], "Korkunç ses");
});

test("v73 online projections preserve private keys; explicit v72 staging remains immutable and separate", () => {
  const current = buildOnlineContentRows();
  const old = buildOnlineContentRows(questionsV72, 72);
  assert(current.every((q) => q.contentScope === "bank-v73"));
  assert(old.every((q) => q.contentScope === "bank-v72"));
  assert.match(
    buildOnlineSeedSql(old, 72),
    /validate_online_bank\('bank-v72'\)/,
  );
  assert.match(
    buildOnlineSeedSql(current),
    /validate_online_bank\('bank-v73'\)/,
  );
  assert.throws(() => buildOnlineSeedSql(old), /canonical/);
  const live = liveContent();
  assert.equal(live.version, 73);
  for (const row of live.rows) {
    assert.deepEqual(Object.keys(row.public).sort(), [
      "id",
      "options",
      "prompt",
      "version",
    ]);
    assert.equal(
      row.correct,
      questions.find((q) => q.id === row.id)!.correctOptionId,
    );
  }
});
