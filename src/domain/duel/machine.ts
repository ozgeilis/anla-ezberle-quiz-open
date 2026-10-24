import {
  createSession,
  answerQuestion,
  expireQuestion,
  advanceQuestion,
  finishSession,
  stats,
  Session,
  GameRecord,
} from "../game/engine";
import { gameQuestion } from "../../content/questions/registry";

export type MatchState =
  | "created"
  | "waiting_for_opponent"
  | "in_progress"
  | "waiting_for_result"
  | "completed"
  | "expired"
  | "cancelled";
export type Role = "a" | "b";
export const demoPlayers = {
  a: { id: "demo-player-a", name: "Demo Oyuncu A" },
  b: { id: "demo-player-b", name: "Demo Oyuncu B" },
} as const;
export type DuelCommand =
  | { type: "invite" | "resolve" | "cancel" | "expire" }
  | { type: "start" | "next" | "finish" | "timeout"; playerId: string }
  | { type: "answer"; playerId: string; option: number };
export type DuelEvent = DuelCommand & { at: number };
export interface DuelDocument {
  version: 1;
  seed: Session;
  questionVersions: Record<string, number>;
  events: DuelEvent[];
}
export interface DemoMatch {
  id: string;
  state: MatchState;
  createdAt: number;
  updatedAt: number;
  expiresAt: number;
  manifest: {
    timingVersion?: 1;
    bankVersion: number;
    questionIds: string[];
    questionVersions: Record<string, number>;
    optionOrders: Record<string, string[]>;
  };
  players: Record<
    Role,
    { id: string; name: string; session?: Session; result?: GameRecord }
  >;
  activeRole?: Role;
  outcome?: {
    winner: Role | "tie";
    a: ReturnType<typeof stats>;
    b: ReturnType<typeof stats>;
  };
}
export const terminal = (state: MatchState) =>
  ["completed", "expired", "cancelled"].includes(state);
const timestamp = (v: unknown): v is number =>
  Number.isSafeInteger(v) && Number(v) > 0;
const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);

