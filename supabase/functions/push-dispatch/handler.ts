export interface PushJob {
  id: string;
  token: string;
  kind: string;
  notificationId: string;
  source: "inbox" | "room";
  recipientId: string;
}
export interface ReceiptJob {
  id: string;
  ticket: string;
}
export interface PushWorkerDeps {
  secret: string;
  expoAccessToken: string;
  rpc: (operation: string, body?: object) => Promise<unknown>;
  fetch: typeof fetch;
}
const copy: Record<string, [string, string]> = {
  friend_request: [
    "Yeni arkadaşlık isteğin var!",
    "Gelen isteği incele ve yanıtla.",
  ],
  friend_accepted: [
    "Arkadaşlık isteğin kabul edildi!",
    "Arkadaşınla oyunları keşfet.",
  ],
  challenge_received: [
    "Bir arkadaşın seni yarışmaya davet etti!",
    "Davetin ayrıntılarını gör.",
  ],
  challenge_accepted: [
    "Oyun davetin kabul edildi!",
    "Yarışmanın durumunu gör.",
  ],
  match_completed: [
    "Yarışmanız tamamlandı. Sonucu gör!",
    "Maç sonucunu uygulamada incele.",
  ],
  turn_ready: ["Yarışmada sıra sende!", "Maçının güncel durumunu gör."],
  room_started: [
    "Katıldığın odada oyun başladı!",
    "Odanı aç ve yarışmaya katıl.",
  ],
};
function equal(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
export function pushDispatchHandler(deps: PushWorkerDeps) {
  return async (req: Request): Promise<Response> => {
    const reply = (status: number, v: object) =>
      new Response(JSON.stringify(v), {
        status,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      });
    if (req.method !== "POST")
      return reply(405, { error: "Method not allowed" });
    if (!deps.secret || !deps.expoAccessToken)
      return reply(503, { error: "Push configuration incomplete" });
    if (!equal(req.headers.get("Authorization") ?? "", `Bearer ${deps.secret}`))
      return reply(401, { error: "Unauthorized" });
    let submitted = 0,
      receipts = 0;
    try {
      const jobs = (await deps.rpc("claim")) as PushJob[];
      if (!Array.isArray(jobs) || jobs.length > 30) throw Error();
      const submit = async (job: PushJob) => {
        if ((await deps.rpc("authorize", { id: job.id })) !== true) return;
        const text = copy[job.kind];
        if (!text) {
          await deps.rpc("finish", { id: job.id, error: "MessageTooBig" });
          return;
        }
        try {
          // One attempt per claimed event/device. Ambiguous network outcomes are never
          // re-sent automatically: Expo does not provide an idempotency key API.
          const r = await deps.fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${deps.expoAccessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              to: job.token,
              title: text[0],
              body: text[1],
              sound: "default",
              channelId: "game-updates",
              ttl: 3600,
              data: {
                version: 1,
                source: job.source,
                notificationId: job.notificationId,
                recipientId: job.recipientId,
              },
            }),
            signal: AbortSignal.timeout(10000),
          });
          if (!r.ok) throw Error();
          const { data } = await r.json();
          if (data?.status === "ok" && typeof data.id === "string") {
            await deps.rpc("finish", { id: job.id, ticket: data.id });
            submitted++;
          } else
            await deps.rpc("finish", {
              id: job.id,
              error: data?.details?.error,
            });
        } catch {
          await deps.rpc("finish", { id: job.id, error: "SendOutcomeUnknown" });
        }
      };
      for (let i = 0; i < jobs.length; i += 5)
        await Promise.all(jobs.slice(i, i + 5).map(submit));
      const pending = (await deps.rpc("receipts")) as ReceiptJob[];
      if (!Array.isArray(pending) || pending.length > 100) throw Error();
      if (pending.length) {
        const r = await deps.fetch(
          "https://exp.host/--/api/v2/push/getReceipts",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${deps.expoAccessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ids: pending.map((p) => p.ticket) }),
            signal: AbortSignal.timeout(10000),
          },
        );
        if (!r.ok) throw Error();
        const { data } = await r.json();
        for (const job of pending) {
          const v = data?.[job.ticket];
          await deps.rpc("receipt", {
            id: job.id,
            status: v?.status,
            error: v?.details?.error,
          });
          if (v?.status === "ok") receipts++;
        }
      }
      return reply(200, { submitted, receipts });
    } catch {
      return reply(503, {
        error: "Push worker incomplete; no ambiguous send retry",
        submitted,
        receipts,
      });
    }
  };
}
