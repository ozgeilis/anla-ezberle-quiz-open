import React, { useEffect } from "react";
import { View } from "react-native";
import { usePathname } from "expo-router";
import { useGame } from "../../storage/GameProvider";
import { colors as c } from "../../theme/tokens";
import { Txt } from "./primitives";
import { Tap } from "./Pressable";
export { Icon, Txt, useReducedMotion } from "./primitives";
export type { IconName } from "./primitives";
export { Tap } from "./Pressable";
export { Button, IconButton, TextAction } from "./Button";
export { Chip, Card, Page } from "./Layout";
export { Dialog } from "./Dialog";
export { s } from "./styles";
export function StorageNotice() {
  const { storageError, startError, clearStartError, retryRead, saving } =
    useGame();
  const path = usePathname();
  // A start notice belongs to the screen that produced it; leaving clears it.
  useEffect(() => clearStartError(), [path, clearStartError]);
  if (!storageError && !startError) return null;
  return (
    <View
      accessibilityRole="alert"
      pointerEvents={storageError ? "auto" : "none"}
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
