import React from "react";
import { Platform, Switch, View } from "react-native";
import { Button, Card, Icon, Tap, Txt } from "../../components/ui";
import { colors as c, useTheme } from "../../theme/tokens";
import { useSound } from "./SoundProvider";
export function SoundSettings() {
  const {
      preferences: p,
      ready,
      saving,
      error,
      save,
      retry,
      play,
      activate,
    } = useSound(),
    t = useTheme();
  const disabled = !ready || saving;
  const toggle = (
    title: string,
    enabled: boolean,
    change: (v: boolean) => void,
    icon: "volume-2" | "music",
  ) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 8,
      }}
    >
      <View
        style={{
          backgroundColor: t.mintSurface,
          padding: 12,
          borderRadius: 16,
        }}
      >
        <Icon name={icon} color={t.accent} size={23} />
      </View>
      <Txt weight="bold" style={{ flex: 1 }}>
        {title}
      </Txt>
      <Switch
        accessibilityLabel={title}
        value={enabled}
        disabled={disabled}
        onValueChange={(v) => {
          activate();
          change(v);
        }}
        trackColor={{ false: t.border, true: c.emerald }}
        thumbColor={c.white}
      />
    </View>
  );
  const volume = (
    title: string,
    value: number,
    key: "effectsVolume" | "musicVolume",
  ) => {
    const adjust = (by: number) => {
      activate();
      void save({
        [key]: Math.max(0, Math.min(1, Math.round((value + by) * 10) / 10)),
      });
    };
    return (
      <View style={{ gap: 9, paddingVertical: 8 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <Txt size={13} weight="bold" style={{ flex: 1 }}>
            {title}
          </Txt>
          <Txt size={14} weight="heavy" color={t.accent}>
            %{Math.round(value * 100)}
          </Txt>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Tap
            label={`${title} azalt`}
            onPress={() => adjust(-0.1)}
            disabled={disabled || value <= 0}
            style={{
              width: 44,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 14,
              backgroundColor: t.mintSurface,
            }}
          >
            <Icon name="minus" color={t.accent} />
          </Tap>
          <View
            accessibilityRole="adjustable"
            accessibilityLabel={title}
            accessibilityValue={{
              min: 0,
              max: 100,
              now: Math.round(value * 100),
            }}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(value * 100)}
            aria-valuetext={`%${Math.round(value * 100)}`}
            accessibilityActions={[
              { name: "increment" },
              { name: "decrement" },
            ]}
            onAccessibilityAction={(e) => {
              if (!disabled)
                adjust(e.nativeEvent.actionName === "increment" ? 0.1 : -0.1);
            }}
            style={{
              flex: 1,
              height: 12,
              borderRadius: 8,
              overflow: "hidden",
              backgroundColor: t.border,
            }}
          >
            <View
              style={{
                width: `${value * 100}%`,
                height: "100%",
                borderRadius: 8,
                backgroundColor: key === "effectsVolume" ? c.emerald : c.gold,
              }}
            />
          </View>
          <Tap
            label={`${title} artır`}
            onPress={() => adjust(0.1)}
            disabled={disabled || value >= 1}
            style={{
              width: 44,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 14,
              backgroundColor: t.mintSurface,
            }}
          >
            <Icon name="plus" color={t.accent} />
          </Tap>
        </View>
      </View>
    );
  };
  return (
    <Card style={{ gap: 10 }}>
      <Txt accessibilityRole="header" size={21} weight="heavy">
        Ses ve Müzik
      </Txt>
      <Txt size={13} color={t.muted}>
        Küçük sesler, keyifli keşifler. Tercihlerin yalnız bu cihazda saklanır.
      </Txt>
      {toggle(
        "Ses Efektleri",
        p.effectsEnabled,
        (v) => {
          void save({ effectsEnabled: v });
        },
        "volume-2",
      )}
      {volume("Efekt Ses Seviyesi", p.effectsVolume, "effectsVolume")}
      {toggle(
        "Arka Plan Müziği",
        p.musicEnabled,
        (v) => {
          void save({ musicEnabled: v });
        },
        "music",
      )}
      {volume("Müzik Ses Seviyesi", p.musicVolume, "musicVolume")}
      <Button
        title="Efekti dene"
        variant="outline"
        icon="volume-2"
        compact
        disabled={disabled || !p.effectsEnabled || p.effectsVolume === 0}
        onPress={() => {
          activate();
          play("correct");
        }}
      />
      {saving && (
        <Txt size={12} color={t.muted} accessibilityLiveRegion="polite">
          Ses tercihin kaydediliyor…
        </Txt>
      )}
      {!!error && (
        <Txt
          size={13}
          color={t.dark ? c.softCoral : c.danger}
          accessibilityRole="alert"
        >
          {error}
        </Txt>
      )}
      {!ready && (
        <Button
          title="Ses ayarlarını yeniden oku"
          compact
          variant="outline"
          onPress={() => void retry()}
        />
      )}
      <Txt size={12} color={t.muted}>
        Müzik başlangıçta kapalıdır; soru ekranlarında ve uygulama arka
        plandayken durur.{" "}
        {Platform.OS === "web"
          ? "Web’de ses, tarayıcının izin verdiği kullanıcı etkileşiminden sonra başlar; cihazın sessiz modundaki davranış tarayıcıya bağlıdır."
          : "Telefonun sessiz modu aşılmaz."}
      </Txt>
    </Card>
  );
}
