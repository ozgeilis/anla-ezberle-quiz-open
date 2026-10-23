import { isGameStage, stageDefinition } from "../domain/game/stages";
import { isAvatarId } from "../domain/profile/avatars";
import {
  belongsToPlayCategory,
  isPlayCategory,
} from "../domain/game/play-categories";
import { categories } from "../content/questions";
import {
  gameQuestion,
  knownQuestion,
  questionCategory,
  SUPPORTED_BANK_VERSIONS,
} from "../content/questions/registry";
import { dateKey, GameRecord } from "../domain/game/engine";
import {
  belongsToLearningTopic,
  isLearningTopic,
  isLearningTopicVersion,
} from "../domain/game/learning";
export const STORAGE_KEY = "@anla-ezberle-quiz/progress/v1";
export interface Profile {
  name: string;
  avatar: number;
  reduceMotion: boolean;
  theme: "system" | "light" | "dark";
}
export interface StoredData {
  showcase?: string[];
  version: 1;
  profile: Profile;
  games: GameRecord[];
}
export const emptyData = (): StoredData => ({
  version: 1,
  profile: { name: "Oyuncu", avatar: 0, reduceMotion: false, theme: "system" },
  games: [],
});
const object = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const timestamp = (v: unknown): v is number =>
  Number.isSafeInteger(v) && Number(v) > 0;
