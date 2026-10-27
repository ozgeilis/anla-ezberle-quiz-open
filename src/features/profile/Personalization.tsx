import React, { useRef, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Pattern } from "../../components/game/Artwork";
import { Button, Icon, Tap, Txt, s } from "../../components/ui";
import { useGame } from "../../storage/GameProvider";
import { colors as c, gradients, shadows, useTheme } from "../../theme/tokens";
import { AvatarChoices } from "./AvatarChoices";
import { AppearanceChoices } from "./AppearanceChoices";

export type PersonalizationKind = "avatar" | "appearance";

/** Mounted per opening: draft never enters the app-wide theme/profile provider. */
export function PersonalizationDialog({
  kind,
  onClose,
  presentation = "modal",
}: {
  kind: PersonalizationKind;
  onClose: () => void;
  presentation?: "modal" | "screen";
}) {
  const { data, updateProfile } = useGame();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const dimensions = useWindowDimensions();
  const wide = dimensions.width >= 620;
  const [draft, setDraft] = useState(data.profile);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const lock = useRef(false);
  const close = () => {
    if (!lock.current) onClose();
  };
  const save = async () => {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError("");
    try {
      const saved = await updateProfile(
        kind === "avatar"
          ? { avatar: draft.avatar }
          : { theme: draft.theme, reduceMotion: draft.reduceMotion },
      );
      if (saved) onClose();
      else
        setError(
          "Kaydedilemedi. Önceki tercihin korundu; yeniden deneyebilir veya vazgeçebilirsin.",
        );
    } catch {
      setError(
        "Kaydedilemedi. Önceki tercihin korundu; yeniden deneyebilirsin.",
      );
    } finally {
      lock.current = false;
      setBusy(false);
    }
  };
  const content = (
    <View
      style={{
        flex: 1,
        backgroundColor:
          presentation === "screen" ? theme.background : "rgba(1,24,30,0.78)",
        justifyContent: "center",
        paddingHorizontal: dimensions.width < 360 ? 10 : 18,
        paddingTop: presentation === "screen" ? 12 : Math.max(12, insets.top),
        paddingBottom:
          presentation === "screen" ? 12 : Math.max(12, insets.bottom),
      }}
    >
      {presentation === "modal" && (
        <Pressable
          accessibilityLabel="Pencereyi kapat"
          accessibilityRole="button"
          onPress={close}
          disabled={busy}
          style={{ position: "absolute", inset: 0 }}
        />
      )}
      <View
        accessibilityViewIsModal={presentation === "modal"}
        role={presentation === "modal" ? "dialog" : undefined}
        aria-modal={presentation === "modal" || undefined}
        accessibilityLabel={
          kind === "avatar" ? "Avatar seçimi" : "Görünüm ayarları"
        }
        style={{
          width: "100%",
          maxWidth: 760,
          maxHeight: "100%",
          alignSelf: "center",
          backgroundColor: theme.background,
          borderRadius: 28,
          borderWidth: 1,
          borderColor: theme.goldBorder,
          overflow: "hidden",
          boxShadow: shadows.button,
        }}
      >
        {presentation === "screen" ? (
          <View
            style={{
              padding: 14,
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
              backgroundColor: theme.mintSurface,
            }}
          >
            <Tap
              label="Geri dön"
              disabled={busy}
              onPress={close}
              style={{
                width: 44,
                minHeight: 44,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: theme.card,
                borderRadius: 14,
              }}
            >
              <Icon name="chevron-left" color={theme.accent} />
            </Tap>
            <Txt accessibilityRole="header" size={23} weight="heavy">
              Tema
            </Txt>
          </View>
        ) : (
          <LinearGradient
            colors={gradients.hero}
            style={{ padding: 18, gap: 8 }}
          >
            <View
              pointerEvents="none"
              style={{ position: "absolute", inset: 0 }}
            >
              <Pattern opacity={0.08} />
            </View>
            <View style={[s.row, { justifyContent: "space-between" }]}>
              <View style={{ flex: 1, gap: 3 }}>
                <Txt
                  size={10}
                  color={c.gold}
                  weight="heavy"
                  style={{ letterSpacing: 2 }}
                >
                  SANA ÖZEL
                </Txt>
                <Txt
                  accessibilityRole="header"
                  size={24}
                  weight="heavy"
                  color={c.white}
                >
                  {kind === "avatar" ? "Tarzını seç" : "Görünüm"}
                </Txt>
              </View>
              <Tap
                label="Geri dön"
                onPress={close}
                disabled={busy}
                style={{
                  width: 44,
                  minHeight: 44,
                  borderRadius: 22,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(255,255,255,.13)",
                }}
              >
                <Icon name="x" color={c.white} />
              </Tap>
            </View>
            <Txt size={13} color={c.tealLight}>
              {kind === "avatar"
                ? "Seni yansıtan karakterle keşfe çık."
                : "Önce keşfet. Beğendiğinde kaydet."}
            </Txt>
          </LinearGradient>
        )}
        <ScrollView
          contentContainerStyle={{ padding: 16, gap: 16 }}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={{
              padding: 12,
              borderRadius: 14,
              backgroundColor: theme.mintSurface,
              borderWidth: 1,
              borderColor: theme.border,
              flexDirection: "row",
              gap: 9,
              alignItems: "center",
            }}
          >
            <Icon name="eye" size={19} color={theme.accent} />
            <Txt size={12} color={theme.accent} style={{ flex: 1 }}>
              Bu bir ön izleme. Tercihin yalnızca Kaydet ile uygulanır.
            </Txt>
          </View>
          {kind === "avatar" ? (
            <AvatarChoices
              selectedAvatar={draft.avatar}
              wide={wide}
              busy={busy}
              onSelect={(avatar) => {
                setDraft({ ...draft, avatar });
                setError("");
              }}
            />
          ) : (
            <AppearanceChoices
              selectedTheme={draft.theme}
              reduceMotion={draft.reduceMotion}
              wide={wide}
              busy={busy}
              presentation={presentation}
              onSelectTheme={(theme) => {
                setDraft({ ...draft, theme });
                setError("");
              }}
              onReduceMotionChange={(reduceMotion) =>
                setDraft({ ...draft, reduceMotion })
              }
            />
          )}
          {!!error && (
            <Txt
              accessibilityRole="alert"
              accessibilityLiveRegion="assertive"
              color={theme.danger}
            >
              {error}
            </Txt>
          )}
        </ScrollView>
        <View
          style={{
            padding: 16,
            paddingTop: 12,
            gap: 10,
            backgroundColor: theme.panel,
            borderTopWidth: 1,
            borderColor: theme.border,
          }}
        >
          <Button
            title={busy ? "Kaydediliyor…" : "Kaydet"}
            icon="save"
            variant="mustard"
            disabled={busy}
            onPress={() => void save()}
          />
          <Button
            title="Vazgeç"
            variant="outline"
            disabled={busy}
            onPress={close}
          />
        </View>
      </View>
    </View>
  );
  return presentation === "screen" ? (
    content
  ) : (
    <Modal
      visible
      transparent
      animationType="none"
      onRequestClose={close}
      statusBarTranslucent
    >
      {content}
    </Modal>
  );
}
