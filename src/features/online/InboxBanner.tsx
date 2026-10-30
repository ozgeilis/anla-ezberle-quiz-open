import React from "react";
import { View } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Tap, Txt, Icon } from "../../components/ui";
import { useTheme } from "../../theme/tokens";
import { useInbox, notificationTitle } from "./InboxProvider";
export function InboxBanner() {
  const router = useRouter();
  const inbox = useInbox(),
    theme = useTheme(),
    path = usePathname();
  if (!inbox.unreadCount || path === "/online/inbox" || path === "/")
    return null;
  const latest = inbox.notifications.find((n) => !n.read);
  return (
    <View style={{ padding: 8, backgroundColor: theme.goldSurface }}>
      <Tap
        label={`Bildirimler: ${inbox.unreadCount} okunmamış`}
        onPress={() => router.push("/online/inbox")}
        style={{
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
          paddingHorizontal: 10,
        }}
      >
        <Icon name="bell" color={theme.goldInk} size={22} />
        <Txt
          accessibilityLiveRegion="polite"
          size={12}
          weight="bold"
          color={theme.goldInk}
          style={{ flex: 1 }}
        >
          {latest ? notificationTitle[latest.kind] : "Bildirimlerin var"} ·{" "}
          {inbox.unreadCount}
        </Txt>
      </Tap>
    </View>
  );
}
