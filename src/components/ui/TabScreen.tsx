import React from "react";
import { View } from "react-native";
import { useIsFocused } from "expo-router";

/** Retain tab state without exposing inactive controls to focus or screen readers. */
export function TabScreen({ children }: React.PropsWithChildren) {
  const focused = useIsFocused();
  return (
    <View
      style={{ flex: 1, display: focused ? "flex" : "none" }}
      aria-hidden={!focused}
      accessibilityElementsHidden={!focused}
      importantForAccessibility={focused ? "auto" : "no-hide-descendants"}
    >
      {children}
    </View>
  );
}
