import { SettingsButton } from "../../components/ui/SettingsButton";
import { gameStages, stageDefinition } from "../../domain/game/stages";
import {
  categoryPool,
  playCategoryName,
} from "../../domain/game/play-categories";
import {
  learningTopicPool,
  learningTopicName,
} from "../../domain/game/learning";
import { Tap, Button, Icon, Page, Txt, s } from "../../components/ui";
import {
  IconMedallion,
  DifficultyTile,
  IllustratedPanel,
} from "../../components/ui/visuals";
import React, { useDeferredValue, useMemo, useState } from "react";
import { View, useWindowDimensions } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { TopicArtwork } from "../../components/game/TopicArtwork";
import {
  Difficulty,
  difficultyName,
  availableQuestions,
} from "../../content/questions";
import { useGame } from "../../storage/GameProvider";
import { colors as c, shadows, useTheme } from "../../theme/tokens";
import {
  PreparationSelection,
  broadPreparationFromParams,
  preparationStatus,
} from "./preparation";
import { categoryOptions, upcomingCollections } from "./learning-options";
import { LearningChoices, UpcomingLearning } from "./LearningChoices";

export function CategoriesScreen() {
  const params = useLocalSearchParams<{
    category?: string;
    difficulty?: string;
    topic?: string;
    stage?: string;
    playCategory?: string;
  }>();
  const initial = broadPreparationFromParams(params);
  // A new home entry must preselect its own filter, even if this tab was visited.
  return (
    <PreparationScreen
      key={`${initial.playCategory ?? ""}:${initial.category ?? ""}:${initial.topic ?? ""}:${initial.difficulty ?? ""}:${initial.stage ?? ""}`}
      initial={initial}
    />
  );
}

