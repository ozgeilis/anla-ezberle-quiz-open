import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { type PlayCategoryId } from "../../domain/game/play-categories";
import { Image, StyleSheet, View, useWindowDimensions } from "react-native";
import { CategoryArtwork, type CategoryArtworkId } from "./CategoryArtwork";
import { Icon, Tap, Txt, s } from "../../components/ui";
import { Difficulty } from "../../content/questions";
import { colors as c, radius, shadows, useTheme } from "../../theme/tokens";
import { topicVisuals } from "./category-visuals";
import { visibleCategoryOptions } from "./learning-options";

function PaintedCategory({
  title,
  subtitle,
  illustration,
  colors,
  footer,
  selected = false,
  onPress,
}: {
  title: string;
  subtitle: string;
  illustration: CategoryArtworkId;
  colors: readonly [string, string, string];
  footer?: string;
  selected?: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  const { width, fontScale } = useWindowDimensions();
  return (
    <Tap
      fill
      role="radio"
      label={`${title}. ${subtitle}${footer ? `. ${footer}` : ""}${selected ? ". Seçili" : ""}`}
      selected={selected}
      onPress={onPress}
      style={{
        borderRadius: 18,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: selected ? c.mustard : theme.goldBorder,
        boxShadow: selected ? shadows.categorySelected : shadows.card,
      }}
    >
      <LinearGradient
        colors={colors}
        style={{ flex: 1, padding: 8, paddingTop: 8, gap: 4 }}
      >
        <Image
          source={require("../../../assets/images/reference-ui/mosque-garden.webp")}
          resizeMode="cover"
          style={[
            StyleSheet.absoluteFill,
            { width: "100%", height: "100%", opacity: 0.08 },
          ]}
        />
        <CategoryArtwork id={illustration} />
        <Txt
          testID={`category-title-${illustration}`}
          size={width < 360 ? 14 : 16}
          weight="heavy"
          color={c.white}
          style={{
            minHeight: fontScale > 1.3 ? undefined : width < 360 ? 60 : 44,
            textShadowColor: "#002D35",
            textShadowRadius: 3,
            textShadowOffset: { width: 0, height: 1 },
          }}
        >
          {title}
        </Txt>
        <View style={{ position: "absolute", top: 8, right: 8 }}>
          <View
            style={{
              width: 26,
              height: 26,
              borderRadius: 13,
              backgroundColor: selected ? c.gold : "rgba(0,48,56,.7)",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: selected ? c.gold : "#FFE09B88",
            }}
          >
            <Icon
              name={selected ? "check" : "chevron-right"}
              color={selected ? c.deepTeal : c.white}
              size={16}
            />
          </View>
        </View>
      </LinearGradient>
    </Tap>
  );
}

export function LearningChoices({
  topics,
  selected,
  selectedMixed,
  onSelect,
  onSelectMixed,
}: {
  topics: ReturnType<typeof visibleCategoryOptions>;
  selected?: PlayCategoryId;
  selectedMixed: boolean;
  difficulty?: Difficulty;
  onSelect: (topic: PlayCategoryId) => void;
  onSelectMixed: () => void;
}) {
  const theme = useTheme();
  const columns = useWindowDimensions().fontScale > 1.6 ? "100%" : "46%";
  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel="Kategori seçimi"
      style={{ gap: 12 }}
    >
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        {topics.map((topic) => (
          <View
            key={topic.id}
            style={{ flexBasis: columns, flexGrow: 1, minWidth: 0 }}
          >
            <PaintedCategory
              title={topic.title}
              subtitle={topic.subtitle}
              illustration={topic.artwork}
              colors={topicVisuals[topic.artwork].colors}
              selected={selected === topic.id}
              onPress={() => onSelect(topic.id)}
              footer={topic.exhausted ? "Yeni tur tamamlandı" : undefined}
            />
          </View>
        ))}
      </View>
      <Tap
        role="radio"
        label="Karma: Tüm öğrenme konularından sorular"
        selected={selectedMixed}
        onPress={onSelectMixed}
        style={{
          minHeight: 56,
          padding: 12,
          borderRadius: radius.md,
          backgroundColor: selectedMixed ? theme.goldSurface : theme.card,
          boxShadow: selectedMixed ? shadows.categorySelected : shadows.card,
          borderWidth: 1,
          borderColor: selectedMixed ? c.mustard : theme.border,
        }}
      >
        <View style={[s.row, { gap: 12 }]}>
          <Icon
            name="shuffle"
            size={20}
            color={selectedMixed ? theme.goldInk : theme.accent}
          />
          <View style={{ flex: 1 }}>
            <Txt
              size={16}
              weight="heavy"
              color={selectedMixed ? theme.goldInk : theme.text}
            >
              Karma
            </Txt>
            <Txt size={12} color={theme.muted}>
              Bütün konulardan karışık bir tur
            </Txt>
          </View>
          <Icon
            name={selectedMixed ? "check-circle" : "chevron-right"}
            color={selectedMixed ? theme.goldInk : theme.muted}
            size={22}
          />
        </View>
      </Tap>
    </View>
  );
}
