import assert from "node:assert/strict";
import test from "node:test";
import {
  questions,
  questionById,
  playableQuestions,
} from "../src/content/questions";
import { learningTopicsV1 } from "../src/content/questions/learning-topics-v1";
import {
  categoryPool,
  playCategories,
  categoryForTopic,
  childrenCategory,
  visitedSubjectCount,
} from "../src/domain/game/play-categories";
import {
  createSession,
  answerQuestion,
  advanceQuestion,
  finishSession,
  selectionConceptKeys,
  assessFreshRound,
  NewQuestionsExhaustedError,
  type Session,
  type GameRecord,
} from "../src/domain/game/engine";
import { unseenQuestionPool } from "../src/domain/game/history";
import { gameQuestion } from "../src/content/questions/registry";
import {
  categoryOptions,
  upcomingCollections,
} from "../src/features/categories/learning-options";
import {
  broadPreparationFromParams,
  preparationStatus,
} from "../src/features/categories/preparation";
import { specialTimes } from "../src/features/categories/category-visuals";
import {
  emptyData,
  appendGame,
  parseData,
  validRecord,
} from "../src/storage/schema";
import { progress } from "../src/domain/scoring/progress";
import oldFixture from "./fixtures/content/topic-v1-pre-review.json";
import { questionById as bankV1 } from "../src/content/questions/archive/bank-v1";
const bank = playableQuestions("production"),
  time = 1800000000000;