export function validRecord(value: unknown): value is GameRecord {
  if (!object(value)) return false;
  const g = value;
  if (g.replay !== undefined && (g.replay !== true || g.mode === "daily"))
    return false;
  if (g.playCategory === undefined && g.playCategoryVersion !== undefined)
    return false;
  if (
    g.playCategory !== undefined &&
    (!isPlayCategory(g.playCategory) ||
      g.playCategory === "children" ||
      !(
        (g.playCategoryVersion === 1 &&
          (g.bankVersion === 71 || g.bankVersion === 72)) ||
        (g.playCategoryVersion === 2 && g.bankVersion === 72)
      ) ||
      g.mode !== "mixed" ||
      g.learningTopic !== undefined ||
      g.focus !== undefined ||
      (g.difficulty === undefined && g.stage === undefined))
  )
    return false;
  if (g.rewardVersion !== undefined && g.rewardVersion !== 1) return false;
  if (
    typeof g.id !== "string" ||
    !/^quiz-[\w-]{5,100}$/.test(g.id) ||
    !SUPPORTED_BANK_VERSIONS.some((v) => v === g.bankVersion) ||
    !timestamp(g.startedAt) ||
    !timestamp(g.completedAt) ||
    g.completedAt < g.startedAt
  )
    return false;
  if (!["mixed", "daily", "focus"].includes(String(g.mode))) return false;
  if (g.mode === "focus" && !categories.some((c) => c.id === g.focus))
    return false;
  if (g.mode !== "focus" && g.focus !== undefined) return false;
  if (
    g.difficulty !== undefined &&
    (g.mode === "daily" ||
      !(typeof g.bankVersion === "number" && g.bankVersion >= 13) ||
      !["easy", "medium", "hard"].includes(String(g.difficulty)))
  )
    return false;
  if (g.mode === "daily" && g.dailyKey !== dateKey(new Date(g.startedAt)))
    return false;
  if (g.mode !== "daily" && g.dailyKey !== undefined) return false;
  if (g.learningTopic === undefined && g.learningTopicVersion !== undefined)
    return false;
  if (
    g.learningTopic !== undefined &&
    (!isLearningTopic(g.learningTopic) ||
      !isLearningTopicVersion(g.learningTopicVersion) ||
      (g.learningTopicVersion === 2 &&
        g.bankVersion !== 71 &&
        g.bankVersion !== 72) ||
      (g.learningTopicVersion === 3 && g.bankVersion !== 72) ||
      !(typeof g.bankVersion === "number" && g.bankVersion >= 14) ||
      g.mode !== "mixed" ||
      (g.difficulty === undefined && g.stage === undefined))
  )
    return false;
  if (
    !Array.isArray(g.questionIds) ||
    g.questionIds.length !== 10 ||
    new Set(g.questionIds).size !== 10 ||
    !g.questionIds.every(
      (id) =>
        typeof id === "string" && knownQuestion(Number(g.bankVersion), id),
    )
  )
    return false;
  const learningTopic = g.learningTopic;
  if (
    isPlayCategory(g.playCategory) &&
    g.questionIds.some(
      (id) =>
        !belongsToPlayCategory(
          String(id),
          g.playCategory as import("../domain/game/play-categories").PlayCategoryId,
          g.bankVersion === 72 ? 2 : 1,
        ),
    )
  )
    return false;
  if (
    isLearningTopic(learningTopic) &&
    isLearningTopicVersion(g.learningTopicVersion) &&
    g.questionIds.some(
      (id) =>
        !belongsToLearningTopic(
          String(id),
          learningTopic,
          (g.bankVersion === 72 && g.learningTopicVersion === 2
            ? 3
            : g.learningTopicVersion) as 1 | 2 | 3,
        ),
    )
  )
    return false;
  if (
    g.mode === "focus" &&
    g.questionIds.filter(
      (id) => questionCategory(Number(g.bankVersion), id) === g.focus,
    ).length !== (g.difficulty === undefined ? 5 : 10)
  )
    return false;
  if (g.bankVersion === 1 && g.optionOrders !== undefined) return false;
  if (typeof g.bankVersion === "number" && g.bankVersion >= 2) {
    if (!object(g.optionOrders) || Object.keys(g.optionOrders).length !== 10)
      return false;
    for (const id of g.questionIds) {
      const order = g.optionOrders[id];
      if (
        !Array.isArray(order) ||
        !order.every((o) => typeof o === "string") ||
        !gameQuestion(
          { bankVersion: Number(g.bankVersion), optionOrders: { [id]: order } },
          id,
        )
      )
        return false;
    }
  }
  if (
    g.difficulty !== undefined &&
    g.questionIds.some(
      (id) =>
        gameQuestion(
          {
            bankVersion: Number(g.bankVersion),
            optionOrders: g.optionOrders as Record<string, string[]>,
          },
          id,
        )?.difficulty !== g.difficulty,
    )
  )
    return false;
  if (g.stage !== undefined) {
    if (
      !isGameStage(g.stage) ||
      g.mode !== "mixed" ||
      g.difficulty !== undefined ||
      Number(g.bankVersion) < 41
    )
      return false;
    const counts = stageDefinition(g.stage).counts;
    for (const difficulty of ["easy", "medium", "hard"] as const) {
      if (
        g.questionIds.filter(
          (id) =>
            gameQuestion(
              {
                bankVersion: Number(g.bankVersion),
                optionOrders: g.optionOrders as Record<string, string[]>,
              },
              id,
            )?.difficulty === difficulty,
        ).length !== counts[difficulty]
      )
        return false;
    }
  }
  if (!Array.isArray(g.answers) || g.answers.length !== 10) return false;
  let last = g.startedAt;
  for (const [i, a] of g.answers.entries()) {
    if (
      !object(a) ||
      a.questionId !== g.questionIds[i] ||
      !Number.isInteger(a.option) ||
      Number(a.option) < 0 ||
      Number(a.option) > 3 ||
      !timestamp(a.at) ||
      a.at < last ||
      a.at > g.completedAt
    )
      return false;
    last = a.at;
  }
  return last === g.completedAt;
}
export function parseData(raw: string | null): StoredData {
  if (raw === null) return emptyData();
  const data: unknown = JSON.parse(raw);
  if (
    !object(data) ||
    data.version !== 1 ||
    !object(data.profile) ||
    !Array.isArray(data.games)
  )
    throw new Error("Kayıt biçimi desteklenmiyor.");
  if (
    data.showcase !== undefined &&
    (!Array.isArray(data.showcase) ||
      data.showcase.length > 3 ||
      new Set(data.showcase).size !== data.showcase.length ||
      !data.showcase.every(
        (id) => typeof id === "string" && /^[a-z0-9_-]{1,80}$/.test(id),
      ))
  )
    throw new Error("Rozet vitrini okunamadı.");
  const p = data.profile;
  if (
    typeof p.name !== "string" ||
    p.name.trim().length < 1 ||
    p.name.length > 24 ||
    /[\u0000-\u001f]/.test(p.name) ||
    !isAvatarId(p.avatar) ||
    typeof p.reduceMotion !== "boolean" ||
    !["system", "light", "dark"].includes(String(p.theme))
  )
    throw new Error("Profil kaydı okunamadı.");
  if (
    !data.games.every(validRecord) ||
    new Set(data.games.map((g) => g.id)).size !== data.games.length
  )
    throw new Error("Oyun kayıtları doğrulanamadı.");
  const daily = data.games
    .filter((g) => g.mode === "daily")
    .map((g) => g.dailyKey);
  if (new Set(daily).size !== daily.length)
    throw new Error("Günlük yarışma kaydı yinelenmiş.");
  return data as unknown as StoredData;
}
export function appendGame(data: StoredData, game: GameRecord): StoredData {
  if (data.games.some((g) => g.id === game.id)) return data;
  if (!validRecord(game)) throw new Error("Sonuç doğrulanamadı.");
  if (
    game.mode === "daily" &&
    data.games.some((g) => g.dailyKey === game.dailyKey)
  )
    throw new Error("Bugünün yarışması zaten kaydedildi.");
  return { ...data, games: [...data.games, game] };
}
