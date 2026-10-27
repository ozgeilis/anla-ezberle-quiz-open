import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleProp, View, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  colors as c,
  gradients,
  shadows,
  typeScale,
  useTheme,
} from "../../theme/tokens";
import { Tap } from "./Pressable";
import { Icon, IconName, Txt } from "./primitives";
import { s } from "./styles";
export function Button({
  title,
  accessibilityLabel,
  onPress,
  icon,
  trailing,
  variant = "green",
  compact = false,
  fill = false,
  disabled,
  style,
  loading = false,
  status = "idle",
}: {
  title: string;
  accessibilityLabel?: string;
  onPress: () => unknown;
  icon?: IconName;
  trailing?: IconName;
  variant?: "orange" | "mustard" | "green" | "blue" | "outline" | "danger";
  compact?: boolean;
  fill?: boolean;
  disabled?: boolean;
  loading?: boolean;
  status?: "idle" | "success" | "error";
  style?: StyleProp<ViewStyle>;
}) {
  const theme = useTheme();
  const [pending, setPending] = useState(false);
  const locked = useRef(false),
    alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  const working = loading || pending;
  const press = () => {
    if (locked.current || disabled || working) return;
    locked.current = true;
    try {
      const result = onPress();
      if (result && typeof (result as Promise<unknown>).then === "function") {
        setPending(true);
        void Promise.resolve(result)
          .finally(() => {
            locked.current = false;
            if (alive.current) setPending(false);
          })
          .catch(() => undefined);
      } else locked.current = false;
    } catch (error) {
      locked.current = false;
      throw error;
    }
  };
  const goldAction = variant === "orange" || variant === "mustard";
  const gradient = disabled
    ? ([theme.panel, theme.goldSurface] as const)
    : variant === "mustard"
      ? gradients.mustard
      : variant === "orange"
        ? gradients.action
        : variant === "danger"
          ? (["#CC3344", "#B42332"] as const)
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
          minHeight: 42,
          paddingVertical: 8,
          paddingHorizontal: 8,
          gap: 6,
        },
      ]}
    >
      {working ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        icon &&
        (goldAction ? (
          <View
            style={{
              width: 24,
              height: 24,
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
          <Icon name={icon} color={textColor} size={20} />
        ))
      )}
      <Txt
        weight="semibold"
        size={compact ? 13 : typeScale.action}
        color={textColor}
        style={{ flexShrink: 1, textAlign: "center" }}
      >
        {title}
      </Txt>
      {trailing && <Icon name={trailing} color={textColor} size={20} />}
    </View>
  );
  return (
    <Tap
      label={accessibilityLabel ?? title}
      fill={fill}
      onPress={press}
      disabled={disabled || working}
      style={[
        s.button,
        {
          borderColor:
            status === "error"
              ? theme.danger
              : status === "success"
                ? theme.success
                : variant === "outline"
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

export function TextAction({
  title,
  color,
  onPress,
  disabled = false,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  color?: string;
}) {
  const theme = useTheme();
  return (
    <Tap
      label={title}
      onPress={onPress}
      disabled={disabled}
      style={{
        minHeight: 48,
        paddingHorizontal: 8,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Txt size={13} weight="semibold" color={color ?? theme.accent}>
        {title}
      </Txt>
    </Tap>
  );
}
