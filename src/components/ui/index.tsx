import { useSound } from "../../features/audio/SoundProvider";
import type { SoundEffect } from "../../features/audio/catalog";
import Feather from "@expo/vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import React, { ComponentProps, useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native";
import { Pattern } from "../game/Artwork";
import { useGame, useGameDisplay } from "../../storage/GameProvider";
import {
  colors as c,
  fonts,
  gradients,
  radius,
  shadows,
  space,
  typeScale,
  useTheme,
} from "../../theme/tokens";

export type IconName = ComponentProps<typeof Feather>["name"];
export function Icon({
  name,
  size = 22,
  color = c.teal,
}: {
  name: IconName;
  size?: number;
  color?: string;
}) {
  return (
    <Feather
      name={name}
      size={size}
      color={color}
      accessible={false}
      aria-hidden={true}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    />
  );
}
export function Txt({
  children,
  size = 14,
  weight = "regular",
  color,
  style,
  ...props
}: TextProps & { size?: number; weight?: keyof typeof fonts; color?: string }) {
  const theme = useTheme();
  return (
    <Text
      {...props}
      style={[
        {
          fontFamily: fonts[weight],
          fontSize: size,
          color: color ?? theme.text,
          lineHeight: size * 1.4,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
export function useReducedMotion() {
  const { profile } = useGameDisplay();
  const [system, setSystem] = useState(true);
  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setSystem);
    const listener = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setSystem,
    );
    return () => listener.remove();
  }, []);
  return system || profile.reduceMotion;
}
export function Tap({
  children,
  onPress,
  disabled,
  label,
  style,
  selected,
  role = "button",
  fill = false,
  sound,
}: React.PropsWithChildren<{
  onPress: () => void;
  sound?: SoundEffect | false;
  disabled?: boolean;
  label: string;
  selected?: boolean;
  role?: "button" | "radio" | "tab";
  fill?: boolean;
  style?: StyleProp<ViewStyle>;
}>) {
  const audio = useSound();
  const [scale] = useState(() => new Animated.Value(1));
  const [focused, setFocused] = useState(false);
  const theme = useTheme();
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) {
      scale.stopAnimation();
      scale.setValue(1);
    }
  }, [reduce, scale]);
  const animate = (to: number) => {
    if (!reduce)
      Animated.spring(scale, {
        toValue: to,
        useNativeDriver: Platform.OS !== "web",
        speed: 40,
        bounciness: 2,
      }).start();
  };
  return (
    <Animated.View
      style={{ transform: [{ scale }], ...(fill ? { flex: 1 } : {}) }}
    >
      <Pressable
        accessibilityRole={role}
        aria-checked={role === "radio" ? !!selected : undefined}
        aria-selected={role === "tab" ? !!selected : undefined}
        accessibilityLabel={label}
        accessibilityState={{
          disabled: !!disabled,
          ...(role === "radio" ? { checked: !!selected } : { selected }),
        }}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onPress={() => {
          // Gameplay/selection owns the gesture. Audio runs after the visual
          // commit; native player creation must never sit before onPress.
          onPress();
          if (sound !== false) {
            const cue = sound ?? (role === "radio" ? "select" : "tap");
            requestAnimationFrame(() =>
              setTimeout(() => {
                audio.activate();
                audio.play(cue);
              }, 0),
            );
          }
        }}
        onPressIn={() => animate(0.98)}
        onPressOut={() => animate(1)}
        style={({ pressed }) => [
          {
            minHeight: 44,
            minWidth: 0,
            ...(fill ? { flex: 1 } : {}),
            opacity: disabled ? 0.65 : pressed ? 0.9 : 1,
          },
          style,
          Platform.OS === "web"
            ? {
                outlineColor: theme.goldBorder,
                outlineStyle: "solid",
                outlineWidth: focused && !disabled ? 2 : 0,
                outlineOffset: 3,
              }
            : undefined,
        ]}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
export function Button({
  title,
  onPress,
  icon,
  trailing,
  variant = "green",
  compact = false,
  fill = false,
  disabled,
  style,
}: {
  title: string;
  onPress: () => void;
  icon?: IconName;
  trailing?: IconName;
  variant?: "orange" | "mustard" | "green" | "blue" | "outline";
  compact?: boolean;
  fill?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const theme = useTheme();
  const goldAction = variant === "orange" || variant === "mustard";
  const gradient = disabled
    ? ([theme.panel, theme.goldSurface] as const)
    : variant === "mustard"
      ? gradients.mustard
      : variant === "orange"
        ? gradients.action
        : variant === "blue"
          ? ([c.blue, c.deepBlue] as const)
          : gradients.green;
  const textColor = disabled
    ? theme.muted
    : variant === "outline"
      ? theme.text
      : goldAction
        ? c.ink
        : c.white;
  const content = (
    <View
      style={[
        s.buttonContent,
        compact && {
          minHeight: 44,
          paddingVertical: 10,
          paddingHorizontal: 8,
          gap: 6,
        },
      ]}
    >
      {icon &&
        (goldAction ? (
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 18,
              backgroundColor: disabled ? theme.border : c.darkGold,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Icon
              name={icon}
              color={disabled ? theme.muted : c.white}
              size={20}
            />
          </View>
        ) : (
          <Icon name={icon} color={textColor} size={23} />
        ))}
      <Txt
        weight="heavy"
        size={compact ? 13 : typeScale.action}
        color={textColor}
        style={{ flexShrink: 1, textAlign: "center" }}
      >
        {title}
      </Txt>
      {trailing && <Icon name={trailing} color={textColor} size={23} />}
    </View>
  );
  return (
    <Tap
      label={title}
      fill={fill}
      onPress={onPress}
      disabled={disabled}
      style={[
        s.button,
        {
          borderColor:
            variant === "outline"
              ? theme.border
              : goldAction
                ? c.paleGold
                : c.tealLight,
          backgroundColor: theme.card,
          opacity: 1,
          boxShadow: disabled
            ? "none"
            : goldAction
              ? shadows.goldButton
              : variant === "outline"
                ? shadows.card
                : shadows.button,
        },
        style,
        compact && { minHeight: 44, borderRadius: 16 },
      ]}
    >
      {variant === "outline" ? (
        content
      ) : (
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.7, y: 1 }}
        >
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: 2,
              left: 10,
              right: 10,
              height: 1,
              backgroundColor: "rgba(255,255,255,0.45)",
            }}
          />
          {content}
        </LinearGradient>
      )}
    </Tap>
  );
}
export function IconButton({
  name,
  label,
  onPress,
  light = false,
}: {
  name: IconName;
  label: string;
  onPress: () => void;
  light?: boolean;
}) {
  const theme = useTheme();
  return (
    <Tap
      onPress={onPress}
      label={label}
      style={[
        s.iconButton,
        {
          backgroundColor: light ? "rgba(255,255,255,0.1)" : theme.mintSurface,
          borderColor: light ? "rgba(255,255,255,0.18)" : theme.border,
          borderWidth: 1,
        },
      ]}
    >
      <Icon
        name={name}
        color={light ? c.white : theme.dark ? c.tealLight : c.teal}
      />
    </Tap>
  );
}
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
}: React.PropsWithChildren<{
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  scrollResetKey?: string;
}>) {
  const theme = useTheme();
  const compact = useWindowDimensions().width < 360;
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
        padding: compact ? 16 : 24,
        paddingBottom: 32,
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
          { marginTop: 12, marginBottom: 24, justifyContent: "space-between" },
        ]}
      >
        <View style={{ flex: 1, minWidth: 0 }}>
          <Txt
            accessibilityRole="header"
            size={compact ? 27 : 30}
            weight="heavy"
          >
            {title}
          </Txt>
          {subtitle && (
            <Txt size={15} color={theme.muted} style={{ marginTop: 7 }}>
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
export function Dialog({
  visible,
  title,
  children,
  onClose,
}: React.PropsWithChildren<{
  visible: boolean;
  title: string;
  onClose: () => void;
}>) {
  const theme = useTheme();
  const reduced = useReducedMotion();
  return (
    <Modal
      visible={visible}
      transparent
      animationType={reduced ? "none" : "fade"}
      onRequestClose={onClose}
    >
      <View style={s.backdrop}>
        <View
          accessibilityViewIsModal
          role="dialog"
          accessibilityLabel={title}
          style={[s.dialog, { backgroundColor: theme.background }]}
        >
          <View
            style={[
              s.row,
              { justifyContent: "space-between", marginBottom: 16 },
            ]}
          >
            <Txt
              accessibilityRole="header"
              size={23}
              weight="heavy"
              style={{ flex: 1 }}
            >
              {title}
            </Txt>
            <IconButton name="x" label="Pencereyi kapat" onPress={onClose} />
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );
}
export function StorageNotice() {
  const { storageError, startError, retryRead, saving } = useGame();
  if (!storageError && !startError) return null;
  return (
    <View
      accessibilityRole="alert"
      style={{ backgroundColor: c.paleGold, padding: 12, gap: 8 }}
    >
      <Txt size={12} color={c.ink}>
        {startError ?? storageError}
      </Txt>
      {storageError && (
        <Tap
          disabled={saving}
          label="Kaydı yeniden oku"
          onPress={() => void retryRead()}
          style={{ minHeight: 44, justifyContent: "center" }}
        >
          <Txt color={c.teal} weight="bold">
            Kaydı yeniden oku
          </Txt>
        </Tap>
      )}
    </View>
  );
}
export const s = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  card: {
    borderRadius: radius.card,
    padding: space.lg,
    borderWidth: 1,
    boxShadow: shadows.card,
  },
  button: {
    minHeight: 60,
    borderRadius: radius.lg,
    borderWidth: 2,
    overflow: "hidden",
    boxShadow: shadows.button,
    marginVertical: 4,
  },
  buttonContent: {
    paddingHorizontal: space.lg,
    paddingVertical: space.lg,
    minHeight: 60,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: space.md,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  chip: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: c.paleGold,
  },
  backdrop: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(9,47,70,0.7)",
  },
  dialog: {
    width: "100%",
    maxWidth: 430,
    padding: 22,
    borderRadius: 28,
    gap: 8,
  },
});
