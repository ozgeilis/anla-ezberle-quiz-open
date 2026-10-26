import React, { useDeferredValue, useMemo, useState } from "react";
import { View, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { Button, Card, Page, TextAction, Txt } from "../../components/ui";
import { availableQuestions, difficultyName } from "../../content/questions";
import {
  categoryPool,
  playCategoryName,
} from "../../domain/game/play-categories";
import {
  learningTopicName,
  learningTopicPool,
} from "../../domain/game/learning";
import { stageDefinition } from "../../domain/game/stages";
import { useGame } from "../../storage/GameProvider";
import { useTheme } from "../../theme/tokens";
import { CategoryArtwork } from "./CategoryArtwork";
import { CategoryDifficulty } from "./CategoryDifficulty";
import { categoryOptions } from "./learning-options";
import { PreparationSelection, preparationStatus } from "./preparation";

export function PreparationScreen({
  initial,
}: {
  initial: PreparationSelection;
}) {
  const [selection, setSelection] = useState(initial),
    [attempted, setAttempted] = useState(false);
  const assessed = useDeferredValue(selection),
    assessing = assessed !== selection;
  const { start, startError, ready, session, data, storageError } = useGame(),
    t = useTheme(),
    { fontScale } = useWindowDimensions();
  const status = useMemo(
    () => preparationStatus(availableQuestions, assessed, data.games),
    [assessed, data.games],
  );
  const option = categoryOptions(availableQuestions).find(
    (c) => c.id === selection.playCategory,
  );
  const title = selection.playCategory
    ? playCategoryName(selection.playCategory)
    : selection.topic
      ? learningTopicName(selection.topic)
      : selection.category === "mixed"
        ? "Karma"
        : "Kategori seç";
  const pool = selection.playCategory
    ? categoryPool(availableQuestions, selection.playCategory)
    : selection.topic
      ? learningTopicPool(availableQuestions, selection.topic)
      : availableQuestions;
  const count = pool.filter(
    (q) => !selection.difficulty || q.difficulty === selection.difficulty,
  ).length;
  const chooseCategory = () =>
    router.push({
      pathname: "/categories",
      params: selection.difficulty ? { difficulty: selection.difficulty } : {},
    });
  const play = (allowReplay = false) => {
    if (
      assessing ||
      (!status.canStart && !allowReplay) ||
      !ready ||
      session ||
      storageError ||
      (!selection.playCategory && !selection.category && !selection.topic) ||
      (!selection.difficulty && !selection.stage)
    )
      return;
    if (
      start(
        "mixed",
        undefined,
        selection.difficulty,
        selection.topic,
        selection.stage,
        {
          playCategory: selection.playCategory,
          ...(allowReplay ? { allowReplay: true } : {}),
        },
      )
    )
      router.push("/quiz");
    else setAttempted(true);
  };
  return (
    <Page
      title="Oyun Hazırlığı"
      onBack={() =>
        router.canGoBack() ? router.back() : router.replace("/categories")
      }
    >
      <View style={{ gap: 20 }}>
        <Card style={{ gap: 8 }}>
          <View
            style={{
              flexDirection: fontScale > 1.5 ? "column" : "row",
              gap: 12,
              alignItems: "center",
            }}
          >
            {option && (
              <View style={{ width: 72 }}>
                <CategoryArtwork id={option.artwork} />
              </View>
            )}
            <View style={{ flex: 1, gap: 4 }}>
              <Txt size={16} weight="semibold">
                {title}
              </Txt>
              <Txt size={12} color={t.muted}>
                {count} mevcut soru · Tur başına 10 soru
              </Txt>
            </View>
          </View>
          <TextAction title="Kategori Değiştir" onPress={chooseCategory} />
        </Card>
        <View
          accessibilityRole="radiogroup"
          accessibilityLabel="Zorluk seçimi"
          style={{ gap: 12 }}
        >
          <Txt size={18} weight="bold" accessibilityRole="header">
            Zorluk Seviyesi
          </Txt>
          <View
            style={{
              flexDirection: fontScale > 1.4 ? "column" : "row",
              gap: 8,
            }}
          >
            {(["easy", "medium", "hard"] as const).map((level) => (
              <View key={level} style={{ flex: 1 }}>
                <CategoryDifficulty
                  level={level}
                  selected={selection.difficulty === level}
                  onPress={() => {
                    setSelection((s) => ({
                      ...s,
                      difficulty: level,
                      stage: undefined,
                    }));
                    setAttempted(false);
                  }}
                />
              </View>
            ))}
          </View>
          {selection.stage && (
            <Txt size={12}>
              Önceki bağlantı: {stageDefinition(selection.stage).title}.
              İstersen yukarıdan zorluk seçebilirsin.
            </Txt>
          )}
        </View>
        <View testID="category-start-panel" style={{ gap: 12 }}>
          <Txt size={14} weight="semibold">
            {title} ·{" "}
            {selection.difficulty
              ? difficultyName[selection.difficulty]
              : selection.stage
                ? stageDefinition(selection.stage).title
                : "Zorluk seç"}
          </Txt>
          {!status.canStart && (
            <Txt size={13} color={t.muted} accessibilityLiveRegion="polite">
              {status.message}
            </Txt>
          )}
          {attempted && startError && (
            <Txt accessibilityRole="alert" color={t.danger}>
              {startError}
            </Txt>
          )}
          <Button
            title={assessing ? "Sorular hazırlanıyor…" : "Oyuna Başla"}
            icon="play"
            disabled={
              assessing ||
              !status.canStart ||
              !ready ||
              !!session ||
              !!storageError
            }
            onPress={() => play()}
          />
          {"canReplay" in status && status.canReplay === true && !session && (
            <Button
              title="Görülen sorularla yeniden oyna"
              variant="outline"
              disabled={assessing || !ready || !!storageError}
              onPress={() => play(true)}
            />
          )}
          {!!storageError && (
            <Txt accessibilityRole="alert">{storageError}</Txt>
          )}
          {session && (
            <>
              <Txt>Devam eden bir yarışman var.</Txt>
              <Button
                title="Yarışmana dön"
                variant="outline"
                onPress={() => router.push("/quiz")}
              />
            </>
          )}
          <TextAction title="Kategorilere Dön" onPress={chooseCategory} />
        </View>
      </View>
    </Page>
  );
}
