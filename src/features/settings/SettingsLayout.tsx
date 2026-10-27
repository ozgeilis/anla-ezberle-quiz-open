import React from "react";
import { ScrollView, View } from "react-native";
import { router } from "expo-router";
import { Icon, type IconName, Tap, Txt } from "../../components/ui";
import { useTheme } from "../../theme/tokens";

export function SettingRow({
  title,
  subtitle,
  icon,
  onPress,
}: {
  title: string;
  subtitle: string;
  icon: IconName;
  onPress: () => void;
}) {
  const t = useTheme();
  return (
    <Tap
      label={title}
      onPress={onPress}
      style={{
        minHeight: 64,
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: t.border,
        backgroundColor: t.card,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 12,
          backgroundColor: t.mintSurface,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name={icon} size={20} color={t.accent} />
      </View>
      <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
        <Txt size={16} weight="semibold">
          {title}
        </Txt>
        <Txt size={12} color={t.muted}>
          {subtitle}
        </Txt>
      </View>
      <Icon name="chevron-right" size={18} color={t.muted} />
    </Tap>
  );
}
export function SettingsFrame({
  title,
  children,
}: React.PropsWithChildren<{ title: string }>) {
  const t = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: t.background }}>
      <View
        style={{
          padding: 16,
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
          backgroundColor: t.mintSurface,
          borderBottomWidth: 1,
          borderColor: t.border,
        }}
      >
        <Tap
          label="Ayarlardan geri dön"
          onPress={() =>
            router.canGoBack()
              ? router.back()
              : router.replace(title === "Ayarlar" ? "/profile" : "/settings")
          }
          style={{
            width: 44,
            minHeight: 44,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 14,
            backgroundColor: t.card,
          }}
        >
          <Icon name="chevron-left" color={t.accent} />
        </Tap>
        <Txt
          size={22}
          weight="heavy"
          accessibilityRole="header"
          style={{ flex: 1 }}
        >
          {title}
        </Txt>
      </View>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 24,
          gap: 12,
          width: "100%",
          maxWidth: 720,
          alignSelf: "center",
        }}
      >
        {children}
      </ScrollView>
    </View>
  );
}
