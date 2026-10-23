import { publishedCorrectionsV41 } from "../src/content/questions/published-v41";
import { publishedCorrectionsV40 } from "../src/content/questions/published-v40";
import { publishedCorrectionsV39 } from "../src/content/questions/published-v39";
import { publishedCorrectionsV38 } from "../src/content/questions/published-v38";
import { publishedCorrectionsV37 } from "../src/content/questions/published-v37";
import { publishedCorrectionsV36 } from "../src/content/questions/published-v36";
import { publishedCorrectionsV35 } from "../src/content/questions/published-v35";
import { publishedCorrectionsV34 } from "../src/content/questions/published-v34";
import { publishedCorrectionsV33 } from "../src/content/questions/published-v33";
import { publishedCorrectionsV32 } from "../src/content/questions/published-v32";
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  categories,
  questionById,
  questions,
  playableQuestions,
  Question,
} from "../src/content/questions";
import {
  advanceQuestion,
  answerQuestion,
  createSession as newSession,
  selectQuestions,
  selectionConceptKeys,
  dateKey,
  finishSession,
  GameRecord,
  Session,
  stats,
} from "../src/domain/game/engine";
import { gameQuestion, knownQuestion } from "../src/content/questions/registry";
import { bankV2 } from "../src/content/questions/archive/bank-v2";
import { bankV3 } from "../src/content/questions/archive/bank-v3";
import { bankV4, newCandidatesV4 } from "../src/content/questions/archive/bank-v4";
import { bankV5 } from "../src/content/questions/archive/bank-v5";
import { bankV6, v6VerseCountDistractors } from "../src/content/questions/archive/bank-v6";
import { bankV7 } from "../src/content/questions/archive/bank-v7";
import { newCandidatesV7 } from "../src/content/questions/candidates-v7";
import { bankV8 } from "../src/content/questions/archive/bank-v8";
import { newCandidatesV8 } from "../src/content/questions/candidates-v8";
import { bankV9 } from "../src/content/questions/archive/bank-v9";
import { newCandidatesV9 } from "../src/content/questions/candidates-v9";
import { bankV10 } from "../src/content/questions/archive/bank-v10";
import { newCandidatesV10 } from "../src/content/questions/candidates-v10";
import { bankV11 } from "../src/content/questions/archive/bank-v11";
import { newCandidatesV11 } from "../src/content/questions/candidates-v11";
import { bankV12 } from "../src/content/questions/archive/bank-v12";
import { newCandidatesV12 } from "../src/content/questions/candidates-v12";
import { bankV13 } from "../src/content/questions/archive/bank-v13";
import { bankV14 } from "../src/content/questions/archive/bank-v14";
import { difficultyCalibrationV14, difficultyCalibrationCountV14 } from "../src/content/questions/difficulty-calibration-v14";
import { newCandidatesV13 } from "../src/content/questions/candidates-v13";
import { progress } from "../src/domain/scoring/progress";
import { appendGame, emptyData, parseData } from "../src/storage/schema";

// Tests explicitly exercise the development bank; production defaults are tested separately.
const createSession: typeof newSession = (mode, focus, now, options) =>
  newSession(mode, focus, now, { channel: "prototype", ...options });
