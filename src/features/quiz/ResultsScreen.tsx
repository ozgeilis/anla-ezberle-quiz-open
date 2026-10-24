import { useSound } from "../audio/SoundProvider";
import { stageDefinition } from "../../domain/game/stages";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Platform,
  ScrollView,
  Share,
  useWindowDimensions,
  View,
} from "react-native";
import { router } from "expo-router";
import { CardCorners, Medal } from "../../components/game/Artwork";
import {
  Button,
  Card,
  Chip,
  Dialog,
  Icon,
  Txt,
  useReducedMotion,
} from "../../components/ui";
import { ReferenceHero } from "../../components/game/ReferenceHero";
import { Celebration } from "../../components/game/Celebration";
import { formatTime, stats } from "../../domain/game/engine";
import { progress } from "../../domain/scoring/progress";
import { tr } from "../../localization/tr";
import { useGame } from "../../storage/GameProvider";
import {
  colors as c,
  radius,
  shadows,
  space,
  typeScale,
  useTheme,
} from "../../theme/tokens";
export function ResultsScreen() {
  const { data, result, start, saving, saveResult } = useGame();
  const { play } = useSound();
  useEffect(() => {
    if (result)
      play(
        stats(result).correct === 10 ? "perfect" : "completed",
        `result:${result.id}`,
      );
  }, [result, play]);
  const theme = useTheme();
  const { width, fontScale } = useWindowDimensions();
  const compact = width < 360;
  const largeText = fontScale > 1.3;
  const reduced = useReducedMotion();
  const [scale] = useState(() => new Animated.Value(1));
  const [shareOpen, setShareOpen] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  useEffect(() => {
    if (reduced) {
      scale.setValue(1);
      return;
    }
    scale.setValue(0.9);
    const animation = Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: Platform.OS !== "web",
      bounciness: 7,
      speed: 8,
    });
    animation.start();
    return () => animation.stop();
  }, [reduced, scale]);
  if (!result)
    return (
      <View style={{ padding: 24, flex: 1, justifyContent: "center", gap: 20 }}>
        <Txt size={25} weight="heavy">
          Yeni bir sonuç için yeni bir tur!
        </Txt>
        <Txt>Önceki skorlarını kişisel geçmişinde görebilirsin.</Txt>
        <Button
          title="Kişisel geçmişim"
          onPress={() => router.replace("/ranking")}
        />
        <Button
          title="Ana sayfaya dön"
          variant="outline"
          onPress={() => router.replace("/")}
        />
      </View>
    );
  const summary = stats(result);
  const savedIndex = data.games.findIndex((g) => g.id === result.id);
  const previous =
    savedIndex < 0 ? data.games : data.games.slice(0, savedIndex);
  const saved = savedIndex >= 0;
  const awardedXp = Math.max(
    0,
    progress(saved ? data.games : [...data.games, result]).xp -
      progress(previous).xp,
  );
  const levelUp =
    saved && progress(data.games).level > progress(previous).level;
  const repeatedSet = awardedXp === 0 && summary.correct > 0;
  const isRecord = saved && summary.score > progress(previous).best;
  const message = `Anla & Ezberle’de ${summary.score} puan kazandım! ${summary.correct}/10 doğru · ${formatTime(summary.seconds)}. Bilgini sına, öğren, ilerle!`;
  const doShare = async () => {
    try {
      if (Platform.OS === "web") {
        await navigator.clipboard.writeText(message);
        setShareMessage("Skor bilgisi panoya kopyalandı.");
      } else {
        await Share.share({ message });
        setShareMessage("Paylaşım penceresi açıldı.");
      }
    } catch {
      setShareMessage(
        "Paylaşım tamamlanamadı. Aşağıdaki metni seçip kopyalayabilirsin.",
      );
    }
  };
  return (
    <>
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.background }}
        contentContainerStyle={{
          paddingBottom: space.xxl + space.lg,
          width: "100%",
          maxWidth: 760,
          alignSelf: "center",
        }}
      >
        <ReferenceHero night>
          <View style={{ alignItems: "center", paddingBottom: 20 }}>
            <Celebration enabled={summary.correct >= 5 || levelUp} />
            <Chip icon="check-circle">Yarışma tamamlandı</Chip>
            {levelUp && (
              <Chip icon="star">
                Seviye atladın! Seviye {progress(data.games).level} ·{" "}
                {progress(data.games).title}
              </Chip>
            )}
            {result.stage && (
              <Chip icon="award">
                {stageDefinition(result.stage).title} aşaması
              </Chip>
            )}
            <Animated.View
              style={{ transform: [{ scale }], marginTop: 2, marginBottom: -6 }}
            >
              <Medal size={compact ? 156 : 180} />
            </Animated.View>
            <Txt
              accessibilityRole="header"
              color={c.gold}
              size={compact ? 31 : 36}
              weight="heavy"
              style={{
                textShadowColor: c.deepOrange,
                textShadowOffset: { width: 0, height: 3 },
                textShadowRadius: 0,
              }}
            >
              Tebrikler!
            </Txt>
            <Txt
              color={c.white}
              size={15}
              weight="bold"
              style={{
                textAlign: "center",
                marginTop: 4,
                paddingHorizontal: space.md,
              }}
            >
              {summary.correct >= 8
                ? "Harika bir performans!"
                : summary.correct >= 5
                  ? "Bilgin her turda güçleniyor!"
                  : "Keşfetmeye güzel bir başlangıç!"}
            </Txt>
          </View>
        </ReferenceHero>
        <View
          style={{ paddingHorizontal: space.lg, marginTop: -38, gap: space.md }}
        >
          <Card
            style={{
              alignItems: "center",
              backgroundColor: c.cream,
              padding: space.lg,
              borderRadius: radius.lg,
              boxShadow: shadows.reward,
              borderColor: c.paleGold,
              borderWidth: 2,
            }}
          >
            <CardCorners />
            <Txt size={17} weight="heavy" color={c.navy}>
              Skorun
            </Txt>
            <Txt
              size={typeScale.score}
              adjustsFontSizeToFit
              numberOfLines={1}
              minimumFontScale={0.65}
              weight="heavy"
              color={c.navy}
              style={{
                lineHeight: 68,
                letterSpacing: -3,
                width: "100%",
                textAlign: "center",
              }}
            >
              {summary.score.toLocaleString("tr-TR")}
            </Txt>
            <Txt size={15} color={c.navy} weight="heavy">
              {summary.correct}/10 doğru · {awardedXp} XP
            </Txt>
            {repeatedSet && (
              <Txt size={12} color={c.muted}>
                Bu soru seti daha önce tamamlandı. Skorun saklanır; tekrar XP
                veya yeni başarı ilerlemesi vermez.
              </Txt>
            )}
            {isRecord && (
              <View
                style={{
                  borderRadius: 22,
                  backgroundColor: c.deepCoral,
                  paddingHorizontal: 16,
                  paddingVertical: 7,
                  marginTop: 12,
                }}
              >
                <Txt color={c.white} size={13} weight="heavy">
                  ★ Yeni kişisel rekor!
                </Txt>
              </View>
            )}
          </Card>
          <View
            style={{
              flexDirection: largeText ? "column" : "row",
              flexWrap: "wrap",
              gap: space.sm,
            }}
          >
            {[
              {
                icon: "check-circle" as const,
                color: theme.success,
                value: summary.correct.toString(),
                label: "Doğru",
              },
              {
                icon: "x-circle" as const,
                color: theme.danger,
                value: summary.wrong.toString(),
                label: "Yanlış",
              },
              ...(summary.unanswered
                ? [
                    {
                      icon: "minus-circle" as const,
                      color: theme.goldInk,
                      value: summary.unanswered.toString(),
                      label: "Cevapsız",
                    },
                  ]
                : []),
              {
                icon: "clock" as const,
                color: theme.goldInk,
                value: formatTime(summary.seconds),
                label: "Süre",
              },
            ].map((item) => (
              <Card
                key={item.label}
                style={{
                  flex: largeText ? undefined : 1,
                  padding: space.md,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: largeText ? "row" : "column",
                  gap: largeText ? space.md : 5,
                }}
              >
                <View
                  style={{
                    backgroundColor: theme.background,
                    width: 37,
                    height: 37,
                    borderRadius: radius.pill,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon name={item.icon} color={item.color} size={25} />
                </View>
                <Txt
                  size={compact ? 19 : 21}
                  weight="heavy"
                  style={{ flexShrink: 1 }}
                >
                  {item.value}
                </Txt>
                <Txt size={11} color={theme.muted}>
                  {item.label}
                </Txt>
              </Card>
            ))}
          </View>
          <Card
            style={{
              backgroundColor: c.paleGold,
              borderColor: c.creamBorder,
              flexDirection: "row",
              gap: 12,
              padding: 14,
            }}
          >
            <Icon name="sun" color={c.darkGold} size={23} />
            <Txt
              size={13}
              color={c.darkGold}
              weight="medium"
              style={{ flex: 1 }}
            >
              {tr.motivation}
            </Txt>
          </Card>
          {!saved && !saving && (
            <Button
              title="Sonucu yeniden kaydet"
              icon="save"
              variant="outline"
              onPress={() => void saveResult()}
            />
          )}
          <Button
            title="Tekrar Oyna"
            icon="rotate-cw"
            style={{ minHeight: 54, borderColor: c.tealLight }}
            disabled={saving || !saved}
            onPress={() => {
              const started = start(
                result.mode === "daily" ? "mixed" : result.mode,
                result.focus,
                result.difficulty,
                result.learningTopic,
                result.stage,
                { playCategory: result.playCategory },
              );
              if (started) router.replace("/quiz");
              else
                router.replace({
                  pathname: "/categories",
                  params: {
                    ...(result.playCategory
                      ? { playCategory: result.playCategory }
                      : {}),
                    ...(result.learningTopic
                      ? { topic: result.learningTopic }
                      : { category: result.focus ?? "mixed" }),
                    ...(result.stage ? { stage: result.stage } : {}),
                    ...(result.difficulty
                      ? { difficulty: result.difficulty }
                      : {}),
                  },
                });
            }}
          />
          <Txt
            accessibilityLiveRegion="polite"
            size={11}
            color={theme.muted}
            style={{ textAlign: "center" }}
          >
            {saving
              ? "Sonucun kaydediliyor…"
              : saved
                ? "Sonucun bu cihazda kaydedildi. ✓"
                : "Sonucun henüz kaydedilmedi."}
          </Txt>
          <View style={{ gap: 3 }}>
            <Button
              title="Arkadaşına Meydan Oku"
              icon="users"
              variant="blue"
              onPress={() => router.push("/online/players")}
            />
            <Txt
              size={11}
              weight="bold"
              color={theme.muted}
              style={{ textAlign: "center" }}
            >
              Oyuncu adıyla arkadaşını bul ve çevrimiçi düelloya davet et.
            </Txt>
          </View>
          <Button
            title="Sıralamaya Bak"
            icon="bar-chart-2"
            variant="outline"
            onPress={() => router.push("/ranking")}
          />
          <Button
            title="Yanlış cevapları incele"
            icon="book-open"
            variant="outline"
            onPress={() => router.push("/results/review")}
          />
          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Button
                title="Paylaş"
                icon="share-2"
                variant="outline"
                onPress={() => setShareOpen(true)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Button
                title="Ana Sayfa"
                icon="home"
                variant="outline"
                onPress={() => {
                  router.dismissAll();
                  router.replace("/");
                }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      <Dialog
        visible={shareOpen}
        title="Skorunu paylaş"
        onClose={() => setShareOpen(false)}
      >
        <Txt selectable>{message}</Txt>
        <Txt size={12} color={theme.muted}>
          Yalnızca bu skor, doğru sayısı ve süre paylaşılır. Profil adı ve diğer
          oyunların eklenmez.
        </Txt>
        <Button
          title={Platform.OS === "web" ? "Skoru kopyala" : "Paylaşımı aç"}
          icon="share-2"
          onPress={() => void doShare()}
        />
        {!!shareMessage && (
          <Txt accessibilityLiveRegion="polite">{shareMessage}</Txt>
        )}
      </Dialog>
    </>
  );
}
