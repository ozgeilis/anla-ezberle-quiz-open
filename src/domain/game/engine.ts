import { QUESTION_LIMIT_MS } from "./question-clock";
import {
  DifficultyCounts,
  GameStage,
  isGameStage,
  stageDefinition,
} from "./stages";
import { selectionConceptKeys } from "./concepts";
import { unseenQuestionPool } from "./history";
import {
  PLAY_CATEGORY_VERSION,
  type PlayCategoryVersion,
  categoryPool,
  isPlayCategory,
  type PlayCategoryId,
} from "./play-categories";
import {
  BANK_VERSION,
  CategoryId,
  Difficulty,
  playableQuestions,
  Question,
  ContentChannel,
  categories,
} from "../../content/questions";

import { gameQuestion, GameContent } from "../../content/questions/registry";
import type { LearningTopicId } from "../../content/questions/learning-topics-v1";
import {
  isLearningTopic,
  learningTopicPool,
  LEARNING_TOPIC_VERSION,
  type LearningTopicVersion,
} from "./learning";

export type Mode = "mixed" | "focus" | "daily";
export interface Answer {
  questionId: string;
  option: number;
  at: number;
  timedOut?: true;
  openedAt?: number;
}
export interface Session extends GameContent {
  timingVersion?: 1;
  questionOpenedAt?: number;
  playCategory?: PlayCategoryId;
  playCategoryVersion?: PlayCategoryVersion;
  replay?: true;
  rewardVersion?: 1;
  id: string;
  mode: Mode;
  focus?: CategoryId;
  difficulty?: Difficulty;
  stage?: GameStage;
  learningTopic?: LearningTopicId;
  learningTopicVersion?: LearningTopicVersion;
  dailyKey?: string;
  questionIds: string[];
  startedAt: number;
  cursor: number;
  answers: Answer[];
}
export interface GameRecord extends Omit<
  Session,
  "cursor" | "questionOpenedAt"
