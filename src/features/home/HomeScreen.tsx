import React, { useEffect, useState } from "react";
import { ScrollView, View, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { HomeTitlePlaque } from "../../components/game/HomeTitlePlaque";
import {
  PlayerHeader,
  ReferenceHero,
} from "../../components/game/ReferenceHero";
import { Button, Dialog, TextAction, Txt } from "../../components/ui";
import { useAchievements } from "../achievements/AchievementProvider";
import { dateKey, stats } from "../../domain/game/engine";
import { useGameLibrary } from "../../storage/GameProvider";
import { useTheme } from "../../theme/tokens";
import { HomeActionCard, HomePlayButton } from "./HomeActionCard";
import { AdBanner } from "../ads/AdBanner";

export function HomeScreen() {
  const router = useRouter();
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
          <HomePlayButton onPress={() => router.push("/categories")} />
        </ReferenceHero>
        <View style={{ paddingHorizontal: 16, gap: 20 }}>
          <View
            style={{
              flexDirection: fontScale > 1.3 ? "column" : "row",
              gap: 12,
            }}
          >
            <HomeActionCard
              id="daily"
              title="Günün Yarışması"
              icon="calendar"
              tone="gold"
              description={
                daily
                  ? `${stats(daily).score} puan · Tamamlandı`
                  : "Bugünün yarışmasına katıl"
              }
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
            />
            <HomeActionCard
              id="social"
              title="Arkadaşlarınla Oyna"
              icon="users"
              tone="blue"
              description="Oda kur veya katıl"
              label="Arkadaşlarınla Oyna"
              onPress={() => router.push("/live")}
            />
          </View>
          <View style={{ gap: 8 }}>
            <Txt size={18} weight="bold" accessibilityRole="header">
              İlerleme Özeti
            </Txt>
            <View
              style={{
                flexDirection: fontScale > 1.3 ? "column" : "row",
                gap: 12,
              }}
            >
              <HomeActionCard
                id="score"
                title="Son Skor"
                icon="target"
                tone="green"
                value={last ? String(stats(last).score) : "—"}
                label="Son skor ve kişisel geçmiş"
                onPress={() =>
                  router.push({
                    pathname: "/ranking",
                    params: { section: "personal" },
                  })
                }
              />
              <HomeActionCard
                id="badges"
                title="Rozetler"
                icon="award"
                tone="purple"
                value={`${badges.filter((b) => b.earned).length} / ${badges.length}`}
                label="Kazanılan rozetler"
                onPress={() => router.push("/achievements")}
              />
            </View>
          </View>
          <TextAction title="Nasıl oynanır?" onPress={() => setHelp(true)} />
          {!help && <AdBanner />}
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
          Yanıtlarını sonuç ekranından açıklamalarıyla inceleyebilirsin.
        </Txt>
        <Button title="Anladım" onPress={() => setHelp(false)} />
      </Dialog>
    </>
  );
}
