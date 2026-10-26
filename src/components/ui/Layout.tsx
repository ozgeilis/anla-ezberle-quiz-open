import React, { useEffect, useRef } from "react";
import { ScrollView, StyleProp, View, ViewStyle } from "react-native";
import { Pattern } from "../game/Artwork";
import { colors as c, useTheme } from "../../theme/tokens";
import { Icon, IconName, Txt } from "./primitives";
import { IconButton } from "./Button";
import { s } from "./styles";
export function Chip({
  children,
  icon,
  style,
}: React.PropsWithChildren<{ icon?: IconName; style?: StyleProp<ViewStyle> }>) {
  return (
    <View style={[s.chip, style]}>
      {icon && <Icon name={icon} color={c.darkGold} size={13} />}
      <Txt size={11} weight="bold" color={c.darkGold}>
        {children}
      </Txt>
    </View>
  );
}
export function Card({
  children,
  style,
}: React.PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  const theme = useTheme();
  return (
    <View
      style={[
        s.card,
        { backgroundColor: theme.card, borderColor: theme.border },
        style,
      ]}
    >
      {children}
    </View>
  );
}
export function Page({
  children,
  title,
  subtitle,
  right,
  scrollResetKey,
  onBack,
}: React.PropsWithChildren<{
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  scrollResetKey?: string;
  onBack?: () => void;
}>) {
  const theme = useTheme();
  const scroll = useRef<React.ComponentRef<typeof ScrollView>>(null);
  useEffect(() => {
    if (scrollResetKey === undefined) return;
    const frame = requestAnimationFrame(() =>
      scroll.current?.scrollTo({ y: 0, animated: false }),
    );
    return () => cancelAnimationFrame(frame);
  }, [scrollResetKey]);
  return (
    <ScrollView
      ref={scroll}
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{
        padding: 16,
        paddingBottom: 24,
        width: "100%",
        maxWidth: 900,
        alignSelf: "center",
      }}
      keyboardShouldPersistTaps="handled"
    >
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          left: 0,
          height: 260,
          opacity: 0.055,
        }}
      >
        <Pattern color={theme.pattern} opacity={1} />
      </View>
      <View
        style={[
          s.row,
          { marginTop: 0, marginBottom: 20, justifyContent: "space-between" },
        ]}
      >
        {onBack && (
          <IconButton name="chevron-left" label="Geri Dön" onPress={onBack} />
        )}
        <View style={{ flex: 1, minWidth: 0 }}>
          <Txt accessibilityRole="header" size={22} weight="heavy">
            {title}
          </Txt>
          {subtitle && (
            <Txt size={12} color={theme.muted} style={{ marginTop: 4 }}>
              {subtitle}
            </Txt>
          )}
        </View>
        {right}
      </View>
      {children}
    </ScrollView>
  );
}
