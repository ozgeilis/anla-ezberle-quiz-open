import React from "react";
import { Button, Dialog, Txt } from "../../components/ui";
import { adConfig } from "./adConfig";
export function AdTransitionDialog({
  visible,
  busy,
  onWatch,
  onSkip,
  onCancel,
  onDismiss,
}: {
  visible: boolean;
  busy: boolean;
  onWatch(): void;
  onSkip(): void;
  onCancel(): void;
  onDismiss(): void;
}) {
  return (
    <Dialog
      visible={visible}
      title="Devam etmeden önce"
      onClose={onCancel}
      onDismiss={onDismiss}
    >
      <Txt>
        Kısa bir {adConfig.mode === "live" ? "reklam" : "test reklamı"}{" "}
        izleyebilir veya reklamı atlayarak devam edebilirsin. Skorun ve XP’n
        değişmez.
      </Txt>
      <Button
        title={
          adConfig.mode === "live"
            ? "Reklamı izle ve devam et"
            : "Test reklamını izle ve devam et"
        }
        disabled={busy}
        onPress={onWatch}
      />
      <Button
        title="Reklamsız devam et"
        variant="outline"
        disabled={busy}
        onPress={onSkip}
      />
    </Dialog>
  );
}
