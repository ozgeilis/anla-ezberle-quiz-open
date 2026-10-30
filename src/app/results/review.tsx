import React, { useState } from "react";
import { Linking, View } from "react-native";
import { useRouter } from "expo-router";
import { Button, Card, Chip, Page, Tap, Txt } from "../../components/ui";
import { gameQuestion } from "../../content/questions/registry";
import { useGame } from "../../storage/GameProvider";
import { colors as c, useTheme } from "../../theme/tokens";
export default function Review() {
  const router = useRouter();
  const { result } = useGame();
  const theme = useTheme();
  const [all, setAll] = useState(false);
  const wrong =
    result?.answers.filter(
      (a) => gameQuestion(result, a.questionId)?.correct !== a.option,
    ) ?? [];
  return (
    <Page
      title="Birlikte öğrenelim"
      subtitle={
        result
          ? `${wrong.length} yanlış veya cevapsız soru · Her yanıt yeni bir fırsat`
          : "Bu oturumda incelenecek sonuç yok."
      }
    >
      <Chip icon="edit-3">Kaynaklı açıklamalar</Chip>
      {result && (
        <Button
          title={all ? "Yanlış ve cevapsızları göster" : "Tüm cevapları göster"}
          variant="outline"
          onPress={() => setAll(!all)}
        />
      )}
      {result && wrong.length === 0 && !all && (
        <Card style={{ marginVertical: 16, gap: 10 }}>
          <Txt size={22} weight="heavy">
            Kusursuz tur! ★
          </Txt>
          <Txt>
            Bu turda yanlış cevabın yok. Yeni bir turda farklı bilgileri
            keşfedebilirsin.
          </Txt>
        </Card>
      )}
      <View style={{ gap: 16, marginVertical: 16 }}>
        {(all ? (result?.answers ?? []) : wrong).map((answer) => {
          const q = gameQuestion(result!, answer.questionId)!;
          return (
            <Card key={q.id} style={{ gap: 12 }}>
              <Txt size={18} weight="heavy">
                {q.text}
              </Txt>
              <Txt color={c.danger}>
                {answer.timedOut
                  ? "Süre doldu · Cevapsız"
                  : `Yanıtın: ${q.options[answer.option]}`}
              </Txt>
              <Txt
                color={theme.dark ? c.tealLight : c.successInk}
                weight="bold"
              >
                Doğru yanıt: {q.options[q.correct]}
              </Txt>
              <Txt>{q.explanation}</Txt>
              <Tap
                label={`Kaynağı aç, ${q.source.title}`}
                onPress={() => {
                  void Linking.openURL(q.source.url).catch(() => {});
                }}
                style={{ minHeight: 44, justifyContent: "center" }}
              >
                <Txt
                  size={12}
                  weight="bold"
                  color={theme.dark ? c.tealLight : c.teal}
                >
                  {q.source.title} ↗
                </Txt>
              </Tap>
            </Card>
          );
        })}
      </View>
      <Button
        title={result ? "Sonuca dön" : "Ana sayfaya dön"}
        variant="outline"
        icon="arrow-left"
        onPress={() => {
          if (result && router.canGoBack()) router.back();
          else router.replace(result ? "/results" : "/");
        }}
      />
    </Page>
  );
}
