import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Page, TextAction, Txt } from "../../components/ui";
import { SettingsButton } from "../../components/ui/SettingsButton";
import { availableQuestions, type Difficulty } from "../../content/questions";
import { useGameLibrary } from "../../storage/GameProvider";
import { broadPreparationFromParams } from "./preparation";
import { categoryOptions, upcomingCollections } from "./learning-options";
import { LearningChoices, UpcomingLearning } from "./LearningChoices";
import { CategoryDifficulty } from "./CategoryDifficulty";
import type { PreparationSelection } from "./preparation";

export function CategoriesScreen() {
  const params = useLocalSearchParams<{
    category?: string;
    difficulty?: string;
    topic?: string;
    stage?: string;
    playCategory?: string;
  }>();
  const initial = broadPreparationFromParams(params);
  // Existing bookmarked category links still open a preparation, never start a game.
  if (initial.playCategory || initial.topic || initial.category)
    return <LegacyPreparationLink initial={initial} />;
  return (
    <CategoryCatalogue
      key={initial.difficulty ?? "all"}
      initialDifficulty={initial.difficulty}
    />
  );
}
// Consume historical links once; returning to the tab must show the catalogue.
function LegacyPreparationLink({ initial }: { initial: PreparationSelection }) {
  const router = useRouter();
  const opened = useRef(false);
  useEffect(() => {
    if (opened.current) return;
    opened.current = true;
    router.setParams({
      category: undefined,
      topic: undefined,
      stage: undefined,
      playCategory: undefined,
      difficulty: undefined,
    });
    router.push({ pathname: "/prepare", params: { ...initial } });
  }, [initial, router]);
  return (
    <Page title="Oyun Hazırlığı">
      <Txt>Seçimin açılıyor…</Txt>
    </Page>
  );
}
function CategoryCatalogue({
  initialDifficulty,
}: {
  initialDifficulty?: Difficulty;
}) {
  const router = useRouter();
  const { data } = useGameLibrary();
  const [difficulty, setDifficulty] = useState(initialDifficulty),
    [filters, setFilters] = useState(!!initialDifficulty);
  const topics = categoryOptions(
    availableQuestions,
    difficulty,
    undefined,
    data.games,
  );
  const open = (params: { playCategory?: string; category?: string }) =>
    router.push({
      pathname: "/prepare",
      params: { ...params, ...(difficulty ? { difficulty } : {}) },
    });
  return (
    <Page title="Kategoriler" right={<SettingsButton />}>
      <View testID="category-scroll" style={{ gap: 20 }}>
        <TextAction
          title={filters ? "Zorluk filtresini gizle" : "Zorluğa göre filtrele"}
          onPress={() => setFilters(!filters)}
        />
        {filters && (
          <View style={{ gap: 8 }}>
            <View
              accessibilityRole="radiogroup"
              accessibilityLabel="Zorluk filtresi"
              style={{ flexDirection: "row", gap: 8 }}
            >
              {(["easy", "medium", "hard"] as const).map((level) => (
                <View key={level} style={{ flex: 1 }}>
                  <CategoryDifficulty
                    level={level}
                    selected={difficulty === level}
                    onPress={() => setDifficulty(level)}
                  />
                </View>
              ))}
            </View>
            {difficulty && (
              <TextAction
                title="Tüm zorlukları göster"
                onPress={() => setDifficulty(undefined)}
              />
            )}
          </View>
        )}
        <LearningChoices
          topics={topics}
          selectedMixed={false}
          difficulty={difficulty}
          onSelect={(playCategory) => open({ playCategory })}
          onSelectMixed={() => open({ category: "mixed" })}
        />
        <UpcomingLearning collections={upcomingCollections} />
        <Txt size={12}>
          Hazırlanıyor olarak işaretlenen koleksiyonlar henüz oynanamaz.
        </Txt>
      </View>
    </Page>
  );
}
