import React, { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, View, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { Avatar } from "../../components/game/Artwork";
import { Button, Dialog, Icon, Txt } from "../../components/ui";
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
  const { height } = useWindowDimensions();
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
  const date = n?.createdAt ?? challenge?.createdAt;
  return (
    <Dialog visible title={title} onClose={onClose}>
      <ScrollView
        style={{ maxHeight: Math.max(180, height - 210) }}
        contentContainerStyle={{ gap: 14 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 18,
              backgroundColor: theme.goldSurface,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon
              name={n ? notificationCopy[n.kind].icon : "zap"}
              size={27}
              color={theme.goldInk}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Txt size={14} weight="bold">
              {n
                ? notificationCopy[n.kind].summary
                : "10 ortak soru · Her doğruya 100 puan"}
            </Txt>
            {date && (
              <Txt size={12} color={theme.muted}>
                {new Date(date).toLocaleString("tr-TR", {
                  timeZone: "Europe/Istanbul",
                })}
              </Txt>
            )}
          </View>
        </View>
        {readState === "pending" && (
          <Txt size={12} color={theme.muted}>
            Okundu bilgisi güncelleniyor…
          </Txt>
        )}
        {readState === "failed" && (
          <>
            <Txt accessibilityRole="alert" color={theme.danger}>
              Okundu bilgisi güncellenemedi. Bildirim sayısı henüz doğrulanmadı.
            </Txt>
            <Button
              title="Okundu bilgisini yeniden dene"
              variant="outline"
              onPress={() => {
                if (!n) return;
                setRead("pending");
                void read(n.id).then((ok) => {
                  if (alive.current) setRead(ok ? "done" : "failed");
                });
              }}
            />
          </>
        )}
        {loading && <Txt>Güvenli ayrıntılar yükleniyor…</Txt>}
        {!!player && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Avatar variant={player.avatar} size={48} />
            <View style={{ flex: 1 }}>
              <Txt size={18} weight="heavy">
                {player.name}
              </Txt>
              <Txt size={13} color={theme.accent}>
                @{player.username}
              </Txt>
            </View>
          </View>
        )}
        {friendKind && !loading && !friend && !notice && !error && (
          <Txt color={theme.muted}>
            Arkadaşlık kaydı artık bulunamıyor veya bu hesaba açık değil. Bu
            bildirimden işlem yapılamaz.
          </Txt>
        )}
        {friend && (
          <Txt>
            {friend.state === "accepted"
              ? "Arkadaşlık isteği kabul edilmiş."
              : friend.incoming
                ? "Sana bir arkadaşlık isteği gönderdi."
                : "Gönderdiğin istek yanıt bekliyor."}
          </Txt>
        )}
        {friend?.state === "pending" && friend.incoming && (
          <>
            <Button
              title="Kabul Et"
              icon="user-check"
              disabled={busy || loading}
              onPress={() => void friendReply(true)}
            />
            <Button
              title="Reddet"
              variant="outline"
              disabled={busy || loading}
              onPress={() => void friendReply(false)}
            />
          </>
        )}
        {!!challengeId && !challenge && (
          <Txt color={theme.muted}>
            Davet artık listede bulunamıyor veya bu hesaba açık değil. Yenileyip
            tekrar kontrol edebilirsin.
          </Txt>
        )}
        {!!status && <Txt weight="bold">{status.title}</Txt>}
        {status?.canReply && (
          <>
            <Button
              title="Düelloyu Kabul Et"
              icon="play"
              disabled={busy || inbox.busy}
              onPress={() => void challengeReply("accept")}
            />
            <Button
              title="Düelloyu Reddet"
              variant="outline"
              disabled={busy || inbox.busy}
              onPress={() => void challengeReply("decline")}
            />
          </>
        )}
        {status?.canCancel && (
          <Button
            title="Düello Davetini İptal Et"
            variant="outline"
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
            icon="arrow-right"
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
          <>
            <Txt weight="bold">
              {match.state === "completed"
                ? "Yarışma tamamlandı."
                : match.state === "expired"
                  ? "Maçın süresi doldu."
                  : match.state === "cancelled"
                    ? "Maç iptal edildi."
                    : "Maç henüz tamamlanmadı."}
            </Txt>
            {match.players.map((p) => (
              <Txt key={p.slot}>
                {p.name}
                {match.state === "completed" && p.score !== null
                  ? ` · ${p.score} puan`
                  : ""}
              </Txt>
            ))}
            <Button
              title={match.state === "completed" ? "Sonuçları Gör" : "Maçı Gör"}
              disabled={busy}
              onPress={() => {
                onClose();
                router.push({
                  pathname: "/online",
                  params: { match: match.id },
                });
              }}
            />
          </>
        )}
        {!!player && (
          <>
            <Button
              title={showProfile ? "Profil bilgilerini gizle" : "Profili Gör"}
              variant="outline"
              disabled={busy}
              onPress={() => setShowProfile(!showProfile)}
            />
            {showProfile && (
              <View
                style={{
                  padding: 12,
                  borderRadius: 16,
                  backgroundColor: theme.mintSurface,
                  gap: 8,
                }}
              >
                <Txt size={13}>
                  Seviye {player.level} · {player.xp} çevrimiçi XP
                </Txt>
                <PublicAchievements player={player} />
              </View>
            )}
          </>
        )}
        {!!notice && (
          <Txt accessibilityLiveRegion="polite" color={theme.success}>
            {notice}
          </Txt>
        )}
        {!!error && (
          <Txt accessibilityRole="alert" color={theme.danger}>
            {error}
          </Txt>
        )}
        <Button
          title="Durumu yenile"
          icon="refresh-cw"
          variant="outline"
          disabled={busy || loading}
          onPress={() =>
            void action(async () => {
              await inbox.refresh();
              await load();
            })
          }
        />
      </ScrollView>
    </Dialog>
  );
}
