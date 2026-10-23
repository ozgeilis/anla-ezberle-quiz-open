import React from "react";
import {
  childrenCategory,
  type PlayCategoryId,
} from "../../domain/game/play-categories";
import { View, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Icon, Tap, Txt, s } from "../../components/ui";
import {
  TopicArtwork,
  type TopicArtworkId,
} from "../../components/game/TopicArtwork";
import { Difficulty, difficultyName } from "../../content/questions";
import type { LearningTopicId } from "../../content/questions/learning-topics-v1";
import { colors as c, radius, shadows, useTheme } from "../../theme/tokens";
import { topicVisuals, specialTimes } from "./category-visuals";
import { categoryOptions, upcomingCollections } from "./learning-options";

function PaintedCategory({
  title,
  subtitle,
  illustration,
  colors,
  footer,
  selected = false,
  disabled = false,
  onPress,
  wide = false,
  upcoming = false,
  statusLabel,
}: {
  title: string;
  subtitle: string;
  illustration: TopicArtworkId;
  colors: readonly [string, string, string];
  footer: string;
  selected?: boolean;
  disabled?: boolean;
  onPress: () => void;
  wide?: boolean;
  upcoming?: boolean;
  statusLabel?: string;
}) {
  const theme = useTheme();
  const compact = useWindowDimensions().width < 360;
  return (
    <Tap
      fill
      role={disabled ? "button" : "radio"}
      label={`${title}. ${subtitle}. ${footer}${selected ? ". Seçili" : ""}`}
      selected={selected}
      disabled={disabled}
      onPress={onPress}
      style={{
        borderRadius: radius.md,
        overflow: "hidden",
        opacity: 1, // Preserve bright artwork for the locked seasonal preview cards.
        borderWidth: 3,
        borderColor: selected ? c.mustard : theme.dark ? "#385C68" : "#FFFFFF",
        boxShadow: selected ? shadows.categorySelected : shadows.card,
      }}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          minHeight: wide ? 218 : 306,
          flex: 1,
          padding: compact ? 16 : 15,
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        {upcoming && (
          <LinearGradient
            pointerEvents="none"
            colors={["rgba(0,72,78,0.24)", "rgba(0,72,78,0.84)"]}
            style={{ position: "absolute", inset: 0 }}
          />
        )}
        <View
          pointerEvents="none"
          style={{
            width: 110,
            height: 110,
            borderRadius: 55,
            backgroundColor: "rgba(255,255,255,0.05)",
            position: "absolute",
            top: -40,
            right: -35,
          }}
        />
        <View
          style={{
            minHeight: wide ? 106 : 110,
            justifyContent: "center",
            alignItems: wide ? "flex-start" : "center",
          }}
        >
          <TopicArtwork
            id={illustration}
            size={wide ? 122 : compact ? 100 : 102}
          />
          <View style={{ position: "absolute", top: -3, right: -3 }}>
            {selected ? (
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: c.gold,
                  borderWidth: 2,
                  borderColor: c.cream,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="check" size={21} color={c.deepTeal} />
              </View>
            ) : disabled ? (
              <View
                style={[
                  s.row,
                  {
                    gap: 4,
                    paddingHorizontal: 8,
                    paddingVertical: 5,
                    borderRadius: radius.pill,
                    backgroundColor: upcoming
                      ? c.paleGold
                      : "rgba(0,22,40,0.74)",
                    borderWidth: 1,
                    borderColor: upcoming ? c.gold : "rgba(255,255,255,0.24)",
                  },
                ]}
              >
                <Icon
                  name={upcoming ? "clock" : "info"}
                  size={13}
                  color={upcoming ? c.darkGold : c.white}
                />
                <Txt
                  size={12}
                  weight="heavy"
                  color={upcoming ? c.darkGold : c.white}
                >
                  {statusLabel ?? (upcoming ? "Yakında" : "Seviye kapalı")}
                </Txt>
              </View>
            ) : (
              <Icon name="circle" size={22} color={c.white} />
            )}
          </View>
        </View>
        <View
          style={{ flex: 1, justifyContent: "flex-end", gap: 6, padding: 1 }}
        >
          <Txt size={20} weight="heavy" color={c.white}>
            {title}
          </Txt>
          <Txt size={14} color={c.white}>
            {subtitle}
          </Txt>
        </View>
        <View
          style={{
            alignSelf: "flex-start",
            maxWidth: "100%",
            backgroundColor: disabled
              ? "rgba(0,22,40,0.54)"
              : selected
                ? c.gold
                : c.cream,
            borderWidth: 1,
            borderColor: disabled ? "rgba(255,255,255,0.2)" : c.paleGold,
            paddingHorizontal: 11,
            paddingVertical: 7,
            borderRadius: radius.pill,
          }}
        >
          <View style={[s.row, { gap: 5 }]}>
            <Icon
              name={disabled ? "clock" : "bar-chart-2"}
              size={13}
              color={disabled ? c.white : c.navy}
            />
            <Txt
              size={14}
              weight="heavy"
              color={disabled ? c.white : c.navy}
              style={{ flexShrink: 1 }}
            >
              {footer}
            </Txt>
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
  difficulty,
  onSelect,
  onSelectMixed,
}: {
  topics: ReturnType<typeof categoryOptions>;
  selected?: PlayCategoryId;
  selectedMixed: boolean;
  difficulty?: Difficulty;
  onSelect: (topic: PlayCategoryId) => void;
  onSelectMixed: () => void;
}) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const narrow = width < 600;
  const columns = width >= 900 ? "30%" : narrow ? "100%" : "46%";
  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel="Kategori seçimi"
      style={{ gap: 12 }}
    >
      {!!difficulty && (
        <Txt size={12} color={theme.muted}>
          {difficultyName[difficulty]} seviyesinde 10 bağımsız sorusu olan
          kategoriler oynanabilir. Diğer seviyelerdeki soru sayılarını da
          görebilirsin.
        </Txt>
      )}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        {topics.map((topic) => (
          <View
            key={topic.id}
            style={{ flexBasis: columns, flexGrow: 1, minWidth: 0 }}
          >
            <PaintedCategory
              wide={narrow}
              title={topic.title}
              subtitle={topic.subtitle}
              illustration={topic.artwork}
              colors={topicVisuals[topic.artwork].colors}
              selected={selected === topic.id}
              disabled={!topic.available}
              onPress={() => onSelect(topic.id)}
              footer={`${topic.count} soru${topic.exhausted ? " · Yeni tur tamamlandı" : !topic.available ? " · Tur için yetersiz" : ""}`}
            />
          </View>
        ))}
      </View>
      <View style={{ gap: 8 }}>
        <PaintedCategory
          title={childrenCategory.title}
          subtitle={childrenCategory.subtitle}
          illustration="children"
          colors={["#127F95", "#126B73", "#034D60"]}
          footer="İçerik incelemesi sürüyor"
          statusLabel="Hazırlanıyor"
          disabled
          upcoming
          onPress={() => {}}
          wide
        />
        <Txt size={13} color={theme.muted}>
          {childrenCategory.reason}
        </Txt>
      </View>
      <Tap
        role="radio"
        label="Karma: Tüm öğrenme konularından sorular"
        selected={selectedMixed}
        onPress={onSelectMixed}
        style={{
          minHeight: 70,
          padding: 15,
          borderRadius: radius.md,
          backgroundColor: selectedMixed ? theme.goldSurface : theme.card,
          boxShadow: selectedMixed ? shadows.categorySelected : shadows.card,
          borderWidth: 3,
          borderColor: selectedMixed ? c.mustard : theme.border,
        }}
      >
        <View style={[s.row, { gap: 12 }]}>
          <Icon
            name="shuffle"
            size={27}
            color={selectedMixed ? theme.goldInk : theme.accent}
          />
          <View style={{ flex: 1 }}>
            <Txt
              size={17}
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