> {
  completedAt: number;
}
export function shuffle<T>(items: readonly T[], random = Math.random): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}
export function dateKey(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}
function seeded(key: string) {
  let seed = [...key].reduce(
    (n, ch) => (Math.imul(n, 31) + ch.charCodeAt(0)) | 0,
    7,
  );
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) | 0;
    return (seed >>> 0) / 4294967296;
  };
}
export { selectionConceptKeys } from "./concepts";
// Hedefler: karma 3/3/2/2, odak 5 + diğer kategorilerden 2/2/1.
// Önce son turda görülmeyenler, sonra görülenler; eşit öncelikler karıştırılır.
export function selectQuestions(
  pool: readonly Question[],
  mode: Mode,
  focus: CategoryId | undefined,
  recentIds: readonly string[] = [],
  random = Math.random,
): Question[] {
  if (mode === "focus" && !focus)
    throw new Error("Odaklı tur için kategori seçilmelidir.");
  const recent = new Set(recentIds);
  const recentConcepts = new Set(
    pool.filter((q) => recent.has(q.id)).flatMap(selectionConceptKeys),
  );
  const priority = (q: Question) =>
    recent.has(q.id)
      ? 2
      : selectionConceptKeys(q).some((key) => recentConcepts.has(key))
        ? 1
        : 0;
  const categoryOrder = shuffle(
    categories.map((c) => c.id),
    random,
  );
  const targets =
    mode === "focus"
      ? [
          { id: focus!, count: 5 },
          ...categoryOrder
            .filter((id) => id !== focus)
            .map((id, i) => ({ id, count: i < 2 ? 2 : 1 })),
        ]
      : categoryOrder.map((id, i) => ({ id, count: i < 2 ? 3 : 2 }));
  const selected: Question[] = [];
  const usedIds = new Set<string>();
  const groups = new Set<string>();
  for (const { id, count } of targets) {
    const candidates = shuffle(
      pool.filter((q) => q.categoryId === id),
      random,
    ).sort((a, b) => priority(a) - priority(b));
    let picked = 0;
    for (const q of candidates) {
      const keys = selectionConceptKeys(q);
      if (usedIds.has(q.id) || keys.some((key) => groups.has(key))) continue;
      selected.push(q);
      usedIds.add(q.id);
      for (const key of keys) groups.add(key);
      if (++picked === count) break;
    }
    if (picked < count)
      throw new Error(
        `${categories.find((c) => c.id === id)!.title} kategorisinde bu tur için yeterli bağımsız, oynanabilir soru yok. Başka bir kategori deneyebilirsin.`,
      );
  }
  return shuffle(selected, random);
}
// Find pairwise-independent questions without changing the bank, random
// state, session sequence or player history. Greedy alone can wrongly reject a
// valid pool when an early question conflicts with two otherwise valid ones.
export function independentQuestions(
  candidates: readonly Question[],
  quotas?: DifficultyCounts,
  size = 10,
): Question[] | null {
  if (
    !Number.isInteger(size) ||
    size < 1 ||
    size > 15 ||
    (quotas && Object.values(quotas).reduce((a, b) => a + b, 0) !== size)
  )
    return null;
  const entries = candidates.map((question) => ({
    question,
    keys: new Set([`id:${question.id}`, ...selectionConceptKeys(question)]),
  }));
  type Entry = (typeof entries)[number];
  const overlaps = (a: Entry, b: Entry) =>
    [...a.keys].some((key) => b.keys.has(key));
  // Partition remaining candidates into cliques sharing a conflict key.
  // At most one can be chosen per clique; this is a safe upper bound, never
  // a claim that different cliques are necessarily compatible.
  const upperBound = (remaining: readonly Entry[], needed: number) => {
    let rest = [...remaining];
    let groups = 0;
    while (rest.length && groups < needed) {
      const counts = new Map<string, number>();
      for (const entry of rest)
        for (const key of entry.keys)
          counts.set(key, (counts.get(key) ?? 0) + 1);
      let largest = "",
        count = 0;
      for (const [key, size] of counts)
        if (size > count) {
          largest = key;
          count = size;
        }
      rest = rest.filter((entry) => !entry.keys.has(largest));
      groups++;
    }
    return groups;
  };
  const search = (
    remaining: readonly Entry[],
    needed: number,
    counts?: DifficultyCounts,
  ): Entry[] | null => {
    if (!needed) return [];
    if (remaining.length < needed) return null;
    if (
      counts &&
      (["easy", "medium", "hard"] as const).some(
        (d) =>
          upperBound(
            remaining.filter((e) => e.question.difficulty === d),
            counts[d],
          ) < counts[d],
      )
    )
      return null;
    // Preserve preferred/recent ordering in the common case without a search.
    const greedy: Entry[] = [];
    const greedyCounts = { easy: 0, medium: 0, hard: 0 };
    for (const entry of remaining) {
      if (
        counts &&
        greedyCounts[entry.question.difficulty] >=
          counts[entry.question.difficulty]
      )
        continue;
      if (greedy.every((chosen) => !overlaps(chosen, entry))) {
        greedy.push(entry);
        greedyCounts[entry.question.difficulty]++;
      }
      if (greedy.length === needed) return greedy;
    }
    if (upperBound(remaining, needed) < needed) return null;
    for (let i = 0; i <= remaining.length - needed; i++) {
      const first = remaining[i]!;
      if (counts && !counts[first.question.difficulty]) continue;
      const tail = remaining
        .slice(i + 1)
        .filter((entry) => !overlaps(first, entry));
      const nextCounts = counts
        ? {
            ...counts,
            [first.question.difficulty]: counts[first.question.difficulty] - 1,
          }
        : undefined;
      const found = search(tail, needed - 1, nextCounts);
      if (found) return [first, ...found];
    }
    return null;
  };
  return search(entries, size, quotas)?.map((entry) => entry.question) ?? null;
}

function difficultyPool(
  pool: readonly Question[],
  difficulty: Difficulty,
  category?: CategoryId,
) {
  return pool.filter(
    (q) =>
      q.difficulty === difficulty && (!category || q.categoryId === category),
  );
}

