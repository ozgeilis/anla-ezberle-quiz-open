import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { Icon, Tap, Txt } from ".";
import { colors as c } from "../../theme/tokens";
import { useInbox } from "../../features/online/InboxProvider";
export function SettingsButton() {
  return (
    <Tap
      label="Ayarlar"
      onPress={() => router.push("/settings")}
      style={headerButton}
    >
      <Icon name="settings" color={c.white} size={20} />
    </Tap>
  );
}
export function NotificationsButton() {
  const { unreadCount } = useInbox();
  return (
    <Tap
      label={`Davetler ve Bildirimler${unreadCount ? `, ${unreadCount} okunmamış` : ""}`}
      onPress={() => router.push("/online/inbox")}
      style={headerButton}
    >
      <Icon name="bell" color={c.paleGold} size={20} />
      {unreadCount > 0 && (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: -5,
            right: -5,
            minWidth: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: c.deepCoral,
            borderWidth: 1,
            borderColor: c.white,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 3,
          }}
        >
          <Txt size={10} weight="heavy" color={c.white}>
            {unreadCount > 99 ? "99+" : unreadCount}
          </Txt>
        </View>
      )}
    </Tap>
  );
}
const headerButton = {
  width: 44,
  minHeight: 44,
  borderRadius: 22,
  backgroundColor: "rgba(0,67,72,.86)",
  borderWidth: 1,
  borderColor: "rgba(255,227,155,.65)",
  alignItems: "center",
  justifyContent: "center",
} as const;
