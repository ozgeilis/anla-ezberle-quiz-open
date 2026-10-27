import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { useWindowDimensions, View } from "react-native";
import { categories, CategoryId, Difficulty } from "../../content/questions";
import { categoryGradients, colors as c } from "../../theme/tokens";
import { Icon, Tap, Txt } from "../ui";
import { CategoryArt, Pattern } from "./Artwork";
export function CategoryCard({
  category,
  onPress,
  large = false,
  selected = false,
}: {
  category: CategoryId;
  onPress: () => void;
  large?: boolean;
  selected?: boolean;
  difficulty?: Difficulty;
}) {
  const info = categories.find((item) => item.id === category)!;
  const compact = useWindowDimensions().width < 360;
  const textColor = category === "history" ? c.navy : c.white;
  return (
    <Tap
      label={`${info.title}${selected ? ", seçili" : ""}`}
      onPress={onPress}
      selected={selected}
      style={{
        borderRadius: 22,
        overflow: "hidden",
        borderWidth: 2,
        borderColor: selected ? c.navy : "rgba(255,255,255,0.55)",
        boxShadow: "0px 4px 0px rgba(9,47,70,0.12)",
      }}
    >
      <LinearGradient
        colors={categoryGradients[category]}
        locations={[0, 0.25, 1]}
        style={{
          minHeight: large ? 182 : 151,
          padding: 14,
          justifyContent: "flex-end",
        }}
      >
        <View pointerEvents="none" style={{ position: "absolute", inset: 0 }}>
          <Pattern color={c.white} opacity={0.09} />
        </View>
        <View
          style={{ alignSelf: "flex-start", marginTop: -5, marginBottom: 0 }}
        >
          <CategoryArt category={category} size={large ? 84 : 68} />
        </View>
        <Txt
          weight="heavy"
          size={compact ? 14 : large ? 18 : 16}
          color={textColor}
        >
          {info.title}
        </Txt>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <View
            style={{
              borderRadius: 20,
              width: 26,
              height: 26,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.35)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Icon
              name={selected ? "check" : "chevron-right"}
              color={textColor}
              size={20}
            />
          </View>
        </View>
      </LinearGradient>
    </Tap>
  );
}
