import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  childrenCategory,
  type PlayCategoryId,
} from "../../domain/game/play-categories";
import { Image, StyleSheet, View, useWindowDimensions } from "react-native";
import { CategoryArtwork, type CategoryArtworkId } from "./CategoryArtwork";
import { Button, Dialog, Icon, Tap, Txt, s } from "../../components/ui";
import { Difficulty } from "../../content/questions";
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
  upcoming = false,
  statusLabel,
}: {
  title: string;
  subtitle: string;
  illustration: CategoryArtworkId;
  colors: readonly [string, string, string];
  footer: string;
  selected?: boolean;
  disabled?: boolean;
  onPress: () => void;
  upcoming?: boolean;
  statusLabel?: string;
}) {
  const theme = useTheme();
  const { width, fontScale } = useWindowDimensions();
  const [details, setDetails] = useState(false);
  const status = statusLabel ?? (upcoming ? "Yakında" : "Seviye kapalı");
  return (
    <>
      <Tap
        fill
        role={disabled ? "button" : "radio"}
        label={`${title}. ${subtitle}. ${footer}${disabled ? `. ${status}. Bilgi için aç` : selected ? ". Seçili" : ""}`}
        selected={selected}
        onPress={() => (disabled ? setDetails(true) : onPress())}
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
          <Txt size={11} color="#E5F5ED">
            {footer}
          </Txt>
          <View style={{ position: "absolute", top: 8, right: 8 }}>
            {disabled ? (
              <View
                style={{
                  paddingHorizontal: 7,
                  paddingVertical: 4,
                  borderRadius: 14,
                  backgroundColor: c.paleGold,
                  borderWidth: 1,
                  borderColor: c.gold,
                }}
              >
                <Txt size={10} weight="heavy" color={c.darkGold}>
                  {status}
                </Txt>
              </View>
            ) : (
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
            )}
          </View>
        </LinearGradient>
      </Tap>
      <Dialog visible={details} title={title} onClose={() => setDetails(false)}>
        <View style={{ gap: 14 }}>
          <Txt weight="heavy" color={theme.accent}>
            {status}
          </Txt>
          <Txt>{subtitle}</Txt>
          <Txt color={theme.muted}>
            {upcoming
              ? illustration === "children"
                ? "Kaynak, içerik ve yaş uygunluğu incelemesi tamamlanmadan bu kategori oyuna açılmayacak."
                : "İçerik incelemesi tamamlandığında bu koleksiyon oyuna açılacak. Şimdilik yalnızca ön izleme sunuluyor."
              : "Bu seçim için yeterli bağımsız soru yok. Başka bir zorluk veya kategori seçebilirsin."}
          </Txt>
          <Button title="Anladım" onPress={() => setDetails(false)} />
        </View>
      </Dialog>
    </>
  );
}

export function LearningChoices({
  topics,
  selected,
  selectedMixed,
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
              disabled={!topic.available}
              onPress={() => onSelect(topic.id)}
              footer={`${topic.count} soru${topic.exhausted ? " · Yeni tur tamamlandı" : !topic.available ? " · Tur için yetersiz" : ""}`}
            />
          </View>
        ))}
      </View>
      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={{ flex: 1 }}>
            <PaintedCategory
              title={childrenCategory.title}
              subtitle={childrenCategory.subtitle}
              illustration="children"
              colors={["#127F95", "#126B73", "#034D60"]}
              footer="Ön izleme"
              statusLabel="Hazırlanıyor"
              disabled
              upcoming
              onPress={() => {}}
            />
          </View>
          {columns !== "100%" && <View style={{ flex: 1 }} />}
        </View>
        <Txt size={12} color={theme.muted}>
          Kaynak ve yaş uygunluğu incelemesi tamamlanınca açılacak.
        </Txt>
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

export function UpcomingLearning({
  collections,
}: {
  collections: typeof upcomingCollections;
}) {
  const theme = useTheme();
  const columns = useWindowDimensions().fontScale > 1.6 ? "100%" : "46%";
  const others = collections.filter(
    (collection) => collection.id !== "ramazan",
  );
  return (
    <View style={{ gap: 24 }}>
      <View style={{ gap: 10 }}>
        <Txt accessibilityRole="header" size={18} weight="bold">
          Özel Zamanlar
        </Txt>
        <Txt color={theme.muted} size={12}>
          Ramazan, bayramlar ve özel günler için tematik sorular burada olacak.
        </Txt>
        <View style={{ gap: 10 }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {specialTimes.map((season) => (
              <View
                key={season.id}
                style={{ flexBasis: columns, flexGrow: 1, minWidth: 0 }}
              >
                <PaintedCategory
                  title={season.title}
                  subtitle={season.subtitle}
                  illustration={season.id}
                  colors={season.colors}
                  footer="Ön izleme"
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
        <Txt accessibilityRole="header" size={18} weight="bold">
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
                  illustration={collection.id}
                  colors={topicVisuals[art].colors}
                  footer="Ön izleme"
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
