import React, { useRef, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Avatar, Pattern, Scene } from "../../components/game/Artwork";
import { Button, Icon, Tap, Txt, s } from "../../components/ui";
import { avatarCatalog, avatarName } from "../../domain/profile/avatars";
import { usePlayerIdentity } from "../online/SocialIdentityProvider";
import { useGame } from "../../storage/GameProvider";
import {
  colors as c,
  fonts,
  gradients,
  shadows,
  themePalette,
  useTheme,
} from "../../theme/tokens";
import { progress } from "../../domain/scoring/progress";

export type PersonalizationKind = "avatar" | "appearance";

function ThemePreview({ dark }: { dark: boolean }) {
  const palette = themePalette(dark);
  const { data } = useGame();
  const { displayName } = usePlayerIdentity();
  const p = progress(data.games);
  const caption = { fontFamily: fonts.bold, fontSize: 10, color: palette.text };
  return (
    <View
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      aria-hidden
      style={{
        width: "100%",
        borderRadius: 18,
        padding: 12,
        gap: 9,
        backgroundColor: palette.background,
        borderWidth: 1,
        borderColor: palette.border,
        overflow: "hidden",
      }}
    >
      <View style={{ flexDirection: "row", gap: 7, alignItems: "center" }}>
        <Avatar variant={data.profile.avatar} size={29} />
        <View style={{ flex: 1 }}>
          <Text style={caption}>Merhaba!</Text>
          <Text numberOfLines={1} style={{ ...caption, color: palette.accent }}>
            {displayName}
          </Text>
        </View>
        <Icon name="star" size={16} color={palette.goldInk} />
      </View>
      <LinearGradient
        colors={gradients.hero}
        style={{
          minHeight: 124,
          borderRadius: 14,
          padding: 12,
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <View pointerEvents="none" style={{ position: "absolute", inset: 0 }}>
          <Scene />
        </View>
        <Text style={{ fontFamily: fonts.heavy, fontSize: 15, color: c.white }}>
          Anla &
        </Text>
        <Text style={{ fontFamily: fonts.heavy, fontSize: 24, color: c.gold }}>
          Ezberle
        </Text>
        <Text
          style={{ ...caption, color: c.white, fontSize: 9, marginBottom: 9 }}
        >
          Bilgini sına, öğren, ilerle!
        </Text>
        <LinearGradient
          colors={gradients.mustard}
          style={{
            borderRadius: 10,
            minHeight: 29,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            gap: 5,
          }}
        >
          <Icon name="play-circle" size={14} color={c.navy} />
          <Text style={{ ...caption, color: c.navy }}>Oyuna Başla</Text>
        </LinearGradient>
      </LinearGradient>
      <View style={{ flexDirection: "row", gap: 7 }}>
        <View
          style={{
            flex: 1,
            padding: 8,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: palette.goldBorder,
            backgroundColor: palette.goldSurface,
          }}
        >
          <Text style={{ ...caption, color: palette.goldInk }}>
            Seviye {p.level}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            padding: 8,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: palette.border,
            backgroundColor: palette.card,
          }}
        >
          <Text style={caption}>{p.xp} XP</Text>
        </View>
      </View>
      <View
        style={{
          height: 3,
          width: "36%",
          alignSelf: "center",
          borderRadius: 3,
          backgroundColor: palette.accent,
          opacity: 0.8,
        }}
      />
    </View>
  );
}