const time = Date.parse("2026-10-18T12:00:00Z");
function complete(session: Session, count = 10): GameRecord {
  let current = session;
  for (let i = 0; i < 10; i++) {
    const q = gameQuestion(current, current.questionIds[i]!)!;
    current = answerQuestion(
      current,
      i < count ? q.correct : (q.correct + 1) % 4,
      current.startedAt + (i + 1) * 3000,
    );
    if (i < 9) current = advanceQuestion(current);
  }
  return finishSession(current);
}
test("10 farklı soruluk tur tamamlanır; doğru, yanlış, puan ve süre gerçek yanıtlardan hesaplanır", () => {
  const session = createSession("mixed", undefined, time);
  assert.equal(new Set(session.questionIds).size, 10);
  const result = complete(session, 6);
  assert.deepEqual(stats(result), {
    correct: 6,
    wrong: 4,
    score: 600,
    seconds: 30,
  });
  assert.equal(complete(createSession(), 10).answers.length, 10);
  assert.equal(stats(complete(createSession(), 0)).score, 0);
});
test("çift basma, yanıt değiştirme ve yanıtsız sonraki soru puan üretemez", () => {
  const initial = createSession();
  assert.equal(advanceQuestion(initial), initial);
  const q = gameQuestion(initial, initial.questionIds[0]!)!;
  const answered = answerQuestion(initial, q.correct);
  assert.equal(answerQuestion(answered, q.correct), answered);
  assert.equal(answerQuestion(answered, (q.correct + 1) % 4), answered);
  const next = advanceQuestion(answered);
  assert.equal(advanceQuestion(next), next);
  assert.equal(answerQuestion(next, -1), next);
  assert.equal(answerQuestion(next, 4), next);
  assert.throws(() => finishSession(next));
});
test("tekrar oyna bağımsız kimlik, boş yanıtlar ve sıfır skor ile başlar", () => {
  const old = complete(createSession(), 9);
  const replay = createSession();
  assert.notEqual(old.id, replay.id);
  assert.deepEqual(replay.answers, []);
  assert.equal(replay.cursor, 0);
  assert.equal(stats({ ...replay, completedAt: replay.startedAt }).score, 0);
  assert.equal(stats(old).score, 900);
});
test("sonuç yazımı idempotenttir; ikinci kayıt XP veya rozet üretmez", () => {
  const record = complete(createSession("mixed", undefined, time), 5);
  const once = appendGame(emptyData(), record);
  const twice = appendGame(once, record);
  assert.equal(twice, once);
  assert.equal(twice.games.length, 1);
  assert.equal(progress(twice.games).xp, 50);
  assert.deepEqual(parseData(JSON.stringify(once)), once);
});
test("bozuk/eksik/yabancı sürümlü yerel kayıt güvenli biçimde reddedilir", () => {
  for (const value of [
    "{",
    "{}",
    JSON.stringify({ version: 99 }),
    JSON.stringify({ ...emptyData(), games: [{ score: 1000 }] }),
    JSON.stringify({ ...emptyData(), profile: {} }),
  ])
    assert.throws(() => parseData(value));
  const fresh = parseData(null);
  assert.equal(progress(fresh.games).xp, 0);
  assert.equal(progress(fresh.games).badges.filter((b) => b.earned).length, 0);
});
test("geçersiz yanıt, süre, yinelenen soru ve tekrarlanan kayıt başarıya dönüşmez", () => {
  const record = complete(createSession("mixed", undefined, time));
  const candidates = [
    { ...record, answers: record.answers.slice(0, 9) },
    { ...record, completedAt: time - 1 },
    { ...record, bankVersion: 99 },
    { ...record, questionIds: Array(10).fill(record.questionIds[0]) },
    {
      ...record,
      answers: record.answers.map((a, i) =>
        i === 0 ? { ...a, option: 99 } : a,
      ),
    },
    { ...record, questionIds: ["unknown", ...record.questionIds.slice(1)] },
  ];
  for (const candidate of candidates)
    assert.throws(() =>
      parseData(JSON.stringify({ ...emptyData(), games: [candidate] })),
    );
  assert.throws(() =>
    parseData(JSON.stringify({ ...emptyData(), games: [record, record] })),
  );
});
test("puan önbelleği güvenilmez: eklenen sahte skor ve XP alanları kullanılmaz", () => {
  const record = complete(createSession("mixed", undefined, time), 0);
  const parsed = parseData(
    JSON.stringify({
      ...emptyData(),
      xp: 99999,
      games: [{ ...record, score: 1000 }],
    }),
  );
  assert.equal(stats(parsed.games[0]!).score, 0);
  assert.equal(progress(parsed.games).xp, 0);
  assert.equal(
    progress(parsed.games).badges.find((b) => b.id === "perfect")!.earned,
    false,
  );
});
test("günlük set İstanbul tarihine ve içerik sürümüne bağlıdır; gün başına bir sonuç kaydedilir", () => {
  const a = createSession("daily", undefined, time);
  const b = createSession("daily", undefined, time + 3000);
  const c = createSession("daily", undefined, time + 86400000);
  assert.deepEqual(a.questionIds, b.questionIds);
  assert.notDeepEqual(a.questionIds, c.questionIds);
  assert.equal(dateKey(new Date("2026-10-18T21:01:00Z")), "2026-10-19");
  const stored = appendGame(emptyData(), complete(a));
  assert.throws(() => appendGame(stored, complete(b)));
});
test("kategori turları açıkça 5 odak ve 5 karma olmak üzere 10 benzersiz soru içerir", () => {
  for (const category of categories) {
    const session = createSession("focus", category.id, time);
    assert.equal(session.questionIds.length, 10);
    assert.equal(new Set(session.questionIds).size, 10);
    assert.equal(
      session.questionIds.filter(
        (id) => questionById.get(id)!.categoryId === category.id,
      ).length,
      5,
    );
  }
});
test("dört rozet yalnızca gerçekten tamamlanmış bilgi turlarından kazanılır", () => {
  const games = categories.map((cat) =>
    complete(createSession("focus", cat.id, time), 10),
  );
  assert.equal(
    progress(games).badges.every((b) => b.earned),
    true,
  );
  assert.equal(progress(games).xp, 400);
  assert.equal(progress(games).level, 2);
  assert.equal(progress(games).best, 1000);
});
test("1500 kaynaklı yayın sorusunun kimlikleri, seçenekleri ve açıklamaları eksiksizdir", () => {
  assert.equal(questions.length, 1500);
  assert.equal(questionById.size, questions.length);
  for (const q of questions) {
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options.map((o) => o.text)).size, 4);
    assert.equal(new Set(q.options.map((o) => o.id)).size, 4);
    assert.ok(q.options.some((o) => o.id === q.correctOptionId));
    assert.equal(q.reviewStatus, "approved");
    assert.ok(q.sources.length > 0 && q.explanation.length > 0);
    for (const source of q.sources) {
      assert.ok(source.url.startsWith("https://"));
      assert.ok(
        source.title && source.publisher && source.locator && source.supports,
      );
    }
    assert.ok(["easy", "medium", "hard"].includes(q.difficulty));
    assert.ok(q.reviewNotes && q.reviewedAt === undefined);
    const archived = bankV13.find((item) => item.id === q.id);
    if (!archived) {
      assert.match(q.id, /^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)+$/u, "Stable published question ID");
      assert.equal(q.sources[0]!.checkStatus, "supported");
      continue;
    }
    if ([...publishedCorrectionsV32, ...publishedCorrectionsV33, ...publishedCorrectionsV34, ...publishedCorrectionsV35, ...publishedCorrectionsV36, ...publishedCorrectionsV37, ...publishedCorrectionsV38, ...publishedCorrectionsV39, ...publishedCorrectionsV40, ...publishedCorrectionsV41].some((correction) => correction.id === q.id)) {
      assert.deepEqual(q, [...publishedCorrectionsV32, ...publishedCorrectionsV33, ...publishedCorrectionsV34, ...publishedCorrectionsV35, ...publishedCorrectionsV36, ...publishedCorrectionsV37, ...publishedCorrectionsV38, ...publishedCorrectionsV39, ...publishedCorrectionsV40, ...publishedCorrectionsV41].reverse().find((correction) => correction.id === q.id));
      assert.equal(q.updatedAt, "2026-10-21");
      continue;
    }
    const changed = archived.difficulty !== q.difficulty;
    assert.equal(q.version, archived.version + Number(changed));
    assert.equal(q.updatedAt, changed ? "2026-10-20" : archived.updatedAt);
    assert.ok(q.reviewNotes.includes("Ürün sahibinin"));
    assert.ok(q.reviewNotes.includes("Bağımsız editör"));
  }
});