function complete(s: Session) {
  for (let i = 0; i < 10; i++) {
    const q = gameQuestion(s, s.questionIds[i]!)!;
    s = answerQuestion(s, q.correct, s.startedAt + (i + 1) * 1000);
    if (i < 9) s = advanceQuestion(s);
  }
  return finishSession(s);
}
test("six broad categories partition all 1500; difficulty cards use exact counts and never include the child overlap", () => {
  const cards = categoryOptions(bank);
  assert.deepEqual(
    cards.map((c) => c.count),
    [213, 313, 271, 161, 260, 282],
  );
  assert.equal(
    cards.reduce((s, c) => s + c.count, 0),
    1500,
  );
  const all = playCategories.flatMap((c) =>
    categoryPool(bank, c.id).map((q) => q.id),
  );
  assert.equal(all.length, 1500);
  assert.equal(new Set(all).size, 1500);
  for (const d of ["easy", "medium", "hard"] as const) {
    const options = categoryOptions(bank, d);
    assert.equal(
      options.reduce((n, c) => n + c.count, 0),
      bank.filter((q) => q.difficulty === d).length,
    );
    for (const card of options)
      assert.equal(
        card.count,
        categoryPool(bank, card.id).filter((q) => q.difficulty === d).length,
      );
  }
});
test("legacy topic links resolve to one visible parent; either entry order works, with no hidden subtopic", () => {
  for (const topic of learningTopicsV1) {
    const a = broadPreparationFromParams({
      topic: topic.id,
      difficulty: "medium",
    });
    assert.equal(a.playCategory, categoryForTopic(topic.id));
    assert.equal(a.topic, undefined);
    const b = {
      ...broadPreparationFromParams({ difficulty: "medium" }),
      playCategory: categoryForTopic(topic.id),
      category: undefined,
    };
    assert.deepEqual(preparationStatus(bank, a), preparationStatus(bank, b));
  }
  assert.equal(
    preparationStatus(
      bank,
      broadPreparationFromParams({ playCategory: "quran_dualar" }),
    ).canStart,
    false,
  );
  assert.equal(
    preparationStatus(bank, { playCategory: "children", difficulty: "easy" })
      .canStart,
    false,
  );
  assert.equal(
    preparationStatus(bank, {
      playCategory: "fikih",
      category: "mixed",
      difficulty: "easy",
    }).canStart,
    false,
  );
});
test("each broad category completes a scoped round and validates a new versioned record", () => {
  for (const c of playCategories) {
    const s = createSession("mixed", undefined, time, {
      playCategory: c.id,
      difficulty: "medium",
    });
    assert(
      s.questionIds.every((id) =>
        categoryPool(bank, c.id).some((q) => q.id === id),
      ),
    );
    assert(
      s.questionIds.every(
        (id) => questionById.get(id)!.difficulty === "medium",
      ),
    );
    const keys = s.questionIds.flatMap((id) =>
      selectionConceptKeys(questionById.get(id)!),
    );
    assert.equal(new Set(keys).size, keys.length);
    const g = complete(s);
    assert(validRecord(g));
    assert.deepEqual(
      parseData(JSON.stringify(appendGame(emptyData(), g))).games,
      [g],
    );
    assert.equal(progress([g]).xp, 100);
  }
});
test("six consecutive same-category rounds, restart, category and difficulty changes retain global unseen facts", () => {
  let data = emptyData();
  const seen = new Set<string>();
  for (let i = 0; i < 6; i++) {
    const s = createSession("mixed", undefined, time + i * 20000, {
      playCategory: "peygamberler",
      difficulty: "medium",
      history: data.games,
    });
    for (const id of s.questionIds) {
      assert(!seen.has(id), id);
      seen.add(id);
    }
    data = parseData(JSON.stringify(appendGame(data, complete(s)))); // fresh object simulates restart
  }
  assert.equal(seen.size, 60);
  for (const selection of [
    { playCategory: "quran_dualar" as const, difficulty: "medium" as const },
    { playCategory: "peygamberler" as const, difficulty: "easy" as const },
  ]) {
    const fresh = unseenQuestionPool(bank, data.games);
    const s = createSession("mixed", undefined, time + 200000, {
      ...selection,
      history: data.games,
    });
    assert(s.questionIds.every((id) => fresh.some((q) => q.id === id)));
  }
});
test("history blocks aliases and historical wording globally; template style alone cannot consume a different fact", () => {
  const history = oldFixture.stored.games as GameRecord[];
  const old = questionById.get(history[0]!.questionIds[0]!)!;
  const alias = { ...old, id: "new-alias" };
  const other = {
    ...old,
    id: "new-fact",
    conceptGroup: "new-unique-fact",
    question: "Tamamen farklı bir bilgi sorusu?",
  };
  assert.deepEqual(
    unseenQuestionPool([old, alias, other], history).map((q) => q.id),
    ["new-fact"],
  );
  const unrelated = {
    ...other,
    id: "template-1",
    categoryId: "quran" as const,
    question: "Mushaf sıralamasında 113. sûre hangisidir?",
  };
  // Different facts may share a style across rounds, but not within a round.
  const actual = bank.find((q) =>
    selectionConceptKeys(q).includes("template:surah-mushaf-order"),
  )!;
  assert(actual);
  assert(
    selectionConceptKeys(unrelated).includes("template:surah-mushaf-order"),
  );
  const synthetic = [{ ...history[0]!, questionIds: [actual.id] }];
  assert.equal(unseenQuestionPool([unrelated], synthetic).length, 1);
});
test("exhaustion never silently mixes old facts; replay needs a fresh explicit opt-in and keeps rewards unchanged", () => {
  let data = emptyData(),
    turns = 0;
  const options = {
    playCategory: "quran_dualar" as const,
    difficulty: "easy" as const,
  };
  while (
    assessFreshRound(
      categoryPool(bank, options.playCategory),
      options,
      data.games,
    ).canStart
  ) {
    data = appendGame(
      data,
      complete(
        createSession("mixed", undefined, time + turns * 20000, {
          ...options,
          history: data.games,
        }),
      ),
    );
    assert(++turns < 20);
  }
  assert(turns > 0);
  const status = preparationStatus(bank, options, data.games);
  assert.equal(status.canStart, false);
  assert("canReplay" in status && status.canReplay);
  assert.match(status.message, /yeni soruları tamamladın/);
  assert.throws(
    () =>
      createSession("mixed", undefined, time, {
        ...options,
        history: data.games,
      }),
    NewQuestionsExhaustedError,
  );
  const replay = createSession("mixed", undefined, time, {
    ...options,
    history: data.games,
    allowReplay: true,
  });
  assert.equal(replay.replay, true);
  assert(validRecord(complete(replay)));
  assert.throws(
    () =>
      createSession("mixed", undefined, time, {
        ...options,
        history: data.games,
      }),
    NewQuestionsExhaustedError,
  );
  const before = JSON.stringify(data);
  parseData(before);
  assert.equal(JSON.stringify(data), before);
});
test("daily seed and old v1/v2 saves, scores, XP and mastery survive without migration", () => {
  const old = JSON.stringify(oldFixture.stored);
  const data = parseData(old);
  assert.deepEqual(data, oldFixture.stored);
  assert.deepEqual(progress(data.games), oldFixture.progress);
  const a = createSession("daily", undefined, time),
    b = createSession("daily", undefined, time, {
      history: data.games,
      allowReplay: true,
    });
  assert.deepEqual(a.questionIds, b.questionIds);
  assert.deepEqual(a.optionOrders, b.optionOrders);
  assert.equal(b.replay, undefined);
  const current = complete(
    createSession("mixed", undefined, time, {
      learningTopic: "fikih",
      difficulty: "medium",
    }),
  );
  assert.equal(current.learningTopicVersion, 3);
  assert(validRecord(current));
  const mixed = [
    ...data.games,
    ...playCategories.slice(0, 4).map((c, i) =>
      complete(
        createSession("mixed", undefined, time + i * 20000, {
          playCategory: c.id,
          difficulty: "medium",
        }),
      ),
    ),
  ];
  assert(progress(mixed).badges.find((b) => b.id === "explorer")!.earned);
  assert.equal(
    visitedSubjectCount([
      { ...current, learningTopic: "quran" },
      { ...current, learningTopic: undefined, playCategory: "quran_dualar" },
    ]),
    1,
  );
});
test("forged scopes/versions and premature child play are rejected; six special-time previews stay locked", () => {
  const g = complete(
    createSession("mixed", undefined, time, {
      playCategory: "peygamberler",
      difficulty: "medium",
    }),
  );
  for (const patch of [
    { playCategory: "fikih" },
    { playCategoryVersion: 3 },
    { playCategory: "children" },
    { learningTopic: "peygamberler" },
    { replay: false },
  ])
    assert(!validRecord({ ...g, ...patch }));
  assert.throws(
    () =>
      createSession("mixed", undefined, time, {
        playCategory: "children",
        difficulty: "easy",
      }),
    /yaş uygunluğu/,
  );
  assert.equal(childrenCategory.available, false);
  assert.equal(categoryPool(questions, "children").length, 0);
  assert(!upcomingCollections.some((c) => String(c.id) === "children"));
  assert.deepEqual(
    specialTimes.map((s) => s.id),
    [
      "ramazan",
      "kadir_gecesi",
      "ramazan_bayrami",
      "kurban_bayrami",
      "hac_mevsimi",
      "muharrem_asura",
    ],
  );
  assert(upcomingCollections.every((c) => c.status === "Hazırlanıyor"));
});

