import type { DirectChallenge, PlayerNotification } from "./types";
export const notificationCopy: Record<
  PlayerNotification["kind"],
  {
    title: string;
    summary: string;
    icon:
      | "user-plus"
      | "user-check"
      | "zap"
      | "check-circle"
      | "x-circle"
      | "clock"
      | "award";
    tone: "mint" | "gold" | "rose";
  }
> = {
  friend_request: {
    title: "Yeni arkadaşlık isteği",
    summary: "Gelen isteği incele ve yanıtla.",
    icon: "user-plus",
    tone: "mint",
  },
  friend_accepted: {
    title: "Arkadaşlık isteğin kabul edildi",
    summary: "Arkadaşının izin verilen profilini görüntüle.",
    icon: "user-check",
    tone: "mint",
  },
  challenge_received: {
    title: "Yeni düello daveti",
    summary: "Meydan okumayı incele ve yanıtla.",
    icon: "zap",
    tone: "gold",
  },
  challenge_accepted: {
    title: "Düello daveti kabul edildi",
    summary: "Davetin durumunu ve maçını görüntüle.",
    icon: "check-circle",
    tone: "mint",
  },
  challenge_declined: {
    title: "Düello daveti reddedildi",
    summary: "Davetin ayrıntılarını görüntüle.",
    icon: "x-circle",
    tone: "rose",
  },
  challenge_cancelled: {
    title: "Düello daveti iptal edildi",
    summary: "Bu davet için artık yanıt verilemez.",
    icon: "x-circle",
    tone: "rose",
  },
  turn_ready: {
    title: "Rakibin turunu tamamladı",
    summary: "Maçının güncel durumunu görüntüle.",
    icon: "clock",
    tone: "gold",
  },
  match_completed: {
    title: "Düellonun sonucu hazır",
    summary: "Tamamlanan maçın sonuçlarını incele.",
    icon: "award",
    tone: "gold",
  },
};
export function notificationTime(value: string, now = Date.now()) {
  const time = Date.parse(value);
  if (!Number.isFinite(time)) return "Tarih yok";
  const minutes = Math.floor(Math.max(0, now - time) / 60000);
  if (minutes < 1) return "Az önce";
  if (minutes < 60) return `${minutes} dk`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)} sa`;
  if (minutes < 10080) return `${Math.floor(minutes / 1440)} gün`;
  return new Date(time).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    timeZone: "Europe/Istanbul",
  });
}
export function newestFirst<T extends { id: string; createdAt: string }>(
  items: readonly T[],
) {
  return [...items].sort(
    (a, b) =>
      (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0) ||
      a.id.localeCompare(b.id),
  );
}
export function challengeStatus(c: DirectChallenge, now = Date.now()) {
  const active =
    c.state === "pending" &&
    Number.isFinite(Date.parse(c.expiresAt)) &&
    Date.parse(c.expiresAt) > now;
  const title =
    c.state === "pending"
      ? active
        ? c.incoming
          ? "Sana meydan okuyor"
          : "Yanıt bekleniyor"
        : "Davetin süresi doldu"
      : {
          accepted: "Davet kabul edildi",
          declined: "Davet reddedildi",
          cancelled: "Davet iptal edildi",
          expired: "Davetin süresi doldu",
        }[c.state];
  return {
    title,
    canReply: active && c.incoming,
    canCancel: active && !c.incoming,
  };
}
export type InboxSelection =
  | { kind: "notification"; notification: PlayerNotification }
  | { kind: "challenge"; challengeId: string };