test("karma turlar dengeli, yakın kavramlar ayrı ve tekrar oyunda yeni sorular önceliklidir", () => {
  let previous: string[] = [];
  for (let i = 0; i < 40; i++) {
    const session = createSession("mixed", undefined, time, {
      recentIds: previous,
    });
    const selected = session.questionIds.map((id) => questionById.get(id)!);
    assert.deepEqual(
      categories
        .map((c) => selected.filter((q) => q.categoryId === c.id).length)
        .sort(),
      [2, 2, 3, 3],
    );
    assert.equal(new Set(selected.map((q) => q.conceptGroup)).size, 10);
    assert.equal(
      session.questionIds.filter((id) => previous.includes(id)).length,
      0,
    );
    previous = session.questionIds;
  }
  for (const category of categories) {
    const first = createSession("focus", category.id, time);
    const next = createSession("focus", category.id, time, {
      recentIds: first.questionIds,
    });
    assert.equal(
      next.questionIds.filter((id) => first.questionIds.includes(id)).length,
      0,
    );
  }
  assert.throws(
    () => selectQuestions(questions.slice(0, 4), "focus", "quran"),
    /yeterli/,
  );
  assert.throws(
    () => selectQuestions(questions, "focus", undefined),
    /kategori/,
  );
});

test("farklı ID ile aynı cevap ve tekrar eden sûre şablonları aynı turda seçilmez", () => {
  const legacyRevelation = questionById.get("prophets-005")!;
  const newRevelation = questionById.get("e150-history-001")!;
  assert.ok(selectionConceptKeys(legacyRevelation).some((key) =>
    selectionConceptKeys(newRevelation).includes(key) && key.startsWith("fact:"),
  ));
  const surahCounts = ["quran-011", "pilot-quran-002", "e150-quran-001", "e150-quran-003"]
    .map((id) => bankV13.find((q) => q.id === id)!);
  assert.ok(surahCounts.every((q) =>
    selectionConceptKeys(q).includes("template:surah-verse-count")
  ));
  const surahOrders = ["quran-002", "quran-004", "e150-quran-002", "e150-quran-004"]
    .map((id) => bankV13.find((q) => q.id === id)!);
  assert.ok(surahOrders.every((q) =>
    selectionConceptKeys(q).includes("template:surah-mushaf-order")
  ));
  for (const mode of ["mixed", "focus"] as const) {
    for (let round = 0; round < 150; round++) {
      const focus = mode === "focus" ? categories[round % categories.length]!.id : undefined;
      const session = createSession(mode, focus, time + round);
      const selected = session.questionIds.map((id) => questionById.get(id)!);
      const allKeys = selected.flatMap(selectionConceptKeys);
      assert.equal(new Set(allKeys).size, allKeys.length,
        `Tekrarlanan soru konusu: ${session.questionIds.join(", ")}`);
      const normalizedTexts = selected.map((q) =>
        q.question.normalize("NFKC").toLocaleLowerCase("tr-TR")
          .replace(/[\s\p{P}\p{S}]+/gu, " ").trim()
      );
      assert.equal(new Set(normalizedTexts).size, 10,
        "Aynı turda aynı metin iki kez gösterilmemelidir");
      assert.equal(selected.length, 10);
    }
  }
});

test("seçenek karıştırma doğru kimliğini korur ve eksik/bozuk sıralama kaydedilemez", () => {
  const positions = new Set<number>();
  for (let i = 0; i < 20; i++) {
    const session = createSession("mixed", undefined, time);
    for (const id of session.questionIds) {
      const q = questionById.get(id)!;
      const view = gameQuestion(session, id)!;
      assert.equal(
        view.options[view.correct],
        q.options.find((o) => o.id === q.correctOptionId)!.text,
      );
      positions.add(view.correct);
      assert.deepEqual(
        [...session.optionOrders![id]!].sort(),
        q.options.map((o) => o.id).sort(),
      );
    }
    assert.equal(stats(complete(session)).score, 1000);
  }
  assert.equal(positions.size, 4);
  const record = complete(createSession("mixed", undefined, time));
  for (const optionOrders of [
    undefined,
    {},
    {
      ...record.optionOrders,
      [record.questionIds[0]!]: ["o1", "o1", "o3", "o4"],
    },
    {
      ...record.optionOrders,
      [record.questionIds[0]!]: ["o1", "o2", "o3", "other"],
    },
  ])
    assert.throws(() =>
      parseData(
        JSON.stringify({
          ...emptyData(),
          games: [{ ...record, optionOrders }],
        }),
      ),
    );
  const a = createSession("daily", undefined, time);
  const b = createSession("daily", undefined, time + 1000, {
    recentIds: a.questionIds,
  });
  assert.deepEqual(a.optionOrders, b.optionOrders);
});

