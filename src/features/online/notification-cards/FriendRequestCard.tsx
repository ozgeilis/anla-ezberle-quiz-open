import React from "react";
import { View, useWindowDimensions } from "react-native";
import { Button } from "../../../components/ui";
import { NotificationCard, notificationCardStyles } from "./NotificationCard";
import type { Friendship } from "../types";
export function FriendRequestCard({
  friend,
  accepted,
  time,
  unread,
  busy,
  onReply,
  onOpen,
}: {
  friend?: Friendship | null;
  accepted: boolean;
  time: string;
  unread: boolean;
  busy: boolean;
  onReply: (accept: boolean) => Promise<void>;
  onOpen: () => void;
}) {
  const { fontScale } = useWindowDimensions();
  const actionable =
    !accepted && friend?.state === "pending" && friend.incoming;
  const name = friend?.player?.name;
  return (
    <NotificationCard
      title={accepted ? "Arkadaşlık kabul edildi" : "Arkadaşlık isteği"}
      summary={
        accepted
          ? name
            ? `${name} ile artık arkadaşsınız.`
            : "Arkadaşlık isteği kabul edildi."
          : name
            ? `${name} seni arkadaş olarak eklemek istiyor.`
            : "İsteğin güncel durumunu görüntüle."
      }
      player={friend?.player}
      time={time}
      unread={unread}
      icon={accepted ? "user-check" : "user-plus"}
      tone={accepted ? "success" : actionable ? "active" : "neutral"}
      onOpen={onOpen}
    >
      {actionable && (
        <View
          style={[
            notificationCardStyles.actions,
            fontScale > 1.4 && { flexDirection: "column" },
          ]}
        >
          <Button
            compact
            fill
            title="Kabul Et"
            accessibilityLabel={`${name ?? "Oyuncu"}: arkadaşlık isteğini kabul et`}
            icon="check"
            disabled={busy}
            onPress={() => onReply(true)}
          />
          <Button
            compact
            fill
            title="Reddet"
            accessibilityLabel={`${name ?? "Oyuncu"}: arkadaşlık isteğini reddet`}
            variant="outline"
            disabled={busy}
            onPress={() => onReply(false)}
          />
        </View>
      )}
    </NotificationCard>
  );
}
