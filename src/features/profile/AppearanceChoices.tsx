import React from "react";
import { Switch, View, useColorScheme } from "react-native";
import { Icon, Tap, Txt, s } from "../../components/ui";
import type { Profile } from "../../storage/schema";
import { colors as c, shadows, useTheme } from "../../theme/tokens";
import { ThemePreview } from "./ThemePreview";

export function AppearanceChoices({
  selectedTheme,
  reduceMotion,
  wide,
  busy,
  presentation,
  onSelectTheme,
  onReduceMotionChange,
}: {
  selectedTheme: Profile["theme"];
  reduceMotion: boolean;
  wide: boolean;
  busy: boolean;
  presentation: "modal" | "screen";
  onSelectTheme: (theme: Profile["theme"]) => void;
  onReduceMotionChange: (reduceMotion: boolean) => void;
}) {
  const theme = useTheme();
  const system = useColorScheme();
  return (
    <>
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel="Tema ön izlemesi"
        style={{ gap: 14 }}
      >
        {presentation === "screen" ? (
          (["light", "dark", "system"] as const).map((value) => {
            const selected = selectedTheme === value;
            const label =
              value === "light"
                ? "Açık Tema ön izlemesi"
                : value === "dark"
                  ? "Koyu Tema ön izlemesi"
                  : "Sistem temasını izle";
            return (
              <Tap
                key={value}
                role="radio"
                label={label}
                selected={selected}
                disabled={busy}
                onPress={() => onSelectTheme(value)}
                style={{
                  minHeight: 112,
                  padding: 10,
                  borderRadius: 16,
                  borderWidth: selected ? 2 : 1,
                  borderColor: selected ? theme.accent : theme.border,
                  backgroundColor: selected ? theme.mintSurface : theme.card,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <ThemePreview
                  dark={
                    value === "dark" ||
                    (value === "system" && system === "dark")
                  }
                  compact
                />
                <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
                  <Txt weight="bold" size={15}>
                    {value === "light"
                      ? "Açık"
                      : value === "dark"
                        ? "Koyu"
                        : "Sistem"}
                  </Txt>
                  <Txt size={12} color={theme.muted}>
                    {value === "system"
                      ? "Telefonun tema ayarını takip et"
                      : value === "light"
                        ? "Ferah krem ve zümrüt tonları"
                        : "Derin teal ve sıcak altın detaylar"}
                  </Txt>
                </View>
                <Icon
                  size={18}
                  name={selected ? "check-circle" : "circle"}
                  color={selected ? theme.accent : theme.muted}
                />
              </Tap>
            );
          })
        ) : (
          <>
            <View
              style={{
                flexDirection: wide ? "row" : "column",
                gap: 14,
              }}
            >
              {(["light", "dark"] as const).map((value) => {
                const selected = selectedTheme === value;
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
                    onPress={() => onSelectTheme(value)}
                    style={{
                      padding: 10,
                      gap: 10,
                      borderRadius: 24,
                      borderWidth: 2,
                      borderColor: selected ? theme.goldBorder : theme.border,
                      backgroundColor: selected
                        ? theme.goldSurface
                        : theme.card,
                      boxShadow: selected ? shadows.selected : shadows.card,
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
              selected={selectedTheme === "system"}
              disabled={busy}
              onPress={() => onSelectTheme("system")}
              style={{
                borderRadius: 16,
                borderWidth: 1,
                borderColor:
                  selectedTheme === "system" ? theme.goldBorder : theme.border,
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
                  name={selectedTheme === "system" ? "check-circle" : "circle"}
                  color={theme.goldInk}
                  size={21}
                />
              </View>
              <Txt size={12} color={theme.muted}>
                Cihazına göre {system === "dark" ? "koyu" : "açık"} görünüm.
                Kaydet ile uygulanır.
              </Txt>
            </Tap>
          </>
        )}
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
          value={reduceMotion}
          onValueChange={onReduceMotionChange}
          trackColor={{ true: c.emerald, false: theme.border }}
        />
      </View>
    </>
  );
}
