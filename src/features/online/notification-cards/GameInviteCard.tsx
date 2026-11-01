import React from "react";
import { View, useWindowDimensions } from "react-native";
import { Button, Txt } from "../../../components/ui";
import { useTheme } from "../../../theme/tokens";
import { challengeStatus } from "../notifications";
import type { DirectChallenge } from "../types";
import { NotificationCard, notificationCardStyles } from "./NotificationCard";
export function GameInviteCard({
  challenge,
  time,
  unread,
  busy,
  now,
  onJoin,
  onLater,
  onOpen,
}: {
  challenge: DirectChallenge;
  time: string;
  unread?: boolean;
  busy: boolean;
  now: number;
  onJoin: () => Promise<void>;
  onLater: () => Promise<void>;
  onOpen: () => void;
}) {
  const theme = useTheme(),
    { fontScale } = useWindowDimensions();
  const state = challengeStatus(challenge, now),
    name = challenge.player?.name;
  const expired =
    challenge.state === "expired" ||
    (challenge.state === "pending" && !state.canReply && !state.canCancel);
  return (
    <NotificationCard
      title={expired ? "Oyun daveti · Süresi doldu" : "Oyun daveti"}
      summary={
        state.canReply
          ? `${name ?? "Bir oyuncu"} seni düelloya davet etti.`
          : `${name ? `${name} · ` : ""}${state.title}`
      }
      player={challenge.player}
      icon={expired ? "clock" : "zap"}
      tone={
        state.canReply
          ? "active"
          : challenge.state === "accepted"
            ? "success"
            : "neutral"
      }
      time={time}
      unread={unread}
      onOpen={onOpen}
    >
      {state.canReply && (
        <>
          <Txt size={11} color={theme.accent}>
            Düello
          </Txt>
          <View
            style={[
              notificationCardStyles.actions,
              fontScale > 1.4 && { flexDirection: "column" },
            ]}
          >
            <Button
              compact
              fill
              title="Katıl"
              accessibilityLabel={`${name ?? "Oyuncu"}: düello davetine katıl`}
              icon="play"
              disabled={busy}
              onPress={onJoin}
            />
            <Button
              compact
              fill
              title="Daha Sonra"
              accessibilityLabel={`${name ?? "Oyuncu"}: daveti daha sonra yanıtla`}
              variant="outline"
              disabled={busy}
              onPress={onLater}
            />
          </View>
        </>
      )}
    </NotificationCard>
  );
}