// The preparation screen and the real selector use this same exact constraint
// solver. Feasibility does not consume RNG or create/modify a session.
export function assessDifficultyRound(
  pool: readonly Question[],
  difficulty: Difficulty,
  category?: CategoryId,
) {
  const eligible = difficultyPool(pool, difficulty, category);
  return {
    eligibleCount: eligible.length,
    canStart: independentQuestions(eligible) !== null,
  };
}

// Difficulty rounds use all four subject areas, without demanding a rigid
// 3/3/2/2 split that might exclude a sparse difficulty/category pairing.
export function selectDifficultyQuestions(
  pool: readonly Question[],
  difficulty: Difficulty,
  recentIds: readonly string[] = [],
  random = Math.random,
  category?: CategoryId,
): Question[] {
  const recent = new Set(recentIds);
  const eligible = difficultyPool(pool, difficulty, category);
  const recentConcepts = new Set(
    eligible.filter((q) => recent.has(q.id)).flatMap(selectionConceptKeys),
  );
  const candidates = shuffle(eligible, random).sort((a, b) => {
    const priority = (q: Question) =>
      recent.has(q.id)
        ? 2
        : selectionConceptKeys(q).some((key) => recentConcepts.has(key))
          ? 1
          : 0;
    return priority(a) - priority(b);
  });
  const selected = independentQuestions(candidates);
  if (!selected)
    throw new Error(
      category
        ? "Bu kategori ve zorluk seviyesinde yeterli bağımsız soru yok."
        : "Bu zorluk seviyesinde yeterli bağımsız soru yok.",
    );
  return shuffle(selected, random);
}

export function assessStageRound(pool: readonly Question[], stage: GameStage) {
  const counts = stageDefinition(stage).counts;
  const eligible = pool.filter((q) => counts[q.difficulty] > 0);
  return {
    eligibleCount: eligible.length,
    canStart: independentQuestions(eligible, counts) !== null,
  };
}
export function selectStageQuestions(
  pool: readonly Question[],
  stage: GameStage,
  recentIds: readonly string[] = [],
  random = Math.random,
) {
  const counts = stageDefinition(stage).counts;
  const recent = new Set(recentIds);
  const recentConcepts = new Set(
    pool.filter((q) => recent.has(q.id)).flatMap(selectionConceptKeys),
  );
  const priority = (q: Question) =>
    recent.has(q.id)
      ? 2
      : selectionConceptKeys(q).some((k) => recentConcepts.has(k))
        ? 1
        : 0;
  const candidates = shuffle(
    pool.filter((q) => counts[q.difficulty] > 0),
    random,
  ).sort((a, b) => priority(a) - priority(b));
  const selected = independentQuestions(candidates, counts);
  if (!selected)
    throw new Error(
      "Bu aşama için hedef dağılımda 10 bağımsız soru yok. Başka konu veya aşama seç.",
    );
  return shuffle(selected, random);
}