function PreparationScreen({ initial }: { initial: PreparationSelection }) {
  const [selection, setSelection] = useState(initial);
  const assessedSelection = useDeferredValue(selection);
  const assessing = selection !== assessedSelection;
  const [attempted, setAttempted] = useState(false);
  const { start, startError, ready, session, data, storageError } = useGame();
  const topics = useMemo(
    () =>
      categoryOptions(
        availableQuestions,
        assessedSelection.difficulty,
        assessedSelection.stage,
        data.games,
      ),
    [assessedSelection.difficulty, assessedSelection.stage, data.games],
  );
  const theme = useTheme();
  const { width, fontScale } = useWindowDimensions();
  const compact = width < 360;
  const status = useMemo(
    () => preparationStatus(availableQuestions, assessedSelection, data.games),
    [assessedSelection, data.games],
  );
  const update = (next: Partial<PreparationSelection>) => {
    setSelection((current) => ({ ...current, ...next }));
    setAttempted(false);
  };
  const stageAvailability = useMemo(() => {
    const pool = assessedSelection.playCategory
      ? categoryPool(availableQuestions, assessedSelection.playCategory)
      : assessedSelection.topic
        ? learningTopicPool(availableQuestions, assessedSelection.topic)
        : availableQuestions;
    return Object.fromEntries(
      gameStages.map((stage) => {
        const status = preparationStatus(
          pool,
          { category: "mixed", stage: stage.id },
          data.games,
        );
        return [
          stage.id,
          status.canStart ||
            ("canReplay" in status && status.canReplay === true),
        ];
      }),
    );
  }, [assessedSelection.playCategory, assessedSelection.topic, data.games]);
  const categoryTitle = selection.playCategory
    ? playCategoryName(selection.playCategory)
    : selection.topic
      ? learningTopicName(selection.topic)
      : selection.category === "mixed"
        ? "Karma"
        : "Kategori seç";
  const stackedFooter =
    compact ||
    fontScale > 1.2 ||
    (width < 600 &&
      (categoryTitle.length > 24 ||
        ("canReplay" in status && status.canReplay === true)));
  const difficulties: {
    id: Difficulty;
    hint: string;
    icon: "sun" | "trending-up" | "zap";
  }[] = [
    { id: "easy", hint: "İlk adım", icon: "sun" },
    { id: "medium", hint: "Biraz keşif", icon: "trending-up" },
    { id: "hard", hint: "Kendini sına", icon: "zap" },
  ];
  return (
    <View style={{ flex: 1 }}>
      <Page
        title="Kategoriler"
        right={<SettingsButton />}
        subtitle="Bütün konular ve özel zamanlar tek yerde."
      >
        <View style={{ gap: 24 }}>
          <IllustratedPanel
            minHeight={120}
            artwork={<TopicArtwork id="quran" size={compact ? 58 : 74} />}
          >
            <Txt size={11} weight="heavy" color={c.gold}>
              SENİN TURUN, SENİN SEÇİMİN
            </Txt>
            <Txt size={compact ? 21 : 23} weight="heavy" color={c.white}>
              Hangi konudan başlayalım?
            </Txt>
            <Txt size={13} color={c.white}>
              10 soru · Her doğruya 100 puan
            </Txt>
          </IllustratedPanel>

          <View
            accessibilityRole="radiogroup"
            accessibilityLabel="Zorluk seçimi"
            style={{ gap: 12 }}
          >
            <View style={[s.row, { justifyContent: "space-between" }]}>
              <Txt accessibilityRole="header" size={20} weight="heavy">
                Zorluk
              </Txt>
              <Txt size={12} color={theme.muted}>
                {selection.difficulty ? "Seçildi ✓" : "Birini seç"}
              </Txt>
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {difficulties.map((level) => {
                const selected = selection.difficulty === level.id;
                return (
                  <View key={level.id} style={{ flexBasis: 88, flexGrow: 1 }}>
                    <DifficultyTile
                      title={difficultyName[level.id]}
                      icon={level.icon}
                      hint={level.hint}
                      selected={selected}
                      onPress={() =>
                        update({ difficulty: level.id, stage: undefined })
                      }
                    />
                  </View>
                );
              })}
            </View>
          </View>

          <View
            accessibilityRole="radiogroup"
            accessibilityLabel="Oyun aşaması seçimi"
            style={{ gap: 12 }}
          >
            <Txt accessibilityRole="header" size={20} weight="heavy">
              Beş aşamada keşfet
            </Txt>
            <Txt size={13} color={theme.muted}>
              Tek zorluk yerine karışık bir aşama seçebilirsin. Her turda 10
              bağımsız bilgi.
            </Txt>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
              {gameStages.map((stage) => {
                const supported = stageAvailability[stage.id];
                const selected = selection.stage === stage.id;
                return (
                  <View
                    key={stage.id}
                    style={{ flexBasis: compact ? 120 : 145, flexGrow: 1 }}
                  >
                    <Tap
                      label={`${stage.title} aşaması · ${stage.hint}${supported ? "" : " · Yetersiz bağımsız soru"}`}
                      role="radio"
                      selected={selected}
                      disabled={!supported}
                      onPress={() =>
                        update({ stage: stage.id, difficulty: undefined })
                      }
                      style={{
                        minHeight: 146,
                        padding: 12,
                        gap: 8,
                        borderRadius: 20,
                        borderWidth: 2,
                        borderColor: selected ? theme.goldBorder : theme.border,
                        backgroundColor: selected
                          ? theme.goldSurface
                          : stage.tone === "rose"
                            ? theme.roseSurface
                            : stage.tone === "violet"
                              ? theme.violetSurface
                              : theme.mintSurface,
                        opacity: 1,
                        boxShadow: selected ? shadows.selected : shadows.card,
                      }}
                    >
                      <IconMedallion
                        name={stage.icon}
                        tone={stage.tone}
                        size={40}
                      />
                      <Txt weight="heavy">
                        {stage.title}
                        {selected ? " ✓" : ""}
                      </Txt>
                      <Txt size={12} color={theme.muted}>
                        {stage.hint}
                      </Txt>
                      {!supported && (
                        <View style={[s.row, { gap: 5 }]}>
                          <Icon name="lock" size={12} color={theme.accent} />
                          <Txt size={11} style={{ flex: 1 }}>
                            Yeterli bağımsız soru yok
                          </Txt>
                        </View>
                      )}
                    </Tap>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={{ gap: 12 }}>
            <Txt accessibilityRole="header" size={20} weight="heavy">
              Oyun Kategorileri
            </Txt>
            <Txt size={14} color={theme.muted}>
              Resimli kategorileri keşfet, istersen Karma oyna.
            </Txt>
            <LearningChoices
              topics={topics}
              selected={selection.playCategory}
              selectedMixed={selection.category === "mixed"}
              difficulty={selection.difficulty}
              onSelect={(playCategory) =>
                update({ playCategory, topic: undefined, category: undefined })
              }
              onSelectMixed={() =>
                update({
                  category: "mixed",
                  topic: undefined,
                  playCategory: undefined,
                })
              }
            />
          </View>
          <UpcomingLearning collections={upcomingCollections} />
        </View>
      </Page>
      <View
        style={{
          gap: 8,
          paddingHorizontal: compact ? 16 : 24,
          paddingVertical: 12,
          backgroundColor: theme.dark ? "rgba(0,72,78,0.98)" : c.cream,
          boxShadow: shadows.dock,
          borderTopWidth: 1,
          borderColor: theme.dark ? c.turquoise : c.paleGold,
        }}
      >
        <View
          style={{ width: "100%", maxWidth: 852, alignSelf: "center", gap: 8 }}
        >
          <View
            style={{
              flexDirection: stackedFooter ? "column" : "row",
              gap: 12,
              alignItems: stackedFooter ? "stretch" : "center",
            }}
          >
            <View style={{ flex: 1, minWidth: 0, gap: 6 }}>
              <View style={[s.row, { gap: 8 }]}>
                <Icon
                  name={status.canStart ? "check-circle" : "info"}
                  color={theme.dark ? c.tealLight : c.teal}
                  size={20}
                />
                <Txt size={15} weight="heavy" style={{ flex: 1 }}>
                  {categoryTitle} ·{" "}
                  {selection.stage
                    ? stageDefinition(selection.stage).title
                    : selection.difficulty
                      ? difficultyName[selection.difficulty]
                      : "Zorluk seç"}
                </Txt>
              </View>
              <Txt
                size={12}
                accessibilityLiveRegion="polite"
                color={theme.muted}
              >
                {status.message}
              </Txt>
              {attempted && startError && (
                <Txt
                  color={theme.dark ? c.softCoral : c.danger}
                  accessibilityRole="alert"
                >
                  {startError}
                </Txt>
              )}
            </View>
            <View
              style={{
                width: stackedFooter ? "100%" : width >= 760 ? 240 : 190,
              }}
            >
              <Button
                style={{ minHeight: 54 }}
                title={assessing ? "Sorular hazırlanıyor…" : "Oyuna Başla"}
                icon="play"
                variant="mustard"
                disabled={
                  assessing ||
                  !status.canStart ||
                  !ready ||
                  !!session ||
                  !!storageError
                }
                onPress={() => {
                  if (
                    assessing ||
                    !status.canStart ||
                    (!selection.category &&
                      !selection.topic &&
                      !selection.playCategory) ||
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
                      { playCategory: selection.playCategory },
                    )
                  )
                    router.push("/quiz");
                  else setAttempted(true);
                }}
              />
            </View>
          </View>
          {"canReplay" in status && status.canReplay === true && !session && (
            <Button
              title="Görülen sorularla yeniden oyna"
              icon="rotate-cw"
              variant="outline"
              disabled={assessing || !ready || !!storageError}
              onPress={() => {
                if (
                  start(
                    "mixed",
                    undefined,
                    selection.difficulty,
                    undefined,
                    selection.stage,
                    { playCategory: selection.playCategory, allowReplay: true },
                  )
                )
                  router.push("/quiz");
                else setAttempted(true);
              }}
            />
          )}
          {!!storageError && (
            <Txt accessibilityRole="alert" size={12}>
              {storageError}
            </Txt>
          )}
          {session ? (
            <>
              <Txt>Devam eden bir yarışman var.</Txt>
              <Button
                title="Yarışmana dön"
                variant="outline"
                onPress={() => router.push("/quiz")}
              />
            </>
          ) : null}
        </View>
      </View>
    </View>
  );
}