function initialMatch(document: DuelDocument): DemoMatch {
  const { seed, questionVersions } = document;
  if (
    !object(seed) ||
    typeof seed.id !== "string" ||
    !/^quiz-[\w-]{5,100}$/.test(seed.id) ||
    !timestamp(seed.startedAt) ||
    seed.mode !== "mixed" ||
    seed.focus !== undefined ||
    seed.dailyKey !== undefined ||
    seed.cursor !== 0 ||
    !Array.isArray(seed.answers) ||
    seed.answers.length !== 0 ||
    !Array.isArray(seed.questionIds) ||
    seed.questionIds.length !== 10 ||
    new Set(seed.questionIds).size !== 10 ||
    !object(seed.optionOrders) ||
    Object.keys(seed.optionOrders).length !== 10 ||
    !object(questionVersions) ||
    Object.keys(questionVersions).length !== 10
  )
    throw new Error("Demo maçın soru manifesti okunamadı.");
  for (const id of seed.questionIds) {
    const order = seed.optionOrders[id];
    if (
      typeof id !== "string" ||
      !Array.isArray(order) ||
      !order.every((o) => typeof o === "string")
    )
      throw new Error("Demo seçenek sırası geçersiz.");
    const q = gameQuestion(seed, id);
    if (!q || q.version !== questionVersions[id])
      throw new Error("Demo soru sürümü desteklenmiyor.");
  }
  // Katılımcılar aynı nesneyi paylaşmaz; manifest ve seçenek dizileri dışarıdan değişmez.
  return {
    id: `demo-${seed.id.slice(5)}`,
    state: "created",
    createdAt: seed.startedAt,
    updatedAt: seed.startedAt,
    expiresAt: seed.startedAt + 24 * 60 * 60 * 1000,
    manifest: {
      ...(seed.timingVersion === 1 ? { timingVersion: 1 as const } : {}),
      bankVersion: seed.bankVersion,
      questionIds: [...seed.questionIds],
      questionVersions: { ...questionVersions },
      optionOrders: Object.fromEntries(
        Object.entries(seed.optionOrders).map(([id, order]) => [
          id,
          [...order],
        ]),
      ),
    },
    players: { a: { ...demoPlayers.a }, b: { ...demoPlayers.b } },
  };
}
export function createDemoDocument(
  now = Date.now(),
  recentIds: readonly string[] = [],
): DuelDocument {
  const seed = createSession("mixed", undefined, now, {
    channel: "prototype",
    timed: true,
    recentIds,
  });
  return {
    version: 1,
    seed,
    questionVersions: Object.fromEntries(
      seed.questionIds.map((id) => [id, gameQuestion(seed, id)!.version]),
    ),
    events: [],
  };
}
export function applyDuelEvent(match: DemoMatch, event: DuelEvent): DemoMatch {
  if (!object(event) || !timestamp(event.at) || event.at < match.updatedAt)
    throw new Error("Demo işlem zamanı geçersiz.");
  if (event.type === "resolve" && match.state === "completed") return match;
  if (
    event.type === "finish" &&
    "playerId" in event &&
    Object.values(match.players).some(
      (p) => p.id === event.playerId && p.result,
    )
  )
    return match;
  if (terminal(match.state)) throw new Error("Kapanmış maç değiştirilemez.");
  if (event.type === "expire") {
    if (event.at < match.expiresAt)
      throw new Error("Maçın süresi henüz dolmadı.");
    return {
      ...match,
      state: "expired",
      activeRole: undefined,
      updatedAt: event.at,
    };
  }
  if (event.at >= match.expiresAt) throw new Error("Demo maçın süresi doldu.");
  const changed = (patch: Partial<DemoMatch>): DemoMatch => ({
    ...match,
    ...patch,
    updatedAt: event.at,
  });
  if (event.type === "cancel")
    return changed({ state: "cancelled", activeRole: undefined });
  if (event.type === "invite") {
    if (match.state !== "created")
      throw new Error("Davet bu durumda oluşturulamaz.");
    return changed({ state: "waiting_for_opponent" });
  }
  if (event.type === "resolve") {
    const { a, b } = match.players;
    if (match.state !== "waiting_for_result" || !a.result || !b.result)
      throw new Error("İki oyuncu da turunu bitirmeli.");
    const left = stats(a.result),
      right = stats(b.result);
    return changed({
      state: "completed",
      outcome: {
        a: left,
        b: right,
        winner:
          left.score === right.score
            ? "tie"
            : left.score > right.score
              ? "a"
              : "b",
      },
    });
  }
  if (!("playerId" in event)) throw new Error("Demo işlem türü geçersiz.");
  const role = (Object.keys(demoPlayers) as Role[]).find(
    (r) => match.players[r].id === event.playerId,
  );
  if (!role) throw new Error("Bu oyuncu demo maça katılamaz.");
  const player = match.players[role];
  const updatePlayer = (
    patch: Partial<typeof player>,
    patchMatch: Partial<DemoMatch> = {},
  ) =>
    changed({
      ...patchMatch,
      players: { ...match.players, [role]: { ...player, ...patch } },
    });
  if (event.type === "start") {
    if (player.session || player.result)
      throw new Error("Aynı oyuncu ikinci kez katılamaz.");
    const allowed =
      role === "a"
        ? match.state === "waiting_for_opponent"
        : match.state === "waiting_for_result" &&
          !!match.players.a.result &&
          !match.players.b.result;
    if (!allowed) throw new Error("Bu oyuncunun turu henüz başlayamaz.");
    const { manifest } = match;
    const session: Session = {
      id: `quiz-${match.id.slice(5)}-${role}`,
      mode: "mixed",
      bankVersion: manifest.bankVersion,
      questionIds: [...manifest.questionIds],
      optionOrders: Object.fromEntries(
        Object.entries(manifest.optionOrders).map(([id, order]) => [
          id,
          [...order],
        ]),
      ),
      ...(manifest.timingVersion === 1
        ? { timingVersion: 1 as const, questionOpenedAt: event.at }
        : {}),
      startedAt: event.at,
      cursor: 0,
      answers: [],
    };
    return updatePlayer(
      { session },
      { state: "in_progress", activeRole: role },
    );
  }
  if (
    match.state !== "in_progress" ||
    match.activeRole !== role ||
    !player.session
  )
    throw new Error("Oyuncunun aktif turu yok.");
  if (event.type === "timeout") {
    const session = expireQuestion(player.session, event.at);
    return session === player.session ? match : updatePlayer({ session });
  }
  if (event.type === "answer") {
    if (!Number.isInteger(event.option) || event.option < 0 || event.option > 3)
      throw new Error("Cevap seçeneği geçersiz.");
    const session = answerQuestion(player.session, event.option, event.at);
    return session === player.session ? match : updatePlayer({ session });
  }
  if (event.type === "next") {
    const session = advanceQuestion(player.session, event.at);
    if (session === player.session)
      throw new Error("Önce soruyu yanıtlamalısın.");
    return updatePlayer({ session });
  }
  if (event.type === "finish")
    return updatePlayer(
      { session: undefined, result: finishSession(player.session) },
      { state: "waiting_for_result", activeRole: undefined },
    );
  throw new Error("Demo işlem türü geçersiz.");
}
export function restoreDemo(document: DuelDocument): DemoMatch {
  if (
    !object(document) ||
    document.version !== 1 ||
    !Array.isArray(document.events) ||
    document.events.length > 80
  )
    throw new Error("Demo kayıt biçimi desteklenmiyor.");
  return document.events.reduce(applyDuelEvent, initialMatch(document));
}
export function appendDuelEvent(
  document: DuelDocument,
  event: DuelEvent,
): DuelDocument {
  const current = restoreDemo(document);
  const next = applyDuelEvent(current, event);
  return next === current
    ? document
    : { ...document, events: [...document.events, event] };
}
export function parseDemo(raw: string | null): DuelDocument | null {
  if (raw === null) return null;
  const document: DuelDocument = JSON.parse(raw);
  restoreDemo(document); // Sonuçlar güvenilmez skor alanlarından değil doğrulanan olaylardan çözülür.
  return document;
}
