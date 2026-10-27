import { useSound } from "../audio/SoundProvider";
import { stageDefinition } from "../../domain/game/stages";
import React, { useEffect, useState } from "react";
import { Platform, Share, View } from "react-native";
import { router } from "expo-router";
import { Button, Chip, Dialog, TextAction, Txt } from "../../components/ui";
import { resultPresentation } from "../results/presentation";
import { ResultExperience } from "../results/ResultExperience";
import { formatTime, stats } from "../../domain/game/engine";
import { progress } from "../../domain/scoring/progress";
import { useGame } from "../../storage/GameProvider";
import { useTheme } from "../../theme/tokens";

export function ResultsScreen() {
  const { data, result, start, saving, saveResult } = useGame();
  const { play } = useSound();
  const theme = useTheme();
  const [shareOpen, setShareOpen] = useState(false),
    [optionsOpen, setOptionsOpen] = useState(false),
    [shareMessage, setShareMessage] = useState("");
  useEffect(() => {
    if (result)
      play(
        stats(result).correct === result.questionIds.length
          ? "perfect"
          : "completed",
        `result:${result.id}`,
      );
  }, [result, play]);
  const home = () => {
    router.dismissAll();
    router.replace("/");
  };
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
        <Button title="Ana sayfaya dön" variant="outline" onPress={home} />
      </View>
    );
  const appearance = resultPresentation(
    stats(result).correct,
    result.questionIds.length,
  );
  const summary = stats(result),
    total = result.questionIds.length;
  const savedIndex = data.games.findIndex((g) => g.id === result.id),
    saved = savedIndex >= 0;
  const previous =
    savedIndex < 0 ? data.games : data.games.slice(0, savedIndex);
  const awardedXp = Math.max(
    0,
    progress(saved ? data.games : [...data.games, result]).xp -
      progress(previous).xp,
  );
  const levelUp =
    saved && progress(data.games).level > progress(previous).level;
  const repeatedSet = awardedXp === 0 && summary.correct > 0;
  const isRecord = saved && summary.score > progress(previous).best;
  const message = `Anla & Ezberle’de ${summary.score} puan kazandım! ${summary.correct}/${total} doğru · ${formatTime(summary.seconds)}. Bilgini sına, öğren, ilerle!`;
  const replay = () => {
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
          ...(result.playCategory ? { playCategory: result.playCategory } : {}),
          ...(result.learningTopic
            ? { topic: result.learningTopic }
            : { category: result.focus ?? "mixed" }),
          ...(result.stage ? { stage: result.stage } : {}),
          ...(result.difficulty ? { difficulty: result.difficulty } : {}),
        },
      });
  };
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
      <ResultExperience
        key={result.id}
        correct={summary.correct}
        total={total}
        wrong={summary.wrong}
        unanswered={summary.unanswered}
        seconds={formatTime(summary.seconds)}
        score={summary.score}
        xp={awardedXp}
        isRecord={isRecord}
        onHome={home}
      >
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
        {repeatedSet && (
          <Txt size={11} color="#D9F3E9">
            Bu soru seti daha önce tamamlandı. Skorun saklanır; tekrar XP veya
            yeni başarı ilerlemesi vermez.
          </Txt>
        )}
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
          variant={
            appearance.tier === "steady"
              ? "mustard"
              : appearance.tier === "beginning"
                ? "orange"
                : "green"
          }
          icon="play"
          disabled={saving || !saved}
          onPress={replay}
        />
        <Button
          title="Ana Sayfaya Dön"
          icon="home"
          variant="outline"
          onPress={home}
        />
        <Txt
          accessibilityLiveRegion="polite"
          size={11}
          color="#D0E8DF"
          style={{ textAlign: "center" }}
        >
          {saving
            ? "Sonucun kaydediliyor…"
            : saved
              ? "Sonucun bu cihazda kaydedildi. ✓"
              : "Sonucun henüz kaydedilmedi."}
        </Txt>
        <TextAction
          color="#D9F3E9"
          title="Yanlış cevapları incele"
          onPress={() => router.push("/results/review")}
        />
        <TextAction
          color="#D9F3E9"
          title="Diğer işlemler"
          onPress={() => setOptionsOpen(true)}
        />
      </ResultExperience>
      <Dialog
        visible={optionsOpen}
        title="Sonuç İşlemleri"
        onClose={() => setOptionsOpen(false)}
      >
        <Button
          title="Paylaş"
          icon="share-2"
          onPress={() => {
            setOptionsOpen(false);
            setShareOpen(true);
          }}
        />
        <Button
          title="Sıralamaya Bak"
          variant="outline"
          onPress={() => {
            setOptionsOpen(false);
            router.push("/ranking");
          }}
        />
        <Button
          title="Arkadaşına Meydan Oku"
          variant="outline"
          onPress={() => {
            setOptionsOpen(false);
            router.push("/online/players");
          }}
        />
      </Dialog>
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