export function UpcomingLearning({
  collections,
}: {
  collections: typeof upcomingCollections;
}) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const narrow = width < 360;
  const columns = width >= 760 ? "30%" : narrow ? "100%" : "46%";
  const others = collections.filter(
    (collection) => collection.id !== "ramazan",
  );
  return (
    <View style={{ gap: 22 }}>
      <View style={{ gap: 10 }}>
        <Txt accessibilityRole="header" size={21} weight="heavy">
          Özel Zamanlar
        </Txt>
        <Txt color={theme.muted} size={12}>
          Ramazan, bayramlar ve özel günler için tematik sorular burada olacak.
        </Txt>
        <View style={{ gap: 10 }}>
          {specialTimes.map((season, index) =>
            index === 0 ? (
              <View key={season.id}>
                <PaintedCategory
                  title={season.title}
                  subtitle={season.subtitle}
                  illustration={season.id}
                  colors={season.colors}
                  footer="Yeni bir keşif yakında"
                  disabled
                  upcoming
                  onPress={() => {}}
                  wide
                />
              </View>
            ) : null,
          )}
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {specialTimes.slice(1).map((season) => (
              <View
                key={season.id}
                style={{ flexBasis: columns, flexGrow: 1, minWidth: 0 }}
              >
                <PaintedCategory
                  title={season.title}
                  subtitle={season.subtitle}
                  illustration={season.id}
                  colors={season.colors}
                  footer="Yeni bir keşif yakında"
                  disabled
                  upcoming
                  onPress={() => {}}
                />
              </View>
            ))}
          </View>
        </View>
      </View>
      <View style={{ gap: 10 }}>
        <Txt accessibilityRole="header" size={21} weight="heavy">
          Diğer özel koleksiyonlar
        </Txt>
        <Txt size={12} color={theme.muted}>
          İçerik incelemeleri tamamlandığında oyunlara açılacak.
        </Txt>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {others.map((collection) => {
            const art: LearningTopicId =
              collection.id === "kadin_sahabeler" ? "sahabe" : "siyer";
            return (
              <View
                key={collection.id}
                style={{ flexBasis: columns, flexGrow: 1, minWidth: 0 }}
              >
                <PaintedCategory
                  title={collection.title}
                  subtitle={collection.reason}
                  illustration={art}
                  colors={topicVisuals[art].colors}
                  footer="Yeni bir keşif yakında"
                  disabled
                  upcoming
                  onPress={() => {}}
                />
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