let sequence = 0;
export function assessFreshRound(
  pool: readonly Question[],
  options: { difficulty?: Difficulty; stage?: GameStage },
  history: readonly GameRecord[] = [],
) {
  const assess = (p: readonly Question[]) =>
    options.stage
      ? assessStageRound(p, options.stage)
      : options.difficulty
        ? assessDifficultyRound(p, options.difficulty)
        : {
            eligibleCount: p.length,
            canStart: independentQuestions(p) !== null,
          };
  const full = assess(pool),
    fresh = assess(unseenQuestionPool(pool, history));
  return {
    eligibleCount: full.eligibleCount,
    freshCount: fresh.eligibleCount,
    canStart: fresh.canStart,
    exhausted: full.canStart && !fresh.canStart,
    canReplay: full.canStart && !fresh.canStart,
  };
}
export class NewQuestionsExhaustedError extends Error {
  constructor() {
    super(
      "Bu kategorideki yeni soruları tamamladın. Kalan yeni sorular bu seçimde 10 bağımsız soruluk tur oluşturmuyor. İstersen başka bir seçim yap veya yeniden oynamayı seç.",
    );
  }
}
export function createSession(
  mode: Mode = "mixed",
  focus?: CategoryId,
  now = Date.now(),
  options: {
    timed?: boolean;
    channel?: ContentChannel;
    recentIds?: readonly string[];
    random?: () => number;
    difficulty?: Difficulty;
    stage?: GameStage;
    learningTopic?: LearningTopicId;
    playCategory?: PlayCategoryId;
    history?: readonly GameRecord[];
    allowReplay?: boolean;
  } = {},
): Session {
  if (
    options.stage !== undefined &&
    (!isGameStage(options.stage) ||
      mode !== "mixed" ||
      focus !== undefined ||
      options.difficulty !== undefined)
  )
    throw new Error(
      "Oyun aşaması yalnız karma veya öğrenme turunda, ayrı zorluk filtresi olmadan seçilebilir.",
    );
  const key = mode === "daily" ? dateKey(new Date(now)) : undefined;
  const random = key
    ? seeded(`${key}:bank-${BANK_VERSION}`)
    : (options.random ?? Math.random);
  if (options.difficulty && mode === "daily")
    throw new Error("Günün yarışmasında zorluk filtresi kullanılamaz.");
  if (options.difficulty && mode === "focus" && !focus)
    throw new Error("Odaklı tur için kategori seçilmelidir.");
  if (
    options.learningTopic !== undefined &&
    (!isLearningTopic(options.learningTopic) ||
      mode !== "mixed" ||
      focus !== undefined ||
      (!options.difficulty && !options.stage))
  )
    throw new Error(
      "Öğrenme turu için geçerli bir konu ve zorluk seçilmelidir.",
    );
  if (
    options.playCategory !== undefined &&
    (!isPlayCategory(options.playCategory) ||
      options.playCategory === "children" ||
      options.learningTopic !== undefined ||
      mode !== "mixed" ||
      focus !== undefined ||
      (!options.difficulty && !options.stage))
  )
    throw new Error(
      options.playCategory === "children"
        ? "Çocuklar İçin hazırlanıyor: kaynak ve yaş uygunluğu incelemesi tamamlanmadı."
        : "Yarışma için tek bir geçerli kategori ve zorluk seç.",
    );
  const available = playableQuestions(options.channel);
  const subjectQuestions = options.playCategory
    ? categoryPool(available, options.playCategory)
    : options.learningTopic
      ? learningTopicPool(available, options.learningTopic)
      : available;
  const status =
    !key && options.history?.length
      ? assessFreshRound(subjectQuestions, options, options.history)
      : { exhausted: false };
  if (!key && status.exhausted && !options.allowReplay)
    throw new NewQuestionsExhaustedError();
  const replay = !key && status.exhausted && options.allowReplay === true;
  const allQuestions =
    key || replay
      ? subjectQuestions
      : unseenQuestionPool(subjectQuestions, options.history ?? []);
  // Preserve the fixed daily selection and legacy focus quotas. Mixed rounds
  // may use any ten fresh independent facts when old broad quotas are exhausted.
  const mixedSelection = () => {
    try {
      return selectQuestions(
        allQuestions,
        mode,
        focus,
        key ? [] : options.recentIds,
        random,
      );
    } catch (error) {
      if (mode !== "mixed" || !options.history?.length) throw error;
      const fresh = independentQuestions(shuffle(allQuestions, random));
      if (!fresh) throw error;
      return fresh;
    }
  };
  const pool = options.stage
    ? selectStageQuestions(
        allQuestions,
        options.stage,
        options.recentIds,
        random,
      )
    : options.difficulty
      ? selectDifficultyQuestions(
          allQuestions,
          options.difficulty,
          options.recentIds,
          random,
          mode === "focus" ? focus : undefined,
        )
      : mixedSelection();
  return {
    ...(options.playCategory
      ? {
          playCategory: options.playCategory,
          playCategoryVersion: PLAY_CATEGORY_VERSION,
        }
      : {}),
    ...(replay ? { replay: true as const } : {}),
    ...(options.timed
      ? { timingVersion: 1 as const, questionOpenedAt: now }
      : {}),
    rewardVersion: 1,
    id: `quiz-${now}-${++sequence}-${Math.random().toString(36).slice(2, 10)}`,
    mode,
    ...(mode === "focus" ? { focus } : {}),
    ...(options.difficulty ? { difficulty: options.difficulty } : {}),
    ...(options.stage ? { stage: options.stage } : {}),
    ...(options.learningTopic
      ? {
          learningTopic: options.learningTopic,
          learningTopicVersion: LEARNING_TOPIC_VERSION,
        }
      : {}),
    ...(key ? { dailyKey: key } : {}),
    bankVersion: BANK_VERSION,
    optionOrders: Object.fromEntries(
      pool.map((q) => [
        q.id,
        shuffle(
          q.options.map((o) => o.id),
          random,
        ),
      ]),
    ),
    questionIds: pool.map((q) => q.id),
    startedAt: now,
    cursor: 0,
    answers: [],
  };
}
export function answerQuestion(
  session: Session,
  option: number,
  now = Date.now(),
): Session {
  const id = session.questionIds[session.cursor];
  if (
    session.timingVersion === 1 &&
    (session.questionOpenedAt === undefined || now < session.questionOpenedAt)
  )
    return session;
  if (
    session.timingVersion === 1 &&
    now >= (session.questionOpenedAt ?? Infinity) + QUESTION_LIMIT_MS
  )
    return expireQuestion(session, now);
  if (
    !id ||
    !Number.isInteger(option) ||
    option < 0 ||
    option > 3 ||
    session.answers.some((a) => a.questionId === id)
  )
    return session;
  return {
    ...session,
    answers: [
      ...session.answers,
      {
        questionId: id,
        option,
        ...(session.timingVersion === 1
          ? { openedAt: session.questionOpenedAt }
          : {}),
        at: Math.max(now, session.startedAt, session.answers.at(-1)?.at ?? 0),
      },
    ],
  };
}
export function expireQuestion(session: Session, now = Date.now()): Session {
  const id = session.questionIds[session.cursor];
  const openedAt = session.questionOpenedAt;
  if (
    session.timingVersion !== 1 ||
    !id ||
    openedAt === undefined ||
    now < openedAt + QUESTION_LIMIT_MS ||
    session.answers.some((a) => a.questionId === id)
  )
    return session;
  return {
    ...session,
    answers: [
      ...session.answers,
      {
        questionId: id,
        option: -1,
        timedOut: true,
        openedAt,
        at: Math.max(
          openedAt + QUESTION_LIMIT_MS,
          session.answers.at(-1)?.at ?? 0,
        ),
      },
    ],
  };
}
export function advanceQuestion(session: Session, now = Date.now()): Session {
  if (
    session.cursor >= 9 ||
    !session.answers.some(
      (a) => a.questionId === session.questionIds[session.cursor],
    )
  )
    return session;
  return {
    ...session,
    cursor: session.cursor + 1,
    ...(session.timingVersion === 1
      ? { questionOpenedAt: Math.max(now, session.answers.at(-1)!.at) }
      : {}),
  };
}
export function finishSession(session: Session): GameRecord {
  if (session.answers.length !== 10 || new Set(session.questionIds).size !== 10)
    throw new Error("Yarışma henüz tamamlanmadı.");
  const { cursor: _cursor, questionOpenedAt: _openedAt, ...record } = session;
  return { ...record, completedAt: session.answers[9]!.at };
}
export function stats(
  game: GameContent & Pick<GameRecord, "answers" | "startedAt" | "completedAt">,
) {
  const correct = game.answers.filter(
    (a) => gameQuestion(game, a.questionId)?.correct === a.option,
  ).length;
  const unanswered = game.answers.filter((a) => a.timedOut === true).length;
  return {
    correct,
    wrong: game.answers.length - correct - unanswered,
    ...(unanswered ? { unanswered } : {}),
    score: correct * 100,
    seconds: Math.max(
      0,
      Math.floor((game.completedAt - game.startedAt) / 1000),
    ),
  };
}
export function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
}