/** Mounted per opening: draft never enters the app-wide theme/profile provider. */
export function PersonalizationDialog({
  kind,
  onClose,
}: {
  kind: PersonalizationKind;
  onClose: () => void;
}) {
  const { data, updateProfile } = useGame();
  const theme = useTheme();
  const system = useColorScheme();
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
  return (
    <Modal
      visible
      transparent
      animationType="none"
      onRequestClose={close}
      statusBarTranslucent
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(1,24,30,0.78)",
          justifyContent: "center",
          paddingHorizontal: dimensions.width < 360 ? 10 : 18,
          paddingTop: Math.max(12, insets.top),
          paddingBottom: Math.max(12, insets.bottom),
        }}
      >
        <Pressable
          accessibilityLabel="Pencereyi kapat"
          accessibilityRole="button"
          onPress={close}
          disabled={busy}
          style={{ position: "absolute", inset: 0 }}
        />
        <View
          accessibilityViewIsModal
          role="dialog"
          aria-modal
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
              <>
                <LinearGradient
                  colors={gradients.hero}
                  style={{
                    padding: 16,
                    borderRadius: 21,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <View
                    style={{
                      padding: 4,
                      borderRadius: 50,
                      borderWidth: 2,
                      borderColor: c.gold,
                      backgroundColor: "rgba(255,255,255,.12)",
                    }}
                  >
                    <Avatar variant={draft.avatar} size={76} />
                  </View>
                  <View style={{ flex: 1, gap: 3 }}>
                    <Txt size={10} color={c.tealLight} weight="bold">
                      SEÇTİĞİN KARAKTER
                    </Txt>
                    <Txt size={18} color={c.white} weight="heavy">
                      {avatarName(draft.avatar)}
                    </Txt>
                    <Txt size={12} color={c.gold}>
                      Seçim tamamen senin.
                    </Txt>
                  </View>
                </LinearGradient>
                <View
                  accessibilityRole="radiogroup"
                  accessibilityLabel="Avatar seçimi"
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 10,
                    justifyContent: "center",
                  }}
                >
                  {avatarCatalog.map((avatar) => {
                    const selected = draft.avatar === avatar.id;
                    return (
                      <Tap
                        key={avatar.id}
                        role="radio"
                        label={avatar.name}
                        selected={selected}
                        disabled={busy}
                        onPress={() => {
                          setDraft({ ...draft, avatar: avatar.id });
                          setError("");
                        }}
                        style={{
                          width: wide ? 102 : 78,
                          height: wide ? 102 : 78,
                          borderRadius: 20,
                          padding: 6,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: selected
                            ? theme.goldSurface
                            : theme.card,
                          borderColor: selected
                            ? theme.goldBorder
                            : theme.border,
                          borderWidth: 2,
                          boxShadow: selected ? shadows.selected : shadows.card,
                        }}
                      >
                        <Avatar variant={avatar.id} size={wide ? 74 : 62} />
                        {selected && (
                          <View
                            style={{
                              position: "absolute",
                              top: 3,
                              right: 3,
                              backgroundColor: c.gold,
                              borderRadius: 12,
                              padding: 3,
                            }}
                          >
                            <Icon name="check" size={13} color={c.navy} />
                          </View>
                        )}
                      </Tap>
                    );
                  })}
                </View>
                <Txt size={12} color={theme.muted}>
                  Çevrimiçi arkadaşların da görsün istersen, kaydettikten sonra
                  Ayarlar’daki “Avatarını çevrimiçi eşitle” ile uygula.
                </Txt>
              </>
            ) : (
              <>
                <View
                  accessibilityRole="radiogroup"
                  accessibilityLabel="Tema ön izlemesi"
                  style={{ gap: 14 }}
                >
                  <View
                    style={{ flexDirection: wide ? "row" : "column", gap: 14 }}
                  >
                    {(["light", "dark"] as const).map((value) => {
                      const selected = draft.theme === value;
                      return (
                        <Tap
                          key={value}
                          fill={wide}
                          role="radio"
                          label={
                            value === "light"
                              ? "Açık Tema ön izlemesi"
                              : "Koyu Tema ön izlemesi"
                          }
                          selected={selected}
                          disabled={busy}
                          onPress={() => {
                            setDraft({ ...draft, theme: value });
                            setError("");
                          }}
                          style={{
                            padding: 10,
                            gap: 10,
                            borderRadius: 24,
                            borderWidth: 2,
                            borderColor: selected
                              ? theme.goldBorder
                              : theme.border,
                            backgroundColor: selected
                              ? theme.goldSurface
                              : theme.card,
                            boxShadow: selected
                              ? shadows.selected
                              : shadows.card,
                          }}
                        >
                          <ThemePreview dark={value === "dark"} />
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 8,
                              padding: 3,
                            }}
                          >
                            <Icon
                              name={value === "light" ? "sun" : "moon"}
                              color={selected ? theme.goldInk : theme.accent}
                            />
                            <Txt
                              size={16}
                              weight="heavy"
                              style={{ flex: 1 }}
                              color={selected ? theme.goldInk : theme.text}
                            >
                              {value === "light" ? "Açık Tema" : "Koyu Tema"}
                            </Txt>
                            <Icon
                              name={selected ? "check-circle" : "circle"}
                              size={21}
                              color={selected ? theme.goldInk : theme.muted}
                            />
                          </View>
                        </Tap>
                      );
                    })}
                  </View>
                  <Tap
                    label="Sistem temasını izle"
                    role="radio"
                    selected={draft.theme === "system"}
                    disabled={busy}
                    onPress={() => {
                      setDraft({ ...draft, theme: "system" });
                      setError("");
                    }}
                    style={{
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor:
                        draft.theme === "system"
                          ? theme.goldBorder
                          : theme.border,
                      padding: 12,
                      gap: 5,
                      backgroundColor: theme.card,
                    }}
                  >
                    <View style={[s.row, { gap: 8 }]}>
                      <Icon name="monitor" size={19} color={theme.accent} />
                      <Txt weight="bold" style={{ flex: 1 }}>
                        Sistem temasını izle
                      </Txt>
                      <Icon
                        name={
                          draft.theme === "system" ? "check-circle" : "circle"
                        }
                        color={theme.goldInk}
                        size={21}
                      />
                    </View>
                    <Txt size={12} color={theme.muted}>
                      Cihazına göre {system === "dark" ? "koyu" : "açık"}{" "}
                      görünüm. Kaydet ile uygulanır.
                    </Txt>
                  </Tap>
                </View>
                <View
                  style={[
                    s.row,
                    { gap: 12, justifyContent: "space-between", padding: 4 },
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Txt weight="bold">Hareketi azalt</Txt>
                    <Txt size={12} color={theme.muted}>
                      Sistem tercihin her zaman gözetilir.
                    </Txt>
                  </View>
                  <Switch
                    disabled={busy}
                    accessibilityLabel="Hareketi azalt"
                    value={draft.reduceMotion}
                    onValueChange={(reduceMotion) =>
                      setDraft({ ...draft, reduceMotion })
                    }
                    trackColor={{ true: c.emerald, false: theme.border }}
                  />
                </View>
              </>
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
    </Modal>
  );
}
