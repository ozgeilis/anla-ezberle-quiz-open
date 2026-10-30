import React, { useRef, useState } from "react";
import { Switch, View } from "react-native";
import { useRouter } from "expo-router";
import { Button, Card, Txt } from "../../components/ui";
import { useTheme } from "../../theme/tokens";
import { useGame } from "../../storage/GameProvider";
import { useAchievements } from "./AchievementProvider";
import { showcaseBadges } from "./presentation";
import { BadgeArt } from "./BadgeArt";
export function ProfileAchievements({
  editable = false,
}: {
  editable?: boolean;
}) {
  const router = useRouter();
  const { data } = useGame(),
    { badges, social, saveSharing, error } = useAchievements(),
    theme = useTheme();
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  const lock = useRef(false);
  const preview = showcaseBadges(badges, data.showcase ?? []);
  const earned = badges.filter((b) => b.earned);
  const save = async (shared: boolean, ids: string[]) => {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    try {
      await saveSharing(shared, ids);
      setMessage("Çevrimiçi rozet gizliliğin kaydedildi.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Ayar kaydedilemedi.");
    } finally {
      lock.current = false;
      setBusy(false);
    }
  };
  return (
    <Card
      style={{ gap: 12, marginBottom: 0, backgroundColor: theme.mintSurface }}
    >
      <Txt size={18} weight="bold">
        Rozet Vitrini · {earned.length} / {badges.length}
      </Txt>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        {preview.map((b) => (
          <View
            key={b.id}
            style={{ flex: 1, minWidth: 80, alignItems: "center", gap: 5 }}
          >
            <BadgeArt badge={b} earned size={65} />
            <Txt size={11} style={{ textAlign: "center" }}>
              {b.title}
            </Txt>
          </View>
        ))}
      </View>
      {!preview.length && (
        <Txt color={theme.muted}>
          Albümünden kazandığın en fazla üç rozeti vitrinine seç.
        </Txt>
      )}
      <Button
        title="Rozet albümünü aç"
        variant="outline"
        onPress={() => router.push("/achievements")}
      />
      {social && editable && (
        <>
          <Txt weight="bold">Arkadaşlarına açık çevrimiçi koleksiyon</Txt>
          <Txt size={12} color={theme.muted}>
            Yerel oyun kayıtların cihazında kalır. Paylaşımı açarsan sunucunun
            doğruladığı {social.earned.length} sosyal rozet ve çevrimiçi seviyen
            görünür. Vitrindeki yerel rozetler buraya yüklenmez.
          </Txt>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Txt style={{ flex: 1 }}>Çevrimiçi rozetlerimi paylaş</Txt>
            <Switch
              accessibilityLabel="Çevrimiçi rozetlerimi paylaş"
              disabled={busy}
              value={social.shared}
              onValueChange={(v) => void save(v, social.showcase)}
            />
          </View>
          <Txt size={12}>
            Herkese açık vitrin için en fazla üç sosyal rozet seç:
          </Txt>
          {badges
            .filter((b) => b.group === "social" && b.earned)
            .map((b) => (
              <Button
                key={b.id}
                title={`${social.showcase.includes(b.id) ? "✓ " : ""}${b.title}`}
                variant="outline"
                disabled={busy}
                onPress={() => {
                  const next = social.showcase.includes(b.id)
                    ? social.showcase.filter((id) => id !== b.id)
                    : [...social.showcase, b.id];
                  if (next.length > 3) {
                    setMessage("En fazla üç sosyal rozet seçebilirsin.");
                    return;
                  }
                  void save(social.shared, next);
                }}
              />
            ))}
        </>
      )}
      {!!error && <Txt accessibilityRole="alert">{error}</Txt>}
      {!!message && <Txt accessibilityLiveRegion="polite">{message}</Txt>}
    </Card>
  );
}
