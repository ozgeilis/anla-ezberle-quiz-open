import React, { useEffect, useState } from "react";
import { ScrollView, View, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { HomeTitlePlaque } from "../../components/game/HomeTitlePlaque";
import { Cup } from "../../components/game/Artwork";
import {
  PlayerHeader,
  ReferenceHero,
} from "../../components/game/ReferenceHero";
import {
  Button,
  Card,
  Dialog,
  Icon,
  Tap,
  TextAction,
  Txt,
} from "../../components/ui";
import { useAchievements } from "../achievements/AchievementProvider";
import { availableQuestions } from "../../content/questions";
import { dateKey, stats } from "../../domain/game/engine";
import { useGameLibrary } from "../../storage/GameProvider";
import { useTheme } from "../../theme/tokens";

export function HomeScreen() {
  const { data, start } = useGameLibrary(),
    theme = useTheme(),
    { fontScale } = useWindowDimensions();
  const { badges } = useAchievements();
  const [help, setHelp] = useState(false),
    [today, setToday] = useState(() => dateKey());
  useEffect(() => {
    const tick = setInterval(() => setToday(dateKey()), 30_000);
    return () => clearInterval(tick);
  }, []);
  const daily = data.games.find((g) => g.dailyKey === today),
    last = data.games.at(-1);
  return (
    <>
      <ScrollView
        testID="compact-home"
        style={{ flex: 1, backgroundColor: theme.background }}
        contentContainerStyle={{
          width: "100%",
          maxWidth: 760,
          alignSelf: "center",
          paddingBottom: 24,
        }}
      >
        <ReferenceHero>
          <PlayerHeader notifications />
          <HomeTitlePlaque dense />
          <Button
            title="Oyuna Başla"
            icon="play"
            trailing="chevron-right"
            variant="mustard"
            onPress={() => router.push("/categories")}
          />
        </ReferenceHero>
        <View style={{ paddingHorizontal: 16, gap: 20 }}>
          <View
            style={{
              flexDirection: fontScale > 1.5 ? "column" : "row",
              gap: 12,
            }}
          >
            <Tap
              fill
              label={
                daily
                  ? "Günün Yarışması tamamlandı, skor geçmişini gör"
                  : "Günün Yarışması, 10 soru ile başla"
              }
              onPress={() => {
                if (daily)
                  router.push({
                    pathname: "/ranking",
                    params: { section: "personal" },
                  });
                else if (start("daily")) router.push("/quiz");
              }}
            >
              <Card style={{ flex: 1, gap: 8, padding: 12 }}>
                <Cup size={28} />
                <Txt size={14} weight="semibold">
                  Günün Yarışması
                </Txt>
                <Txt size={11} color={theme.muted}>
                  {daily
                    ? `${stats(daily).score} puan · Tamamlandı`
                    : "10 soru · Günlük keşif"}
                </Txt>
              </Card>
            </Tap>
            <Tap
              fill
              label="Arkadaşlarınla Oyna"
              onPress={() => router.push("/live")}
            >
              <Card
                style={{
                  flex: 1,
                  gap: 8,
                  padding: 12,
                  backgroundColor: theme.mintSurface,
                }}
              >
                <Icon name="users" size={24} color={theme.accent} />
                <Txt size={14} weight="semibold">
                  Arkadaşlarınla Oyna
                </Txt>
                <Txt size={11} color={theme.muted}>
                  Oda kur veya katıl
                </Txt>
              </Card>
            </Tap>
          </View>
          <View style={{ gap: 8 }}>
            <Txt size={18} weight="bold" accessibilityRole="header">
              İlerleme Özeti
            </Txt>
            <View
              style={{
                flexDirection: fontScale > 1.5 ? "column" : "row",
                gap: 12,
              }}
            >
              <Tap
                fill
                label="Son skor ve kişisel geçmiş"
                onPress={() =>
                  router.push({
                    pathname: "/ranking",
                    params: { section: "personal" },
                  })
                }
              >
                <Card style={{ gap: 4, padding: 12 }}>
                  <Txt size={12} color={theme.muted}>
                    Son skor
                  </Txt>
                  <Txt size={18} weight="bold">
                    {last ? stats(last).score : "—"}
                  </Txt>
                </Card>
              </Tap>
              <Tap
                fill
                label="Kazanılan rozetler"
                onPress={() => router.push("/achievements")}
              >
                <Card style={{ gap: 4, padding: 12 }}>
                  <Txt size={12} color={theme.muted}>
                    Rozetler
                  </Txt>
                  <Txt size={18} weight="bold">
                    {badges.filter((b) => b.earned).length} / {badges.length}
                  </Txt>
                </Card>
              </Tap>
            </View>
          </View>
          <TextAction title="Nasıl oynanır?" onPress={() => setHelp(true)} />
        </View>
      </ScrollView>
      <Dialog
        visible={help}
        title="Bilgiyle ilerle!"
        onClose={() => setHelp(false)}
      >
        <Txt>
          Her turda 10 soru var. Her soru için 10 saniye; doğru yanıt 100,
          yanlış veya cevapsız yanıt 0 puan. Açıklama sırasında sayaç durur.
        </Txt>
        <Txt>
          Yeni soru setindeki her doğru cevap 10 yerel XP kazandırır. Her 250
          XP’de bir seviye ilerlersin. Yalnız biten turlar kaydedilir.
        </Txt>
        <Txt size={12} color={theme.muted}>
          {availableQuestions.length} soru kullanım için ürün sahibi tarafından
          onaylandı. Kaynaklar korunur; bağımsız uzman incelemesi tamamlandı
          iddiası değildir.
        </Txt>
        <Button title="Anladım" onPress={() => setHelp(false)} />
      </Dialog>
    </>
  );
}
