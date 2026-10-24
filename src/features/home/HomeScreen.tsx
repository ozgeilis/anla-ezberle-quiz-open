import { useAchievements } from "../achievements/AchievementProvider";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, useWindowDimensions, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { HomeTitlePlaque } from "../../components/game/HomeTitlePlaque";
import { Cup, Pattern } from "../../components/game/Artwork";
import { DifficultyTile, HomeSummaryCard } from "../../components/ui/visuals";
import { TopicArtwork } from "../../components/game/TopicArtwork";
import { categoryOptions } from "../categories/learning-options";
import {
  PlayerHeader,
  ReferenceHero,
} from "../../components/game/ReferenceHero";
import {
  Button,
  Card,
  Chip,
  Dialog,
  Icon,
  s,
  Tap,
  Txt,
} from "../../components/ui";
import {
  availableQuestions,
  CONTENT_CHANNEL,
  difficultyName,
} from "../../content/questions";
import { dateKey, stats } from "../../domain/game/engine";
import { useGameLibrary } from "../../storage/GameProvider";
import { colors as c, shadows, space, useTheme } from "../../theme/tokens";

export function HomeScreen() {
  const { data, start } = useGameLibrary();
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const compact = width < 360;
  const { badges } = useAchievements();
  const [help, setHelp] = useState(false);
  const [today, setToday] = useState(() => dateKey());
  useEffect(() => {
    const tick = setInterval(() => setToday(dateKey()), 30_000);
    return () => clearInterval(tick);
  }, []);
  const daily = data.games.find((g) => g.dailyKey === today);
  const last = data.games.at(-1);
  const play = () => {
    router.push("/categories");
  };
  return (
    <>
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.background }}
        contentContainerStyle={{
          paddingBottom: space.xxl,
          paddingHorizontal: 0,
          width: "100%",
          maxWidth: 760,
          alignSelf: "center",
        }}
      >
        <View
          pointerEvents="none"
          style={{ position: "absolute", inset: 0, height: 260 }}
        >
          <Pattern color={theme.pattern} opacity={0.05} />
        </View>
        <ReferenceHero>
          <PlayerHeader notifications />
          <HomeTitlePlaque />
          <Button
            title="Oyuna Başla"
            icon="play"
            trailing="chevron-right"
            variant="orange"
            onPress={play}
            style={{ minHeight: 70, borderRadius: 36 }}
          />
        </ReferenceHero>
        <View
          style={{
            gap: 16,
            marginTop: 6,
            paddingHorizontal: compact ? 14 : 20,
          }}
        >
          <Tap
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
            <Card
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                padding: 12,
                backgroundColor: theme.card,
                borderColor: theme.goldBorder,
              }}
            >
              <View
                style={{
                  backgroundColor: c.coral,
                  borderRadius: 17,
                  padding: 5,
                }}
              >
                <Cup size={38} />
              </View>
              <View style={{ flex: 1, gap: 3 }}>
                <Txt size={16} weight="heavy">
                  Günün Yarışması
                </Txt>
                <Txt size={11} color={theme.muted}>
                  {daily
                    ? `${stats(daily).score} puan · Bugün tamamlandı`
                    : "Yeni bir gün, yeni bir bilgi turu."}
                </Txt>
                <Txt size={10} color={theme.muted}>
                  {new Date(`${today}T12:00:00+03:00`).toLocaleDateString(
                    "tr-TR",
                    { day: "numeric", month: "long" },
                  )}{" "}
                  · 10 soru · Çevrimdışı
                </Txt>
              </View>
              <Icon name="chevron-right" color={theme.accent} />
            </Card>
          </Tap>
          <Tap
            label="Kategorileri Keşfet: Bütün öğrenme konuları ve özel zamanlar"
            onPress={() => router.push("/categories")}
            style={[s.row, { justifyContent: "space-between" }]}
          >
            <Txt size={21} weight="heavy" accessibilityRole="header">
              Kategorileri Keşfet
            </Txt>
            <Icon name="chevron-right" size={20} color={theme.accent} />
          </Tap>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {categoryOptions(availableQuestions).map((category, index) => (
              <View key={category.id} style={{ width: "48%", flexGrow: 1 }}>
                <Tap
                  sound="select"
                  label={`${category.title}, ${category.count} soru, yarışmanı hazırla`}
                  onPress={() =>
                    router.push({
                      pathname: "/categories",
                      params: { playCategory: category.id },
                    })
                  }
                  style={{
                    borderRadius: 22,
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.65)",
                    boxShadow: shadows.card,
                  }}
                >
                  <LinearGradient
                    colors={
                      index % 3 === 0
                        ? ["#0CBF9C", c.teal]
                        : index % 3 === 1
                          ? ["#21AAEF", c.deepBlue]
                          : ["#FFBF35", "#B95F08"]
                    }
                    style={{
                      padding: 12,
                      minHeight: 168,
                      justifyContent: "flex-end",
                    }}
                  >
                    <View
                      pointerEvents="none"
                      style={{ position: "absolute", inset: 0 }}
                    >
                      <Pattern color={c.white} opacity={0.12} />
                    </View>
                    <View
                      pointerEvents="none"
                      style={{ position: "absolute", inset: 0, opacity: 0.26 }}
                    >
                      <Image
                        source={require("../../../assets/images/reference-ui/mosque-garden.webp")}
                        resizeMode="cover"
                        style={{ width: "100%", height: "100%" }}
                      />
                    </View>
                    <TopicArtwork id={category.artwork} size={92} />

                    <Txt
                      weight="heavy"
                      size={compact ? 14 : 16}
                      color={c.white}
                    >
                      {category.title}
                    </Txt>
                    <View
                      style={[
                        s.row,
                        {
                          justifyContent: "space-between",
                          gap: 3,
                          marginTop: 5,
                        },
                      ]}
                    >
                      <Txt weight="bold" size={11} color={c.white}>
                        {category.count} soru
                      </Txt>
                      <Icon name="chevron-right" size={20} color={c.white} />
                    </View>
                  </LinearGradient>
                </Tap>
              </View>
            ))}
          </View>
          <Button
            title="Arkadaşlarınla Oyna"
            icon="users"
            variant="blue"
            onPress={() => router.push("/live")}
          />
          <View style={{ gap: 8 }}>
            <Txt accessibilityRole="header" size={21} weight="heavy">
              Zorluk Seç
            </Txt>
            <Txt size={12} color={theme.muted}>
              Kategorini ve seviyeni seç, sana uygun 10 soruyla başla.
            </Txt>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {(["easy", "medium", "hard"] as const).map((difficulty) => (
                <View key={difficulty} style={{ flex: 1 }}>
                  <DifficultyTile
                    small
                    tone={difficulty}
                    title={difficultyName[difficulty]}
                    icon={
                      difficulty === "easy"
                        ? "sun"
                        : difficulty === "medium"
                          ? "trending-up"
                          : "zap"
                    }
                    onPress={() =>
                      router.push({
                        pathname: "/categories",
                        params: { difficulty },
                      })
                    }
                  />
                </View>
              ))}
            </View>
          </View>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Tap
                label="Son skor ve kişisel geçmiş"
                onPress={() =>
                  router.push({
                    pathname: "/ranking",
                    params: { section: "personal" },
                  })
                }
              >
                <HomeSummaryCard
                  tone="score"
                  label="Son skor"
                  value={last ? stats(last).score : "—"}
                />
              </Tap>
            </View>
            <View style={{ flex: 1 }}>
              <Tap
                label="Kazanılan rozetler"
                onPress={() => router.push("/achievements")}
              >
                <HomeSummaryCard
                  tone="badges"
                  label="Rozetler"
                  value={`${badges.filter((b) => b.earned).length} / ${badges.length}`}
                />
              </Tap>
            </View>
          </View>
          <View
            style={[
              s.row,
              { justifyContent: "space-between", flexWrap: "wrap" },
            ]}
          >
            <Chip icon="edit-3">
              {availableQuestions.length}{" "}
              {CONTENT_CHANNEL === "prototype"
                ? "soru · Prototip"
                : "onaylı soru"}
            </Chip>
            <Tap
              label="Oyunun kuralları ve soru kaynakları hakkında bilgi"
              onPress={() => setHelp(true)}
              style={{ minHeight: 44, justifyContent: "center" }}
            >
              <Txt size={11} weight="bold" color={theme.muted}>
                Nasıl oynanır?
              </Txt>
            </Tap>
          </View>
        </View>
      </ScrollView>
      <Dialog
        visible={help}
        title="Bilgiyle ilerle!"
        onClose={() => setHelp(false)}
      >
        <Txt>
          Her yarışmada 10 farklı soru var. Doğru yanıt 100, yanlış yanıt 0
          puan. Her soru için 10 saniye var; süre dolarsa cevapsız ve 0 puan
          sayılır. Açıklama sırasında sayaç durur. Süre bonusu yok.
        </Txt>
        <Txt>
          Yeni soru setindeki her doğru cevap 10 yerel XP kazandırır. Her 250
          XP’de bir seviye (en fazla 100) ilerlersin. Yalnızca biten turlar
          kaydedilir.
        </Txt>
        <Txt>
          {availableQuestions.length} soru ürün sahibinin kararıyla kullanım
          için onaylandı; kaynak bağlantıları bulunur. Bağımsız dinî uzman
          incelemesi yapıldığı iddia edilmez.
        </Txt>
        <Button title="Anladım" onPress={() => setHelp(false)} />
      </Dialog>
    </>
  );
}
