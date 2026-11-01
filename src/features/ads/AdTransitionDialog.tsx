import React from "react";
import { Button, Dialog, Txt } from "../../components/ui";
export function AdTransitionDialog({
  visible,
  busy,
  onWatch,
  onSkip,
  onCancel,
}: {
  visible: boolean;
  busy: boolean;
  onWatch(): void;
  onSkip(): void;
  onCancel(): void;
}) {
  return (
    <Dialog visible={visible} title="Devam etmeden önce" onClose={onCancel}>
      <Txt>
        Kısa bir test reklamı izleyebilir veya reklamı atlayarak devam
        edebilirsin. Skorun ve XP’n değişmez.
      </Txt>
      <Button
        title="Test reklamını izle ve devam et"
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
