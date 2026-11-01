import React, { useEffect, useRef, useState } from "react";
import { View, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { Button, Card, Icon, Page, TextAction, Txt } from "../../components/ui";
import { useTheme } from "../../theme/tokens";
import { useOnlineAuth } from "./OnlineProvider";
import { useInbox } from "./InboxProvider";
import { NotificationDetail } from "./NotificationDetail";
import {
  newestFirst,
  notificationCopy,
  notificationTime,
  type InboxSelection,
} from "./notifications";
import { NotificationCard } from "./notification-cards/NotificationCard";
import {
  NotificationSectionTabs,
  type NotificationSection,
} from "./notification-cards/NotificationSectionTabs";
import { FriendRequestCard } from "./notification-cards/FriendRequestCard";
import { GameInviteCard } from "./notification-cards/GameInviteCard";
import { useInboxFriends } from "./notification-cards/useInboxFriends";
import type { DirectChallenge, PlayerNotification } from "./types";

export function InboxScreen({
  invitations = false,
}: {
  invitations?: boolean;
}) {
  const { session } = useOnlineAuth();
  return (
    <NotificationList
      key={session?.user.id ?? "guest"}
      invitations={invitations}
    />
  );
}
function NotificationList({ invitations }: { invitations: boolean }) {
  const router = useRouter(),
    inbox = useInbox(),
    { session } = useOnlineAuth(),
    theme = useTheme();
  const { fontScale } = useWindowDimensions();
  const actor = session?.user.is_anonymous ? undefined : session?.user.id;
  const [section, setSection] = useState<NotificationSection>(
      invitations ? "invites" : "all",
    ),
    [selection, setSelection] = useState<InboxSelection | null>(null),
    [reading, setReading] = useState(false),
    [notice, setNotice] = useState(""),
    [now, setNow] = useState(() => Date.now());
  const alive = useRef(true);
  const references = inbox.notifications
    .filter((n) => n.kind === "friend_request" || n.kind === "friend_accepted")
    .map((n) => `${n.kind}:${n.referenceId}`)
    .sort()
    .join(",");
  const friends = useInboxFriends(actor, references);
  useEffect(() => {
    alive.current = true;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      alive.current = false;
      clearInterval(timer);
    };
  }, []);
  const refresh = () => {
    friends.reload();
    void inbox.refresh();
  };
  const join = async (challenge: DirectChallenge, notificationId?: string) => {
    setNotice("");
    const next = await inbox.replyChallenge(challenge.id, "accept");
    if (!alive.current || !next) return;
    if (notificationId) void inbox.read(notificationId);
    if (next.matchId)
      router.push({ pathname: "/online", params: { match: next.matchId } });
    else setNotice("Davet kabul edildi. Güncel ayrıntıları açabilirsin.");
  };
  const later = async (notificationId?: string) => {
    // Deferring is deliberately not a decline, cancel or new backend state.
    const ok = !notificationId || (await inbox.read(notificationId));
    if (alive.current && ok)
      setNotice(
        "Davet bekliyor. Davetler sekmesinden daha sonra yanıtlayabilirsin.",
      );
  };
  const inviteCard = (
    c: DirectChallenge,
    notification?: PlayerNotification,
  ) => (
    <GameInviteCard
      key={notification?.id ?? c.id}
      challenge={c}
      now={now}
      time={notificationTime(notification?.createdAt ?? c.createdAt, now)}
      unread={notification ? !notification.read : false}
      busy={inbox.busy}
      onJoin={() => join(c, notification?.id)}
      onLater={() => later(notification?.id)}
      onOpen={() =>
        setSelection(
          notification
            ? { kind: "notification", notification }
            : { kind: "challenge", challengeId: c.id },
        )
      }
    />
  );
  const notifications = newestFirst(inbox.notifications).filter(
    (n) =>
      section !== "requests" ||
      n.kind === "friend_request" ||
      n.kind === "friend_accepted",
  );
  const empty =
    section === "invites"
      ? inbox.challenges.length === 0
      : notifications.length === 0;
  const readAll =
    actor && inbox.unreadCount > 0 ? (
      <TextAction
        title="Tümünü oku"
        disabled={reading}
        onPress={() => {
          if (reading) return;
          setReading(true);
          void inbox.read("all").finally(() => {
            if (alive.current) setReading(false);
          });
        }}
      />
    ) : undefined;
  return (
    <Page
      title={invitations ? "Davetlerim" : "Bildirimler"}
      subtitle="İstekler ve davetler"
      right={fontScale <= 1.3 ? readAll : undefined}
    >
      {!actor ? (
        <Card style={{ gap: 12 }}>
          <Txt size={14}>
            Bildirimlerini görmek için hesabınla giriş yap. Yerel ilerlemen
            korunur.
          </Txt>
          <Button
            compact
            title="Hesaba giriş yap"
            onPress={() => router.push("/online")}
          />
        </Card>
      ) : (
        <View style={{ gap: 12 }}>
          {fontScale > 1.3 && readAll && (
            <View style={{ alignItems: "flex-end" }}>{readAll}</View>
          )}
          <NotificationSectionTabs value={section} onChange={setSection} />
          {!!(inbox.error || friends.error) && (
            <Card style={{ gap: 8 }}>
              <Txt size={13} accessibilityRole="alert" color={theme.danger}>
                {inbox.error || friends.error}
              </Txt>
              <TextAction title="Yeniden Dene" onPress={refresh} />
            </Card>
          )}
          {!!(notice || friends.notice) && (
            <Txt
              size={13}
              accessibilityLiveRegion="polite"
              color={theme.success}
            >
              {notice || friends.notice}
            </Txt>
          )}
          {(!inbox.ready || friends.loading) && !inbox.error && (
            <Txt size={13} color={theme.muted}>
              Bildirimler yükleniyor…
            </Txt>
          )}
          {inbox.ready && empty && (
            <View style={{ paddingVertical: 24, alignItems: "center", gap: 8 }}>
              <Icon name="bell" size={28} color={theme.accent} />
              <Txt size={16} weight="bold">
                {section === "requests"
                  ? "Henüz arkadaşlık isteğin yok."
                  : section === "invites"
                    ? "Henüz oyun davetin yok."
                    : "Henüz bildirim yok."}
              </Txt>
              <Txt size={13} color={theme.muted}>
                Yeni gelişmeler burada görünecek.
              </Txt>
            </View>
          )}
          {section === "invites"
            ? newestFirst(inbox.challenges).map((c) => inviteCard(c))
            : notifications.map((n) => {
                const onOpen = () =>
                  setSelection({ kind: "notification", notification: n });
                const time = notificationTime(n.createdAt, now);
                if (
                  n.kind === "friend_request" ||
                  n.kind === "friend_accepted"
                ) {
                  const friend = friends.friends.find(
                    (f) => f.id === n.referenceId,
                  );
                  return (
                    <FriendRequestCard
                      key={n.id}
                      friend={friend}
                      accepted={
                        n.kind === "friend_accepted" ||
                        friend?.state === "accepted"
                      }
                      time={time}
                      unread={!n.read}
                      busy={friends.busy || friends.loading}
                      onOpen={onOpen}
                      onReply={async (accept) => {
                        if (!friend) return;
                        const saved = await friends.reply(friend, accept);
                        if (alive.current && saved) {
                          await inbox.read(n.id);
                          await inbox.refresh();
                        }
                      }}
                    />
                  );
                }
                const c = inbox.challenges.find((c) => c.id === n.referenceId);
                if (n.kind === "challenge_received" && c)
                  return inviteCard(c, n);
                const copy = notificationCopy[n.kind];
                return (
                  <NotificationCard
                    key={n.id}
                    title={copy.title}
                    summary={copy.summary}
                    time={time}
                    unread={!n.read}
                    icon={copy.icon}
                    tone={
                      n.kind === "challenge_accepted" ? "success" : "neutral"
                    }
                    onOpen={onOpen}
                  />
                );
              })}
        </View>
      )}
      {!!selection && actor && (
        <NotificationDetail
          key={
            selection.kind === "notification"
              ? selection.notification.id
              : selection.challengeId
          }
          selection={selection}
          onClose={() => {
            setSelection(null);
            friends.reload();
          }}
        />
      )}
    </Page>
  );
}
