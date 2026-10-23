import React, { useEffect, useState } from "react";
import { View, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { Button, Card, Icon, Page, Tap, Txt } from "../../components/ui";
import { Avatar } from "../../components/game/Artwork";
import { useTheme } from "../../theme/tokens";
import { useOnlineAuth } from "./OnlineProvider";
import { useInbox } from "./InboxProvider";
import { NotificationDetail } from "./NotificationDetail";
import {
  challengeStatus,
  newestFirst,
  notificationCopy,
  notificationTime,
  InboxSelection,
} from "./notifications";
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
  const { width } = useWindowDimensions();
  const inbox = useInbox(),
    { session } = useOnlineAuth(),
    theme = useTheme();
  const [selection, setSelection] = useState<InboxSelection | null>(null),
    [reading, setReading] = useState(false),
    [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);
  const smallLink = (
    label: string,
    icon: "check" | "arrow-left" | "send" | "refresh-cw",
    action: () => void,
    disabled = false,
    caption = label,
  ) => (
    <Tap
      label={label}
      disabled={disabled}
      onPress={action}
      style={{
        minHeight: 44,
        minWidth: 44,
        paddingHorizontal: 10,
        borderRadius: 14,
        backgroundColor: theme.mintSurface,
        flexDirection: "row",
        gap: 6,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon name={icon} size={17} color={theme.accent} />
      {!!caption && (
        <Txt
          size={12}
          weight="bold"
          color={theme.accent}
          style={{ flexShrink: 1 }}
        >
          {caption}
        </Txt>
      )}
    </Tap>
  );
  return (
    <Page
      title={invitations ? "Davetlerim" : "Bildirimler"}
      subtitle={
        invitations ? "Gönderilen ve gelen düello davetlerin." : undefined
      }
      right={
        session && !invitations && inbox.unreadCount > 0
          ? smallLink(
              "Tümünü Okundu İşaretle",
              "check",
              () => {
                if (reading) return;
                setReading(true);
                void inbox.read("all").finally(() => setReading(false));
              },
              reading,
              width < 360 ? "" : width < 600 ? "Tümünü oku" : undefined,
            )
          : undefined
      }
    >
      {!session ? (
        <Card style={{ gap: 12 }}>
          <Txt>
            Bildirimlerini ve davetlerini görmek için doğrulanmış hesabınla
            giriş yap. Yerel oyun ilerlemen korunur.
          </Txt>
          <Button
            title="Hesaba giriş yap"
            onPress={() => router.push("/online")}
          />
        </Card>
      ) : (
        <View style={{ gap: 12 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            {invitations
              ? smallLink("Bildirimlere dön", "arrow-left", () =>
                  router.replace("/online/inbox"),
                )
              : smallLink("Davetlerim", "send", () =>
                  router.push("/online/invitations"),
                )}
            {smallLink(
              "Bildirimleri yenile",
              "refresh-cw",
              () => void inbox.refresh(),
            )}
          </View>
          {!!inbox.error && (
            <Txt accessibilityRole="alert" color={theme.danger}>
              {inbox.error}
            </Txt>
          )}
          {!inbox.ready && !inbox.error && (
            <Txt color={theme.muted}>Bildirimlerin yükleniyor…</Txt>
          )}
          {inbox.ready &&
            (invitations
              ? inbox.challenges.length === 0
              : inbox.notifications.length === 0) && (
              <View
                style={{ paddingVertical: 36, alignItems: "center", gap: 12 }}
              >
                <View
                  style={{
                    padding: 18,
                    borderRadius: 24,
                    backgroundColor: theme.mintSurface,
                  }}
                >
                  <Icon
                    name={invitations ? "send" : "bell"}
                    size={32}
                    color={theme.accent}
                  />
                </View>
                <Txt size={18} weight="heavy">
                  {invitations
                    ? "Henüz düello davetin yok."
                    : "Henüz bildirim yok."}
                </Txt>
                <Txt size={13} color={theme.muted}>
                  Yeni gelişmeler burada görünecek.
                </Txt>
              </View>
            )}
          {!invitations
            ? newestFirst(inbox.notifications).map((n) => {
                const copy = notificationCopy[n.kind],
                  challenge = inbox.challenges.find(
                    (c) => c.id === n.referenceId,
                  ),
                  player = challenge?.player;
                return (
                  <Tap
                    key={n.id}
                    label={`${copy.title}, ${notificationTime(n.createdAt, now)}, ${n.read ? "okundu" : "okunmamış"}. Ayrıntıları aç`}
                    onPress={() =>
                      setSelection({ kind: "notification", notification: n })
                    }
                    style={{
                      minHeight: 80,
                      padding: 12,
                      borderRadius: 16,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                      backgroundColor: n.read ? theme.card : theme.mintSurface,
                      borderBottomWidth: 1,
                      borderColor: theme.border,
                    }}
                  >
                    {player ? (
                      <Avatar variant={player.avatar} size={40} />
                    ) : (
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 14,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor:
                            copy.tone === "gold"
                              ? theme.goldSurface
                              : copy.tone === "rose"
                                ? theme.roseSurface
                                : theme.mintSurface,
                        }}
                      >
                        <Icon
                          name={copy.icon}
                          color={
                            copy.tone === "gold"
                              ? theme.goldInk
                              : copy.tone === "rose"
                                ? theme.danger
                                : theme.accent
                          }
                          size={21}
                        />
                      </View>
                    )}
                    <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
                      <Txt
                        size={14}
                        weight={n.read ? "bold" : "heavy"}
                        numberOfLines={1}
                      >
                        {copy.title}
                      </Txt>
                      <Txt size={12} color={theme.muted} numberOfLines={2}>
                        {player ? `${player.name} · ` : ""}
                        {copy.summary}
                      </Txt>
                    </View>
                    <View
                      style={{ alignItems: "flex-end", gap: 9, maxWidth: 58 }}
                    >
                      <Txt size={10} color={theme.muted}>
                        {notificationTime(n.createdAt, now)}
                      </Txt>
                      {!n.read && (
                        <View
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: 4,
                            backgroundColor: theme.accent,
                          }}
                        />
                      )}
                    </View>
                  </Tap>
                );
              })
            : newestFirst(inbox.challenges).map((c) => (
                <Tap
                  key={c.id}
                  label={`${c.player?.name ?? "Düello daveti"}, ${challengeStatus(c, now).title}. Ayrıntıları aç`}
                  onPress={() =>
                    setSelection({ kind: "challenge", challengeId: c.id })
                  }
                  style={{
                    minHeight: 80,
                    padding: 12,
                    borderRadius: 16,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    backgroundColor: theme.card,
                    borderBottomWidth: 1,
                    borderColor: theme.border,
                  }}
                >
                  {c.player && <Avatar variant={c.player.avatar} size={40} />}
                  <View style={{ flex: 1 }}>
                    <Txt weight="heavy">
                      {c.player?.name ?? "Düello daveti"}
                    </Txt>
                    <Txt size={12} color={theme.muted}>
                      {challengeStatus(c, now).title} ·{" "}
                      {c.incoming ? "Gelen" : "Gönderilen"}
                    </Txt>
                  </View>
                  <Icon name="chevron-right" color={theme.accent} />
                </Tap>
              ))}
        </View>
      )}
      {!!selection && session && (
        <NotificationDetail
          selection={selection}
          onClose={() => setSelection(null)}
        />
      )}
    </Page>
  );
}