test("Karma never revives an exhausted old broad quota; bank-v1 wording remains seen after revisions", () => {
  const quran = bank.filter((q) => q.categoryId === "quran");
  const base = createSession("mixed", undefined, time);
  const history: GameRecord[] = [];
  for (let i = 0; i < quran.length; i += 10) {
    const subset = quran.slice(i, i + 10);
    for (const q of bank)
      if (subset.length < 10 && !subset.some((p) => p.id === q.id))
        subset.push(q);
    const g = complete({
      ...base,
      id: `quiz-history-${i}`,
      questionIds: subset.map((q) => q.id),
      optionOrders: Object.fromEntries(
        subset.map((q) => [q.id, q.options.map((o) => o.id)]),
      ),
    });
    assert(validRecord(g));
    history.push(g);
  }
  const fresh = unseenQuestionPool(bank, history);
  assert(!fresh.some((q) => q.categoryId === "quran"));
  assert(assessFreshRound(bank, {}, history).canStart);
  const s = createSession("mixed", undefined, time, { history });
  assert.equal(s.questionIds.length, 10);
  assert(s.questionIds.every((id) => fresh.some((q) => q.id === id)));
  const changed = [...bankV1.values()].find(
    (q) => q.text !== questionById.get(q.id)?.question,
  )!;
  assert(changed);
  const alias = {
    ...bank[0]!,
    id: "historical-wording-alias",
    conceptGroup: "separate-alias",
    categoryId: changed.category,
    question: changed.text,
  };
  assert.equal(
    unseenQuestionPool(
      [alias],
      [{ ...history[0]!, bankVersion: 1, questionIds: [changed.id] }],
    ).length,
    0,
  );
});
