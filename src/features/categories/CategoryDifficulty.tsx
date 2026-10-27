import React from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Icon, Tap, Txt } from "../../components/ui";
import { type Difficulty, difficultyName } from "../../content/questions";
const styles = {
  easy: { colors: ["#12AD8C", "#006C63"] as const, stars: 1 },
  medium: { colors: ["#FFD565", "#DA911A"] as const, stars: 2 },
  hard: { colors: ["#E66567", "#8B2546"] as const, stars: 3 },
};
export function CategoryDifficulty({
  level,
  selected,
  onPress,
}: {
  level: Difficulty;
  selected: boolean;
  onPress: () => void;
}) {
  const paint = styles[level];
  const ink = level === "medium" ? "#4A2D00" : "#FFFFFF";
  return (
    <Tap
      role="radio"
      label={`Zorluk: ${difficultyName[level]}`}
      selected={selected}
      onPress={onPress}
      style={{
        borderRadius: 19,
        borderWidth: selected ? 3 : 1.5,
        borderColor: selected ? "#FFE9AA" : "#F6CD7F",
        overflow: "hidden",
        boxShadow: "0px 4px 10px rgba(36,44,30,.14)",
      }}
    >
      <LinearGradient
        colors={paint.colors}
        style={{
          minHeight: 77,
          padding: 8,
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
        }}
      >
        <View style={{ flexDirection: "row", gap: 3 }}>
          {Array.from({ length: paint.stars }, (_, i) => (
            <Icon
              key={i}
              name="star"
              size={17}
              color={level === "medium" ? "#6E4500" : "#FFE59D"}
            />
          ))}
        </View>
        <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
          {selected && <Icon name="check-circle" size={14} color={ink} />}
          <Txt size={14} weight="heavy" color={ink}>
            {difficultyName[level]}
          </Txt>
        </View>
      </LinearGradient>
    </Tap>
  );
}