test("v1 tamamlanmış kayıtlar göç gerektirmeden eski anahtarla okunur; yeni banka eski skor ve XP’yi değiştirmez", () => {
  const ids = [
    "quran-001",
    "quran-002",
    "quran-003",
    "quran-004",
    "quran-005",
    "prophets-001",
    "prophets-002",
    "prophets-003",
    "prophets-004",
    "prophets-005",
  ];
  // Sabit v1 yanıt indeksi; güncel anahtardan türetilmez.
  const originalAnswers = [1, 2, 3, 0, 1, 2, 1, 0, 2, 3];
  const old: GameRecord = {
    id: "quiz-legacy-20261018",
    bankVersion: 1,
    mode: "mixed",
    questionIds: ids,
    startedAt: time,
    completedAt: time + 30000,
    answers: ids.map((id, i) => ({
      questionId: id,
      option: originalAnswers[i]!,
      at: time + (i + 1) * 3000,
    })),
  };
  const stored = parseData(JSON.stringify({ ...emptyData(), games: [old] }));
  const before = JSON.stringify(stored);
  assert.equal(stats(stored.games[0]!).score, 600);
  assert.equal(progress(stored.games).xp, 60);
  const current = complete(createSession("mixed", undefined, time));
  const next = appendGame(stored, current);
  assert.equal(JSON.stringify(stored), before);
  assert.deepEqual(next.games[0], old);
  assert.equal(stats(next.games[0]!).score, 600);
  // Catalog replacement models a later edit; scoring resolves the immutable bank registry.
  const catalog = questionById as Map<string, Question>;
  const original = catalog.get(current.questionIds[0]!)!;
  try {
    catalog.set(original.id, {
      ...original,
      correctOptionId: original.options.find(
        (o) => o.id !== original.correctOptionId,
      )!.id,
    });
    assert.equal(stats(current).score, 1000);
    assert.equal(stats(old).score, 600);
    assert.equal(gameQuestion(old, "quran-001")!.options[3], "7");
  } finally {
    catalog.set(original.id, original);
  }
});


// Archived bank-v2 scores and its original 50 immutable questions remain available.
test("v3 16 yeni taslak açar; eski v2 sonuçları ve puanlar değişmez", () => {
  assert.equal(bankV2.length, 50);
  assert.equal(questions.filter((q) => q.id.startsWith("pilot-")).length, 16);
  assert.equal(bankV3.length, 66);
  assert.equal(knownQuestion(2, "pilot-quran-001"), false);
  assert.equal(knownQuestion(3, "pilot-quran-001"), true);
  const newGame = createSession("mixed", undefined, time);
  assert.equal(newGame.bankVersion, 72);
  const sampled = questions.find((q) => q.id === "pilot-quran-001")!;
  const newView = gameQuestion(
    { bankVersion: 3, optionOrders: { [sampled.id]: sampled.options.map((o) => o.id) } },
    sampled.id,
  )!;
  assert.equal(newView.text, sampled.question);
  assert.equal(newView.options[newView.correct], "Bakara");

  const archived = bankV2.slice(0, 10);
  const game: GameRecord = {
    id: "quiz-archived-v2-test",
    bankVersion: 2,
    mode: "mixed",
    questionIds: archived.map((q) => q.id),
    optionOrders: Object.fromEntries(
      archived.map((q) => [q.id, q.options.map((o) => o.id)]),
    ),
    startedAt: time,
    completedAt: time + 30000,
    answers: archived.map((q, i) => ({
      questionId: q.id,
      option: q.options.findIndex((o) => o.id === q.correctOptionId),
      at: time + (i + 1) * 3000,
    })),
  };
  const loaded = parseData(JSON.stringify({ ...emptyData(), games: [game] }));
  assert.equal(loaded.games[0]?.bankVersion, 2);
  assert.equal(stats(loaded.games[0]!).score, 1000);
  assert.equal(loaded.games[0]?.questionIds.length, 10);
  assert.equal(
    gameQuestion(loaded.games[0]!, archived[0]!.id)?.text,
    archived[0]!.question,
  );
  const completedV3 = complete(newGame);
  assert.equal(stats(completedV3).score, 1000);
  assert.equal(
    parseData(JSON.stringify({ ...emptyData(), games: [completedV3] })).games.length,
    1,
  );
});

test("üretim yalnız onaylı sürümleri oynatır; v13 sorularıyla 500ü sahibince onaylı", () => {
  assert.equal(playableQuestions().length, 1500);
  const sample = questions[0]!;
  const mixed: Question[] = [
    { ...sample, id: "draft", reviewStatus: "draft" },
    { ...sample, id: "reviewed", reviewStatus: "reviewed" },
    { ...sample, id: "approved", reviewStatus: "approved" },
  ];
  assert.deepEqual(
    playableQuestions("production", mixed).map((q) => q.id),
    ["approved"],
  );
  assert.equal(playableQuestions("prototype", mixed).length, 3);
  assert.equal(playableQuestions("prototype").length, 1500);
  assert.ok(playableQuestions("prototype").every((q) =>
    q.sources.length > 0 && q.sources.every((s) => s.checkStatus === "supported")
  ));
  assert.equal(playableQuestions("prototype").filter((q) => q.id.startsWith("e150-")).length, 120);
  assert.doesNotThrow(() => newSession("mixed", undefined, time));
  assert.equal(playableQuestions("production", bankV4).length, 0);
  assert.equal(playableQuestions("prototype", bankV4).length, 216);
});


test("v4 150 yeni taslak içerir; eski v3 bankası ve skorları değişmez", () => {
  assert.equal(newCandidatesV4.length, 150);
  assert.equal(questions.length, 1500);
  assert.deepEqual(
    categories.map((c) => newCandidatesV4.filter((q) => q.categoryId === c.id).length),
    [40, 40, 35, 35],
  );
  assert.equal(new Set(newCandidatesV4.map((q) => q.id)).size, 150);
  assert.ok(newCandidatesV4.every((q) => q.id.startsWith("e150-")));
  assert.ok(newCandidatesV4.every((q) => q.reviewStatus === "draft"));
  assert.ok(newCandidatesV4.every((q) => q.reviewedAt === undefined));
  const supported = newCandidatesV4.filter((q) => q.sources[0]?.checkStatus === "supported");
  const pending = newCandidatesV4.filter((q) => q.sources[0]?.checkStatus === "unverified");
  assert.equal(supported.length, 150);
  assert.equal(pending.length, 0);
  assert.ok(pending.every((q) => !playableQuestions("prototype").some((p) => p.id === q.id)));
  assert.ok(newCandidatesV4.every((q) =>
    q.sources.every((s) => s.locator && s.url.startsWith("https://"))
  ));
  const sample = newCandidatesV4[0]!;
  assert.equal(knownQuestion(3, sample.id), false);
  assert.equal(knownQuestion(4, sample.id), true);
  assert.equal(knownQuestion(3, "pilot-quran-001"), true);
  assert.equal(knownQuestion(4, "pilot-quran-001"), true);
  const oldV3 = bankV3.slice(0, 10);
  const archived: GameRecord = {
    id: "quiz-archived-v3-check",
    bankVersion: 3,
    mode: "mixed",
    questionIds: oldV3.map((q) => q.id),
    optionOrders: Object.fromEntries(oldV3.map((q) => [q.id, q.options.map((o) => o.id)])),
    startedAt: time,
    completedAt: time + 30000,
    answers: oldV3.map((q, i) => ({
      questionId: q.id,
      option: q.options.findIndex((o) => o.id === q.correctOptionId),
      at: time + (i + 1) * 3000,
    })),
  };
  const restored = parseData(JSON.stringify({ ...emptyData(), games: [archived] }));
  assert.equal(stats(restored.games[0]!).score, 1000);
  assert.equal(restored.games[0]?.bankVersion, 3);
  const current = complete(createSession("mixed", undefined, time));
  assert.equal(current.bankVersion, 72);
  assert.equal(stats(current).score, 1000);
  assert.equal(stats(restored.games[0]!).score, 1000);
});

