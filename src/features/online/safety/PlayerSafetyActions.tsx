import React, { useEffect, useRef, useState } from "react";
import { TextInput, View } from "react-native";
import { Button, Dialog, TextAction, Txt } from "../../../components/ui";
import { useTheme } from "../../../theme/tokens";
import { onlineMessage, onlineRequest } from "../client";
import { reportReasons, reportDetailsError, type ReportReason } from "./rules";
import { useSafetyReady } from "./useSafetyReady";
export function PlayerSafetyActions({
  actor,
  player,
  onBlocked,
}: {
  actor?: string;
  player: { id: string; name: string };
  onBlocked?: () => void;
}) {
  const t = useTheme();
  const ready = useSafetyReady(actor);
  const [dialog, setDialog] = useState<"block" | "report" | null>(null);
  const [reason, setReason] = useState<ReportReason>("inappropriate_name");
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const lock = useRef(false),
    alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, [actor, player.id]);
  if (!actor || actor === player.id) return null;
  const submit = async () => {
    if (!dialog || !ready || lock.current || reportDetailsError(details))
      return;
    lock.current = true;
    setBusy(true);
    setMessage("");
    const operation = dialog === "block" ? "player_block" : "player_report";
    try {
      await onlineRequest(
        operation,
        dialog === "block"
          ? { playerId: player.id }
          : { playerId: player.id, reason, details: details.trim() },
        actor,
      );
      if (!alive.current) return;
      setDialog(null);
      setDetails("");
      setMessage(
        operation === "player_block"
          ? "Oyuncu engellendi. Arkadaşlık ve bekleyen davetler kaldırıldı."
          : "Şikâyetin alındı. Kimliğin karşı oyuncuya gösterilmez.",
      );
      if (operation === "player_block") onBlocked?.();
    } catch (error) {
      if (alive.current) setMessage(onlineMessage(error));
    } finally {
      lock.current = false;
      if (alive.current) setBusy(false);
    }
  };
  return (
    <View style={{ gap: 4, alignSelf: "stretch" }}>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <TextAction
          title="Engelle"
          disabled={busy || !ready}
          onPress={() => {
            setMessage("");
            setDialog("block");
          }}
        />
        <TextAction
          title="Şikâyet Et"
          disabled={busy || !ready}
          onPress={() => {
            setMessage("");
            setDialog("report");
          }}
        />
      </View>
      {!ready && (
        <Txt size={12} color={t.muted}>
          Oyuncu güvenliği için sunucu güncellemesi bekleniyor.
        </Txt>
      )}
      {!!message && (
        <Txt size={13} accessibilityLiveRegion="polite">
          {message}
        </Txt>
      )}
      <Dialog
        visible={dialog !== null}
        title={dialog === "block" ? "Oyuncuyu engelle" : "Oyuncuyu şikâyet et"}
        onClose={() => !busy && setDialog(null)}
        scrollable
      >
        <Txt size={14}>{player.name}</Txt>
        {dialog === "block" ? (
          <Txt size={14}>
            Bu oyuncuyla yeni arkadaşlık ve davetler engellenir. Mevcut
            arkadaşlığınız ve bekleyen davetler kaldırılır; tamamlanmış maçlar
            ve puanlar korunur. Engeli daha sonra kaldırabilirsin.
          </Txt>
        ) : (
          <>
            <Txt size={14}>
              Bir neden seç. Şikâyetin yalnız yetkili moderatörlerce incelenir.
            </Txt>
            {reportReasons.map((item) => (
              <Button
                key={item.value}
                title={item.label}
                variant={reason === item.value ? undefined : "outline"}
                compact
                disabled={busy}
                onPress={() => setReason(item.value)}
              />
            ))}
            <TextInput
              accessibilityLabel="Şikâyet açıklaması, isteğe bağlı"
              value={details}
              onChangeText={setDetails}
              maxLength={500}
              multiline
              editable={!busy}
              placeholder="Kısa açıklama (isteğe bağlı)"
              placeholderTextColor={t.muted}
              style={{
                minHeight: 80,
                padding: 12,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: t.border,
                color: t.text,
                backgroundColor: t.background,
              }}
            />
            {!!reportDetailsError(details) && (
              <Txt size={12}>{reportDetailsError(details)}</Txt>
            )}
          </>
        )}
        <Button
          title={
            busy
              ? "İşlem sürüyor…"
              : dialog === "block"
                ? "Engelle"
                : "Şikâyeti Gönder"
          }
          disabled={busy || !!reportDetailsError(details)}
          onPress={() => void submit()}
        />
        <Button
          title="Vazgeç"
          variant="outline"
          disabled={busy}
          onPress={() => setDialog(null)}
        />
        {!!message && (
          <Txt accessibilityRole="alert" size={13}>
            {message}
          </Txt>
        )}
      </Dialog>
    </View>
  );
}
