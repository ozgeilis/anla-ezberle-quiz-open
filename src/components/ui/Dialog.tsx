import React from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../theme/tokens";
import { IconButton } from "./Button";
import { Txt, useReducedMotion } from "./primitives";
import { s } from "./styles";
export function Dialog({
  visible,
  title,
  children,
  onClose,
  scrollable = true,
}: React.PropsWithChildren<{
  visible: boolean;
  title: string;
  onClose: () => void;
  scrollable?: boolean;
}>) {
  const theme = useTheme();
  const reduced = useReducedMotion();
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  return (
    <Modal
      visible={visible}
      transparent
      animationType={reduced ? "none" : "fade"}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={[
          s.backdrop,
          {
            paddingTop: Math.max(16, insets.top),
            paddingBottom: Math.max(16, insets.bottom),
          },
        ]}
        enabled={scrollable}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View
          accessibilityViewIsModal
          role="dialog"
          accessibilityLabel={title}
          style={[
            s.dialog,
            {
              backgroundColor: theme.card,
              maxHeight: height - insets.top - insets.bottom - 32,
            },
          ]}
        >
          <View
            style={[
              s.row,
              { justifyContent: "space-between", marginBottom: 8 },
            ]}
          >
            <Txt
              accessibilityRole="header"
              size={18}
              weight="bold"
              style={{ flex: 1 }}
            >
              {title}
            </Txt>
            <IconButton name="x" label="Pencereyi kapat" onPress={onClose} />
          </View>
          {scrollable ? (
            <ScrollView
              keyboardShouldPersistTaps="handled"
              style={{ flexShrink: 1 }}
              contentContainerStyle={{ gap: 12, paddingBottom: 4 }}
            >
              {children}
            </ScrollView>
          ) : (
            children
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