test("v5 onay metaverisi v4 arşivini ve eski soru cevaplarını korur", () => {
  assert.equal(bankV4.length, 216);
  assert.equal(bankV5.length, 216);
  assert.ok(bankV4.every((q) => q.reviewStatus === "draft"));
  assert.ok(bankV5.every((q) => q.reviewStatus === "approved"));
  assert.deepEqual(
    bankV4.map((q) => [q.id, q.question, q.options, q.correctOptionId, q.explanation, q.sources]),
    bankV5.map((q) => [q.id, q.question, q.options, q.correctOptionId, q.explanation, q.sources]),
  );
  assert.equal(knownQuestion(4, "e150-quran-001"), true);
  assert.equal(knownQuestion(5, "e150-quran-001"), true);
  const game = complete(createSession("mixed", undefined, time));
  assert.equal(game.bankVersion, 72);
  assert.equal(parseData(JSON.stringify({...emptyData(), games: [game]})).games.length, 1);
});

test("v6 sûre âyet sayısı sorularında tahmin kalıbı yok; v5 geçmiş puan ve seçenekler korunur", () => {
  const ids = Object.keys(v6VerseCountDistractors);
  assert.equal(ids.length, 20);
  assert.equal(bankV6.length, 216);
  const previous = new Map(bankV5.map((q) => [q.id, q]));
  const rankCounts = [0, 0, 0, 0];
  let changed = 0;
  for (const q of bankV6) {
    const old = previous.get(q.id)!;
    const newAlternatives = v6VerseCountDistractors[q.id];
    if (!newAlternatives) {
      assert.equal(q, old);
      continue;
    }
    changed++;
    assert.equal(q.reviewStatus, "approved");
    assert.equal(q.correctOptionId, old.correctOptionId);
    assert.equal(q.question, old.question);
    assert.equal(q.explanation, old.explanation);
    assert.deepEqual(q.sources, old.sources);
    assert.equal(q.conceptGroup, old.conceptGroup);
    assert.equal(q.version, old.version + 1);
    const correct = Number(q.options.find((o) => o.id === q.correctOptionId)!.text);
    const answers = q.options.map((o) => Number(o.text));
    assert.ok(answers.every(Number.isSafeInteger));
    assert.equal(new Set(answers).size, 4);
    assert.equal(answers.filter((value) => value === correct).length, 1);
    rankCounts[answers.filter((value) => value < correct).length]!++;
    const order = Object.fromEntries([[q.id, q.options.map((o) => o.id)]]);
    const oldView = gameQuestion({bankVersion: 5, optionOrders: order}, q.id)!;
    const newView = gameQuestion({bankVersion: 6, optionOrders: order}, q.id)!;
    assert.notDeepEqual(oldView.options, newView.options);
    assert.equal(oldView.options[oldView.correct], newView.options[newView.correct]);
  }
  assert.equal(changed, 20);
  assert.deepEqual(rankCounts, [5, 5, 5, 5]);
  // An archived v5 game must remain readable and score exactly as before.
  const oldSet = bankV5.slice(0, 10);
  const timeV5 = Date.parse("2026-10-19T12:00:00Z");
  const archived: GameRecord = {
    id: "quiz-archived-v5-regression",
    bankVersion: 5,
    mode: "mixed",
    questionIds: oldSet.map((q) => q.id),
    optionOrders: Object.fromEntries(oldSet.map((q) => [q.id, q.options.map((o) => o.id)])),
    startedAt: timeV5,
    completedAt: timeV5 + 30000,
    answers: oldSet.map((q, i) => ({
      questionId: q.id,
      option: q.options.findIndex((o) => o.id === q.correctOptionId),
      at: timeV5 + (i + 1) * 3000,
    })),
  };
  const loaded = parseData(JSON.stringify({ ...emptyData(), games: [archived] }));
  assert.equal(stats(loaded.games[0]!).score, 1000);
  assert.equal(loaded.games[0]!.bankVersion, 5);
});

test("bütün 1500 soru arasında metin düzeyinde tekrar yoktur", () => {
  const norm = (v: string) => v.normalize("NFKC")
    .toLocaleLowerCase("tr-TR")
    .replace(/[\s\p{P}\p{S}]+/gu, " ")
    .trim();
  const seen = new Map<string, string>();
  for (const q of questions) {
    const text = norm(q.question);
    assert.equal(seen.has(text), false, `Yinelenen soru: ${seen.get(text)} / ${q.id}`);
    seen.set(text, q.id);
  }
  assert.equal(seen.size, 1500);
});

