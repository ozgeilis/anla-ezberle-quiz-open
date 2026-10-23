import React, { useEffect } from "react";
import {
  AccessibilityInfo,
  Keyboard,
  Modal,
  ScrollView,
  View,
} from "react-native";
import { Button, Icon, Txt, useReducedMotion } from ".";
import { colors as c, shadows, useTheme } from "../../theme/tokens";
export interface Feedback {
  tone: "success" | "error" | "information" | "warning";
  title: string;
  message: string;
  actionLabel?: string;
}
/** One persistent result per explicit operation; never dismisses itself. */
export function FeedbackDialog({
  feedback,
  onClose,
  onAction,
}: {
  feedback: Feedback | null;
  onClose: () => void;
  onAction?: () => void;
}) {
  const theme = useTheme(),
    reduced = useReducedMotion();
  useEffect(() => {
    if (!feedback) return;
    Keyboard.dismiss();
    AccessibilityInfo.announceForAccessibility(
      `${feedback.title}. ${feedback.message}`,
    );
  }, [feedback]);
  const tone = feedback?.tone ?? "information";
  const ink =
    tone === "error"
      ? theme.danger
      : tone === "success"
        ? theme.success
        : tone === "warning"
          ? theme.goldInk
          : theme.accent;
  return (
    <Modal
      visible={!!feedback}
      transparent
      animationType={reduced ? "none" : "fade"}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 16,
          backgroundColor: "rgba(0,30,36,.70)",
        }}
      >
        <View
          role="dialog"
          accessibilityLabel={feedback?.title}
          accessibilityViewIsModal
          style={{
            width: "100%",
            maxWidth: 440,
            maxHeight: "85%",
            backgroundColor: theme.card,
            borderRadius: 28,
            borderWidth: 1,
            borderColor: tone === "error" ? theme.danger : theme.goldBorder,
            boxShadow: shadows.button,
            overflow: "hidden",
          }}
        >
          <ScrollView
            contentContainerStyle={{
              padding: 24,
              gap: 16,
              alignItems: "center",
            }}
            keyboardShouldPersistTaps="handled"
          >
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 24,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor:
                  tone === "error"
                    ? theme.roseSurface
                    : tone === "success"
                      ? theme.mintSurface
                      : theme.goldSurface,
                borderWidth: 1,
                borderColor: ink,
              }}
            >
              <Icon
                name={
                  tone === "success"
                    ? "check-circle"
                    : tone === "error"
                      ? "alert-circle"
                      : tone === "warning"
                        ? "alert-triangle"
                        : "info"
                }
                size={36}
                color={ink}
              />
            </View>
            <Txt
              accessibilityRole="header"
              size={23}
              weight="heavy"
              style={{ textAlign: "center" }}
            >
              {feedback?.title}
            </Txt>
            <Txt
              accessibilityLiveRegion={
                tone === "error" ? "assertive" : "polite"
              }
              size={15}
              style={{ textAlign: "center" }}
            >
              {feedback?.message}
            </Txt>
            <View style={{ width: "100%", gap: 8 }}>
              {feedback?.actionLabel && onAction && (
                <Button
                  title={feedback.actionLabel}
                  icon="arrow-right"
                  onPress={onAction}
                />
              )}
              <Button
                title="Tamam"
                variant={tone === "error" ? "outline" : "mustard"}
                onPress={onClose}
              />
            </View>
            <View
              pointerEvents="none"
              style={{
                width: 40,
                height: 3,
                borderRadius: 2,
                backgroundColor: c.gold,
              }}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
