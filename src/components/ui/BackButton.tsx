import React from "react";
import { router } from "expo-router";
import { IconButton } from "./Button";
export function BackButton({ onPress }: { onPress?: () => void }) {
  const back = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  };
  return (
    <IconButton
      name="chevron-left"
      label="Geri Dön"
      onPress={onPress ?? back}
    />
  );
}