test("v4 kimlik, şık ve kaynak alanları normalize edilince de çakışmaz", () => {
  const normalize = (v: string) =>
    v.normalize("NFKC").toLocaleLowerCase("tr-TR").replace(/[\s\p{P}\p{S}]+/gu, " ").trim();
  const prompts = new Set<string>();
  for (const q of newCandidatesV4) {
    const prompt = normalize(q.question);
    assert.ok(prompt.length > 10, q.id);
    assert.equal(prompts.has(prompt), false, `Tekrar soru: ${q.id}`);
    prompts.add(prompt);
    const opts = q.options.map((o) => normalize(o.text));
    assert.equal(new Set(opts).size, 4, q.id);
    assert.equal(q.options.find((o) => o.id === q.correctOptionId)?.id, "o2", q.id);
    assert.ok(q.conceptGroup.length >= 5, q.id);
    assert.equal(q.sources.length, 1, q.id);
    assert.match(q.sources[0]!.url, /^https:\/\/(kuran\.diyanet\.gov\.tr|islamansiklopedisi\.org\.tr)\//, q.id);
    assert.ok(q.sources[0]!.locator.length > 3, q.id);
    assert.ok(q.sources[0]!.supports.length > 10, q.id);
  }
  assert.equal(prompts.size, 150);
});


test("v7: 20 yeni kaynaklı soruyla 236 soru, geçmiş v6 korunur", () => {
  assert.equal(bankV6.length, 216);
  assert.equal(bankV7.length, 236);
  assert.equal(newCandidatesV7.length, 20);
  assert.deepEqual(categories.map((c) => newCandidatesV7.filter((q) => q.categoryId === c.id).length), [5, 5, 5, 5]);
  const old = new Map(bankV6.map((q) => [q.id, q]));
  assert.ok(bankV7.slice(0, 216).every((q) => q === old.get(q.id)));
  for (const q of newCandidatesV7) {
    assert.equal(knownQuestion(6, q.id), false);
    assert.equal(knownQuestion(7, q.id), true);
    assert.ok(q.explanation.length > 20);
    assert.equal(q.reviewStatus, "approved");
    assert.equal(q.sources[0]?.checkStatus, "supported");
    assert.equal(q.sources[0]?.checkedAt, "2026-10-19");
    assert.equal(new Set(q.options.map((o) => o.text)).size, 4);
    const order = { [q.id]: q.options.map((o) => o.id) };
    const view = gameQuestion({ bankVersion: 7, optionOrders: order }, q.id)!;
    assert.equal(view.options[view.correct], q.options[1]?.text);
    assert.equal(view.explanation, q.explanation);
  }
  const game = complete(createSession("mixed", undefined, time));
  assert.equal(game.bankVersion, 72);
  assert.equal(parseData(JSON.stringify({...emptyData(), games: [game]})).games.length, 1);
});


test("v8: 20 yeni soruyla 256 kaynaklı soru ve v7 geçmişleri korunur", () => {
  assert.equal(bankV7.length, 236);
  assert.equal(bankV8.length, 256);
  assert.equal(newCandidatesV8.length, 20);
  assert.deepEqual(categories.map((c) => newCandidatesV8.filter((q) => q.categoryId === c.id).length), [5,5,5,5]);
  assert.ok(bankV8.slice(0, bankV7.length).every((q, i) => q === bankV7[i]));
  for (const q of newCandidatesV8) {
    assert.equal(knownQuestion(7, q.id), false);
    assert.equal(knownQuestion(8, q.id), true);
    assert.equal(q.reviewStatus, "approved");
    assert.ok(q.explanation.length >= 35);
    assert.equal(q.sources[0]?.checkStatus, "supported");
    assert.equal(q.sources[0]?.checkedAt, "2026-10-19");
    assert.equal(new Set(q.options.map((o) => o.text)).size, 4);
    const order = { [q.id]: q.options.map((o) => o.id) };
    const view = gameQuestion({ bankVersion: 8, optionOrders: order }, q.id)!;
    assert.equal(view.options[view.correct], q.options[1]?.text);
    assert.equal(view.explanation, q.explanation);
  }
  const round = complete(createSession("mixed", undefined, time));
  assert.equal(round.bankVersion, 72);
  assert.equal(stats(round).score, 1000);
  assert.equal(parseData(JSON.stringify({ ...emptyData(), games: [round] })).games.length, 1);
});


test("v9: 40 kaynaklı yeni soruyla 296 ve v8 skorları korunur", () => {
  assert.equal(bankV8.length, 256);
  assert.equal(bankV9.length, 296);
  assert.equal(newCandidatesV9.length, 40);
  assert.deepEqual(categories.map((c) => newCandidatesV9.filter((q) => q.categoryId === c.id).length), [10,10,10,10]);
  assert.ok(bankV9.slice(0, bankV8.length).every((q, i) => q === bankV8[i]));
  for (const q of newCandidatesV9) {
    assert.equal(knownQuestion(8, q.id), false);
    assert.equal(knownQuestion(9, q.id), true);
    assert.equal(q.reviewStatus, "approved");
    assert.ok(q.explanation.length >= 35);
    assert.equal(q.sources[0]?.checkStatus, "supported");
    assert.equal(q.sources[0]?.checkedAt, "2026-10-19");
    assert.equal(new Set(q.options.map((o) => o.text)).size, 4);
    const order = { [q.id]: q.options.map((o) => o.id) };
    const view = gameQuestion({ bankVersion: 9, optionOrders: order }, q.id)!;
    assert.equal(view.options[view.correct], q.options[1]?.text);
    assert.equal(view.explanation, q.explanation);
  }
  const round = complete(createSession("mixed", undefined, time));
  assert.equal(round.bankVersion, 72);
  assert.equal(stats(round).score, 1000);
  assert.equal(parseData(JSON.stringify({ ...emptyData(), games: [round] })).games.length, 1);
});


test("v10: 54 yeni öğretici soruyla 350 ve önceki bankalar korunur", () => {
  assert.equal(bankV9.length, 296);
  assert.equal(bankV10.length, 350);
  assert.equal(newCandidatesV10.length, 54);
  assert.deepEqual(categories.map((c) => newCandidatesV10.filter((q) => q.categoryId === c.id).length), [12,14,14,14]);
  assert.ok(bankV10.slice(0, bankV9.length).every((q, i) => q === bankV9[i]));
  for (const q of newCandidatesV10) {
    assert.equal(knownQuestion(9, q.id), false);
    assert.equal(knownQuestion(10, q.id), true);
    assert.equal(q.reviewStatus, "approved");
    assert.ok(q.explanation.length >= 35);
    assert.equal(q.sources[0]?.checkStatus, "supported");
    assert.equal(new Set(q.options.map((o) => o.text)).size, 4);
    const order = { [q.id]: q.options.map((o) => o.id) };
    const view = gameQuestion({ bankVersion: 10, optionOrders: order }, q.id)!;
    assert.equal(view.options[view.correct], q.options[1]?.text);
    assert.equal(view.explanation, q.explanation);
  }
  const round = complete(createSession("mixed", undefined, time));
  assert.equal(round.bankVersion, 72);
  assert.equal(parseData(JSON.stringify({ ...emptyData(), games: [round] })).games.length, 1);
});


test("v11: 50 yeni soru, 400 erişilebilir içerik ve sürüm geçmişi", () => {
  assert.equal(bankV10.length, 350);
  assert.equal(bankV11.length, 400);
  assert.equal(newCandidatesV11.length, 50);
  assert.deepEqual(categories.map((c) => newCandidatesV11.filter((q) => q.categoryId === c.id).length), [13, 13, 12, 12]);
  assert.ok(bankV11.slice(0, bankV10.length).every((q, i) => q === bankV10[i]));
  assert.equal(playableQuestions().length, 1500);
  assert.equal(new Set(bankV11.map((q) => q.id)).size, 400);
  for (const q of newCandidatesV11) {
    assert.equal(knownQuestion(10, q.id), false);
    assert.equal(knownQuestion(11, q.id), true);
    assert.equal(q.reviewStatus, "approved");
    assert.ok(q.explanation.length >= 35);
    assert.equal(q.sources[0]?.checkStatus, "supported");
    assert.ok(q.sources[0]?.locator.length);
    assert.equal(new Set(q.options.map((o) => o.text)).size, 4);
    const order = { [q.id]: q.options.map((o) => o.id) };
    const view = gameQuestion({ bankVersion: 11, optionOrders: order }, q.id)!;
    assert.equal(view.options[view.correct], q.options[1]?.text);
    assert.equal(view.explanation, q.explanation);
  }
  const round = complete(createSession("mixed", undefined, time));
  assert.equal(round.bankVersion, 72);
  assert.equal(parseData(JSON.stringify({ ...emptyData(), games: [round] })).games.length, 1);
});


test("v12: 50 yeni kaynaklı soru, 450 oynanabilir soru ve eski kayıtlar", () => {
  assert.equal(bankV11.length, 400);
  assert.equal(bankV12.length, 450);
  assert.equal(newCandidatesV12.length, 50);
  assert.deepEqual(categories.map((c) => newCandidatesV12.filter((q) => q.categoryId === c.id).length), [13, 13, 12, 12]);
  assert.ok(bankV12.slice(0, bankV11.length).every((q, i) => q === bankV11[i]));
  assert.equal(new Set(bankV12.map((q) => q.id)).size, 450);
  assert.equal(playableQuestions().length, 1500);
  for (const q of newCandidatesV12) {
    assert.equal(knownQuestion(11, q.id), false);
    assert.equal(knownQuestion(12, q.id), true);
    assert.equal(q.reviewStatus, "approved");
    assert.ok(q.explanation.length >= 35);
    assert.ok(q.sources[0]?.url.startsWith("https://"));
    assert.equal(q.sources[0]?.checkStatus, "supported");
    assert.ok(q.reviewNotes.includes("Bağımsız editör"));
    assert.equal(new Set(q.options.map((o) => o.text)).size, 4);
    const order = { [q.id]: q.options.map((o) => o.id) };
    const view = gameQuestion({ bankVersion: 12, optionOrders: order }, q.id)!;
    assert.equal(view.options[view.correct], q.options[1]?.text);
    assert.equal(view.explanation, q.explanation);
  }
  const round = complete(createSession("mixed", undefined, time));
  assert.equal(round.bankVersion, 72);
  assert.equal(parseData(JSON.stringify({ ...emptyData(), games: [round] })).games.length, 1);
});


test("v13: 50 yeni eğitim sorusu ile 500 toplam ve geçmiş sürümler korunur", () => {
  assert.equal(bankV12.length, 450);
  assert.equal(bankV13.length, 500);
  assert.equal(newCandidatesV13.length, 50);
  assert.deepEqual(categories.map((cat) => newCandidatesV13.filter((q) => q.categoryId === cat.id).length), [13, 13, 12, 12]);
  assert.ok(bankV13.slice(0, bankV12.length).every((q, i) => q === bankV12[i]));
  assert.equal(new Set(bankV13.map((q) => q.id)).size, 500);
  assert.equal(playableQuestions().length, 1500);
  for (const q of newCandidatesV13) {
    assert.equal(knownQuestion(12, q.id), false);
    assert.equal(knownQuestion(13, q.id), true);
    assert.equal(q.reviewStatus, "approved");
    assert.ok(q.explanation.length >= 35);
    assert.equal(q.sources[0]?.checkStatus, "supported");
    assert.ok(q.sources[0]?.locator.length);
    assert.equal(new Set(q.options.map((o) => o.text)).size, 4);
    assert.ok(q.reviewNotes.includes("Bağımsız editör"));
    const order = { [q.id]: q.options.map((o) => o.id) };
    const view = gameQuestion({ bankVersion: 13, optionOrders: order }, q.id)!;
    assert.equal(view.options[view.correct], q.options[1]?.text);
    assert.equal(view.explanation, q.explanation);
  }
  const round = complete(createSession("mixed", undefined, time));
  assert.equal(round.bankVersion, 72);
  assert.equal(parseData(JSON.stringify({ ...emptyData(), games: [round] })).games.length, 1);
});


test("zorluk seçimi 10 eşsiz soru üretir ve kayıt bütünlüğünü korur", () => {
  for (const difficulty of ["easy", "medium", "hard"] as const) {
    const session = createSession("mixed", undefined, time, { difficulty });
    assert.equal(session.difficulty, difficulty);
    assert.equal(new Set(session.questionIds).size, 10);
    for (const id of session.questionIds) {
      assert.equal(questionById.get(id)?.difficulty, difficulty);
      const view = gameQuestion(session, id)!;
      assert.equal(view.difficulty, difficulty);
      assert.ok(view.source.locator);
    }
    const completed = complete(session, 6);
    assert.equal(stats(completed).score, 600);
    assert.equal(parseData(JSON.stringify({ ...emptyData(), games: [completed] })).games[0]?.difficulty, difficulty);
  }
  const unfiltered = complete(createSession("mixed", undefined, time));
  assert.equal(unfiltered.difficulty, undefined);
  assert.equal(parseData(JSON.stringify({ ...emptyData(), games: [unfiltered] })).games.length, 1);
});


test("zorluk ardından kategori: 10 sorunun tamamı seçilen seviyeden ve konudan gelir", () => {
  for (const difficulty of ["easy", "medium", "hard"] as const) {
    for (const category of categories) {
      const available = playableQuestions("prototype").filter((q) => q.categoryId === category.id && q.difficulty === difficulty);
      if (available.length < 10) {
        assert.throws(() => createSession("focus", category.id, time, { difficulty }), /yeterli bağımsız soru/i);
        continue;
      }
      let round: Session;
      try {
        round = createSession("focus", category.id, time, { difficulty });
      } catch (error) {
        // Ten ham soru, aynı kavram veya sûre şablonunu yinelediğinde
        // on bağımsız oynanabilir soru etmeyebilir. UI bunu engellemeli.
        assert.match(String(error), /yeterli bağımsız soru/i);
        continue;
      }
      assert.equal(round.focus, category.id);
      assert.equal(round.difficulty, difficulty);
      assert.equal(round.questionIds.length, 10);
      assert.equal(new Set(round.questionIds).size, 10);
      for (const id of round.questionIds) {
        assert.equal(questionById.get(id)?.categoryId, category.id);
        assert.equal(questionById.get(id)?.difficulty, difficulty);
      }
      const result = complete(round, 7);
      assert.equal(stats(result).score, 700);
      assert.equal(parseData(JSON.stringify({ ...emptyData(), games: [result] })).games.length, 1);
      const tampered = { ...result, questionIds: [...result.questionIds] };
      const foreign = playableQuestions("prototype").find((q) => q.categoryId !== category.id);
      if (foreign) {
        tampered.questionIds[0] = foreign.id;
        assert.throws(() => parseData(JSON.stringify({ ...emptyData(), games: [tampered] })), /Oyun kayıtları doğrulanamadı/);
      }
    }
  }
});


test("v14: 500 sorunun yalnızca zorluk meta verisi düzenlenir; eski v13 korunur", () => {
  assert.equal(bankV14.length, 500);
  assert.equal(bankV13.length, 500);
  assert.equal(new Set(bankV14.map(q => q.id)).size, 500);
  const originals = new Map(bankV13.map(q => [q.id, q]));
  const keys = Object.keys(difficultyCalibrationV14);
  assert.equal(keys.length, 212);
  assert.deepEqual(difficultyCalibrationCountV14, { easy: 84, medium: 38, hard: 90 });
  assert.ok(keys.every(id => originals.has(id)));
  assert.ok(keys.every(id => originals.get(id)!.difficulty !== difficultyCalibrationV14[id]));
  const counts = { easy: 0, medium: 0, hard: 0 };
  for (const q of bankV14) {
    const old = originals.get(q.id)!;
    counts[q.difficulty]++;
    assert.equal(q.difficulty, difficultyCalibrationV14[q.id] ?? old.difficulty);
    assert.equal(q.question, old.question);
    assert.equal(q.correctOptionId, old.correctOptionId);
    assert.deepEqual(q.options, old.options);
    assert.equal(q.explanation, old.explanation);
    assert.deepEqual(q.sources, old.sources);
    assert.equal(q.conceptGroup, old.conceptGroup);
    assert.equal(q.categoryId, old.categoryId);
    if (q.difficulty !== old.difficulty) {
      assert.equal(q.version, old.version + 1);
      assert.equal(old.updatedAt !== q.updatedAt, true);
    }
  }
  assert.equal(Object.values(counts).reduce((a,b) => a+b), 500);
  assert.ok(counts.easy >= 150);
  assert.ok(counts.hard >= 80);
  assert.equal(knownQuestion(13, bankV14[0]!.id), true);
  assert.equal(knownQuestion(14, bankV14[0]!.id), true);
  const fromV13 = bankV13[0]!;
  const originalDisplay = gameQuestion({ bankVersion: 13, optionOrders: { [fromV13.id]: fromV13.options.map(x => x.id) } }, fromV13.id)!;
  assert.equal(originalDisplay.difficulty, fromV13.difficulty);
  const completed = complete(createSession("mixed", undefined, time));
  const restored = parseData(JSON.stringify({ ...emptyData(), games: [completed] }));
  assert.equal(restored.games[0]?.bankVersion, 72);
  // Old records never acquire the new grade. Their bankVersion 13 remains valid.
  assert.ok(bankV13.length === 500 && bankV14.length === 500);
});
