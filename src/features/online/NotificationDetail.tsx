import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { Avatar } from "../../components/game/Artwork";
import { Button, Dialog, TextAction, Txt } from "../../components/ui";
import { useTheme } from "../../theme/tokens";
import { PublicAchievements } from "../achievements/PublicAchievements";
import { useOnlineAuth } from "./OnlineProvider";
import { useInbox } from "./InboxProvider";
import { onlineMessage, onlineRequest } from "./client";
import {
  challengeStatus,
  notificationCopy,
  InboxSelection,
} from "./notifications";
import type { Friendship, OnlineMatch } from "./types";
export function NotificationDetail({
  selection,
  onClose,
}: {
  selection: InboxSelection;
  onClose: () => void;
}) {
  const { fontScale } = useWindowDimensions();
  const { session } = useOnlineAuth(),
    inbox = useInbox(),
    theme = useTheme();
  const actor = session?.user.id;
  const read = inbox.read;
  const n = selection.kind === "notification" ? selection.notification : null;
  const friendKind =
    n?.kind === "friend_request" || n?.kind === "friend_accepted";
  const matchKind = n?.kind === "match_completed" || n?.kind === "turn_ready";
  const challengeId =
    selection.kind === "challenge"
      ? selection.challengeId
      : !friendKind && !matchKind
        ? n?.referenceId
        : undefined;
  const challenge = inbox.challenges.find((c) => c.id === challengeId);
  const [friend, setFriend] = useState<Friendship | null>(null),
    [match, setMatch] = useState<OnlineMatch | null>(null),
    [loading, setLoading] = useState(!!(friendKind || matchKind)),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false),
    [showProfile, setShowProfile] = useState(false),
    [readState, setRead] = useState(n && !n.read ? "pending" : "done"),
    [now, setNow] = useState(() => Date.now());
  const lock = useRef(false),
    alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      alive.current = false;
      clearInterval(timer);
    };
  }, []);
  const load = useCallback(async () => {
    if (!actor || !n || (!friendKind && !matchKind)) return;
    await Promise.resolve();
    if (!alive.current) return;
    setLoading(true);
    setError("");
    try {
      if (friendKind) {
        const value = await onlineRequest<{ friendships: Friendship[] }>(
          "friends",
          {},
          actor,
        );
        if (alive.current)
          setFriend(
            value.friendships.find((f) => f.id === n.referenceId) ?? null,
          );
      } else {
        const value = await onlineRequest<OnlineMatch>(
          "get",
          { matchId: n.referenceId },
          actor,
        );
        if (alive.current) setMatch(value);
      }
    } catch (e) {
      if (alive.current) setError(onlineMessage(e));
    } finally {
      if (alive.current) setLoading(false);
    }
  }, [
    actor,
    n,
    friendKind,
    matchKind,
    setError,
    setFriend,
    setLoading,
    setMatch,
  ]);
  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);
  useEffect(() => {
    if (!n || n.read) return;
    let active = true;
    void read(n.id).then((ok) => {
      if (active) setRead(ok ? "done" : "failed");
    });
    return () => {
      active = false;
    };
  }, [n, read]);
  const status = challenge ? challengeStatus(challenge, now) : null;
  const player = friendKind ? friend?.player : challenge?.player;
  const title = n ? notificationCopy[n.kind].title : "Düello daveti";
  const action = async (fn: () => Promise<void>) => {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await fn();
    } catch (e) {
      if (alive.current) setError(onlineMessage(e));
    } finally {
      lock.current = false;
      if (alive.current) setBusy(false);
    }
  };
  const friendReply = (accept: boolean) =>
    action(async () => {
      if (!actor || !friend || friend.state !== "pending" || !friend.incoming)
        return;
      const saved = await onlineRequest<{ saved: boolean }>(
        accept ? "friend_accept" : "friend_remove",
        { friendshipId: friend.id },
        actor,
      );
      if (saved.saved !== true) throw new Error("Unacknowledged action");
      if (!alive.current) return;
      setFriend(accept ? { ...friend, state: "accepted" } : null);
      setNotice(
        accept
          ? "Arkadaşlık isteği kabul edildi."
          : "Arkadaşlık isteği reddedildi.",
      );
      await inbox.refresh();
    });
  const challengeReply = (reply: "accept" | "decline" | "cancel") =>
    action(async () => {
      if (!challenge) return;
      const state = challengeStatus(challenge, Date.now());
      if (reply === "cancel" ? !state.canCancel : !state.canReply) return;
      const next = await inbox.replyChallenge(challenge.id, reply);
      if (!next) {
        if (alive.current)
          setError(
            "Davet güncellenemedi. Güncel durumu yenileyip yeniden dene.",
          );
        return;
      }
      if (alive.current)
        setNotice(
          reply === "accept"
            ? "Davet kabul edildi. Maçını aşağıdan açabilirsin."
            : reply === "decline"
              ? "Davet reddedildi."
              : "Davet iptal edildi.",
        );
      await inbox.refresh();
    });
  const actionRow = {
    flexDirection: fontScale > 1.5 ? ("column" as const) : ("row" as const),
    gap: 8,
  };
  return (
    <Dialog
      visible
      title={showProfile ? "Oyuncu Profili" : title}
      onClose={onClose}
      scrollable
    >
      {showProfile && player ? (
        <View style={{ gap: 12, alignItems: "center" }}>
          <Avatar variant={player.avatar} size={64} />
          <Txt size={18} weight="bold" style={{ textAlign: "center" }}>
            {player.name}
          </Txt>
          <Txt size={12} color={theme.muted}>
            @{player.username}
          </Txt>
          <Txt size={14}>
            Seviye {player.level} · {player.xp} çevrimiçi XP
          </Txt>
          <PublicAchievements player={player} />
          <TextAction
            title="Bildirime Dön"
            onPress={() => setShowProfile(false)}
          />
        </View>
      ) : (
        <View style={{ gap: 12 }}>
          {loading && (
            <Txt size={14} color={theme.muted}>
              Ayrıntılar yükleniyor…
            </Txt>
          )}
          {!!player && (
            <View style={{ alignItems: "center", gap: 4 }}>
              <Avatar variant={player.avatar} size={60} />
              <Txt size={18} weight="bold" style={{ textAlign: "center" }}>
                {player.name}
              </Txt>
              <Txt size={12} color={theme.muted}>
                @{player.username}
              </Txt>
            </View>
          )}
          {friendKind && !loading && !friend && !notice && !error && (
            <Txt size={14} color={theme.muted}>
              Arkadaşlık kaydı artık bulunamıyor veya bu hesaba açık değil. Bu
              bildirimden işlem yapılamaz.
            </Txt>
          )}
          {friend && (
            <Txt size={14} style={{ textAlign: "center" }}>
              {friend.state === "accepted"
                ? "Arkadaşlık isteği kabul edilmiş."
                : friend.incoming
                  ? "Sana arkadaşlık isteği gönderdi."
                  : "Gönderdiğin istek yanıt bekliyor."}
            </Txt>
          )}
          {friend?.state === "pending" && friend.incoming && (
            <View style={actionRow}>
              <Button
                fill
                title="Reddet"
                variant="outline"
                disabled={busy || loading}
                onPress={() => void friendReply(false)}
              />
              <Button
                fill
                title="Kabul Et"
                disabled={busy || loading}
                loading={busy}
                onPress={() => void friendReply(true)}
              />
            </View>
          )}
          {!!challengeId && !challenge && (
            <Txt size={14} color={theme.muted}>
              Davet artık listede bulunamıyor veya bu hesaba açık değil.
              Yenileyip tekrar kontrol edebilirsin.
            </Txt>
          )}
          {!!status && (
            <Txt size={14} weight="semibold" style={{ textAlign: "center" }}>
              {status.title}
            </Txt>
          )}
          {status?.canReply && (
            <View style={actionRow}>
              <Button
                fill
                title="Reddet"
                accessibilityLabel="Düelloyu Reddet"
                variant="outline"
                disabled={busy || inbox.busy}
                onPress={() => void challengeReply("decline")}
              />
              <Button
                fill
                title="Kabul Et"
                accessibilityLabel="Düelloyu Kabul Et"
                disabled={busy || inbox.busy}
                loading={busy || inbox.busy}
                onPress={() => void challengeReply("accept")}
              />
            </View>
          )}
          {status?.canCancel && (
            <TextAction
              title="Düello Davetini İptal Et"
              disabled={busy || inbox.busy}
              onPress={() => void challengeReply("cancel")}
            />
          )}
          {challenge?.matchId && (
            <Button
              title={
                challenge.matchState === "completed"
                  ? "Sonuçları Gör"
                  : "Maçı Gör"
              }
              disabled={busy}
              onPress={() => {
                onClose();
                router.push({
                  pathname: "/online",
                  params: { match: challenge.matchId! },
                });
              }}
            />
          )}
          {match && (
            <View style={{ gap: 12 }}>
              <Txt size={14} weight="semibold">
                {match.state === "completed"
                  ? "Yarışma tamamlandı."
                  : match.state === "expired"
                    ? "Maçın süresi doldu."
                    : match.state === "cancelled"
                      ? "Maç iptal edildi."
                      : "Maç henüz tamamlanmadı."}
              </Txt>
              {match.players.map((p) => (
                <Txt size={14} key={p.slot}>
                  {p.name}
                  {match.state === "completed" && p.score !== null
                    ? ` · ${p.score} puan`
                    : ""}
                </Txt>
              ))}
              <Button
                title={
                  match.state === "completed" ? "Sonuçları Gör" : "Maçı Gör"
                }
                disabled={busy}
                onPress={() => {
                  onClose();
                  router.push({
                    pathname: "/online",
                    params: { match: match.id },
                  });
                }}
              />
            </View>
          )}
          {!!player && (
            <TextAction
              title="Profili Gör"
              disabled={busy}
              onPress={() => setShowProfile(true)}
            />
          )}
          {!!notice && (
            <Txt
              size={13}
              accessibilityLiveRegion="polite"
              color={theme.success}
            >
              {notice}
            </Txt>
          )}
          {!!error && (
            <View style={{ gap: 4 }}>
              <Txt size={13} accessibilityRole="alert" color={theme.danger}>
                {error}
              </Txt>
              <TextAction
                title="Durumu yenile"
                disabled={busy || loading}
                onPress={() =>
                  void action(async () => {
                    await inbox.refresh();
                    await load();
                  })
                }
              />
            </View>
          )}
          {readState === "failed" && (
            <View style={{ gap: 4 }}>
              <Txt size={12} accessibilityRole="alert" color={theme.danger}>
                Okundu bilgisi güncellenemedi. Bildirim sayısı henüz
                doğrulanmadı.
              </Txt>
              <TextAction
                title="Okundu bilgisini yeniden dene"
                onPress={() => {
                  if (!n) return;
                  setRead("pending");
                  void read(n.id).then((ok) => {
                    if (alive.current) setRead(ok ? "done" : "failed");
                  });
                }}
              />
            </View>
          )}
        </View>
      )}
    </Dialog>
  );
}
