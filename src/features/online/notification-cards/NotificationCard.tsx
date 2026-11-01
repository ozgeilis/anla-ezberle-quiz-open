import React from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { Avatar } from "../../../components/game/Artwork";
import { Icon, Tap, Txt } from "../../../components/ui";
import type { IconName } from "../../../components/ui/primitives";
import { useTheme } from "../../../theme/tokens";
import type { SocialPlayer } from "../types";

export function NotificationCard({
  title,
  summary,
  time,
  player,
  icon,
  tone = "neutral",
  unread,
  onOpen,
  children,
}: React.PropsWithChildren<{
  title: string;
  summary: string;
  time: string;
  player?: SocialPlayer | null;
  icon: IconName;
  tone?: "neutral" | "active" | "success";
  unread?: boolean;
  onOpen: () => void;
}>) {
  const theme = useTheme(),
    { fontScale } = useWindowDimensions();
  const color = tone === "success" ? theme.success : theme.accent;
  return (
    <View
      testID="notification-card"
      style={[
        styles.card,
        {
          backgroundColor: tone === "success" ? theme.mintSurface : theme.card,
          borderColor: tone === "active" ? theme.goldBorder : theme.border,
        },
      ]}
    >
      <Tap
        onPress={onOpen}
        label={`${title}. ${summary}. ${time}${unread ? ", okunmamış" : ", okundu"}. Ayrıntıları aç`}
        style={styles.header}
      >
        <View style={{ alignSelf: "flex-start" }}>
          {player ? (
            <Avatar variant={player.avatar} size={48} />
          ) : (
            <View
              style={[styles.symbol, { backgroundColor: theme.mintSurface }]}
            >
              <Icon name={icon} size={23} color={color} />
            </View>
          )}
          <View
            style={[
              styles.badge,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <Icon name={icon} size={12} color={color} />
          </View>
        </View>
        <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
          <Txt
            size={16}
            weight="bold"
            numberOfLines={fontScale > 1.3 ? undefined : 2}
          >
            {title}
          </Txt>
          <Txt
            size={13}
            color={theme.muted}
            numberOfLines={fontScale > 1.3 ? undefined : 2}
          >
            {summary}
          </Txt>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Txt size={11} color={theme.muted}>
              {time}
            </Txt>
            {unread && (
              <View
                accessibilityElementsHidden
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: theme.accent,
                }}
              />
            )}
          </View>
        </View>
      </Tap>
      {children}
    </View>
  );
}
export const notificationCardStyles = StyleSheet.create({
  actions: { flexDirection: "row", gap: 8 },
});
const styles = StyleSheet.create({
  card: { padding: 12, borderRadius: 18, borderWidth: 1, gap: 12 },
  header: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    minHeight: 48,
  },
  symbol: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
