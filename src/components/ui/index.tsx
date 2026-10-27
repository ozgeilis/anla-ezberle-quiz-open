import React from "react";
import { View } from "react-native";
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
