import React from "react";
import { Image } from "react-native";
import Svg, { Circle, Ellipse, G, Path, Rect } from "react-native-svg";
import type { LearningTopicId } from "../../content/questions/learning-topics-v1";

export type TopicArtworkId =
  | LearningTopicId
  | "children"
  | "ramazan"
  | "kadir_gecesi"
  | "ramazan_bayrami"
  | "kurban_bayrami"
  | "hac_mevsimi"
  | "muharrem_asura";

const categoryGems = {
  quran: require("../../../assets/images/reference-ui/book-gem.webp"),
  siyer: require("../../../assets/images/category-gems/siyer.webp"),
  peygamberler: require("../../../assets/images/category-gems/peygamberler.webp"),
  fikih: require("../../../assets/images/category-gems/fikih.webp"),
  ahlak: require("../../../assets/images/category-gems/ahlak.webp"),
  medeniyet: require("../../../assets/images/category-gems/medeniyet.webp"),
  children: require("../../../assets/images/category-gems/children.webp"),
} as const;
/**
 * Local optimized gem illustrations and seasonal vectors; no network images or religious figure depictions.
 * The shared halo keeps a consistent family; each category uses its own visual subject.
 */
export function TopicArtwork({
  id,
  size = 92,
}: {
  id: TopicArtworkId;
  size?: number;
}) {
  if (id in categoryGems)
    return (
      <Image
        accessible={false}
        aria-hidden
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        source={categoryGems[id as keyof typeof categoryGems]}
        resizeMode="contain"
        style={{ width: size, height: size }}
      />
    );
  const light = "#FFF6D9";
  const gold = "#FFD77C";
  const turquoise = "#AFEDE2";
  const line = {
    stroke: light,
    strokeWidth: 3,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <Svg width={size} height={size} viewBox="0 0 120 110" aria-hidden={true}>
      <Circle cx="60" cy="53" r="46" fill="#FFFFFF" opacity={0.11} />
      <Circle
        cx="60"
        cy="53"
        r="35"
        stroke="#FFFFFF"
        opacity={0.22}
        strokeWidth="1"
        fill="none"
      />
      <Circle cx="24" cy="24" r="2" fill={gold} opacity={0.9} />
      <Circle cx="97" cy="75" r="2.5" fill={gold} opacity={0.8} />
      {id === "akaid" && (
        <G>
          <Circle
            cx="60"
            cy="56"
            r="31"
            stroke={light}
            strokeWidth="3"
            fill="none"
          />
          <Circle
            cx="60"
            cy="56"
            r="23"
            stroke={gold}
            strokeDasharray="2 7"
            strokeWidth="2"
            fill="none"
          />
          <Path
            d="M60 17 L68 44 L95 53 L68 62 L60 91 L52 62 L25 53 L52 44Z"
            fill={light}
            stroke={gold}
            strokeWidth="2.5"
          />
          <Circle cx="60" cy="53" r="8" fill="#38769B" />
        </G>
      )}
      {id === "islam_tarihi" && (
        <G>
          <Rect x="21" y="42" width="78" height="54" rx="3" fill={light} />
          <Path d="M17 44 L60 18 L103 44Z" fill={gold} />
          <Path d="M44 96 V64 Q60 45 76 64 V96Z" fill="#AE704A" />
          <Path d="M27 51 H37 V74 H27Z M83 51 H93 V74 H83Z" fill="#C59261" />
          <Path d="M60 20 V11 M28 97 H92" {...line} />
        </G>
      )}
      {id === "sahabe" && (
        <G>
          <Path
            d="M15 86 L60 30 L105 86Z"
            fill={light}
            stroke={gold}
            strokeWidth="3"
          />
          <Path d="M46 86 L60 48 L74 86Z" fill="#627DAD" />
          <Path d="M60 30 V15" {...line} />
          <Path d="M61 15 Q78 10 90 19 Q75 26 61 23Z" fill={gold} />
          <Path d="M17 95 H103" {...line} />
          <Circle cx="33" cy="32" r="4" fill={turquoise} />
        </G>
      )}
      {id === "dualar" && (
        <G>
          <Path
            d="M26 78 Q14 62 24 52 Q34 44 42 58 L54 75 M94 78 Q106 62 96 52 Q86 44 78 58 L66 75"
            fill="none"
            stroke={light}
            strokeWidth="12"
            strokeLinecap="round"
          />
          <Path
            d="M22 80 Q39 93 60 94 Q81 93 98 80"
            fill="none"
            stroke={gold}
            strokeWidth="5"
            strokeLinecap="round"
          />
          <Path
            d="M60 19 C73 32 73 39 60 48 C47 39 47 32 60 19Z"
            fill={turquoise}
          />
          <Circle cx="60" cy="33" r="4" fill={gold} />
        </G>
      )}
      {id === "ramazan" && (
        <G>
          <Path d="M78 18 A29 29 0 1 0 90 66 A35 35 0 1 1 78 18Z" fill={gold} />
          <Path d="M32 17 V38 M20 40 H44 L41 73 H23Z" {...line} fill="none" />
          <Path d="M24 46 H40 L38 66 H26Z" fill={gold} />
          <Path d="M23 73 H41 M31 10 V17" {...line} />
          <Path
            d="M93 20 L96 27 L103 30 L96 33 L93 40 L90 33 L83 30 L90 27Z"
            fill={light}
          />
        </G>
      )}
      {id === "kadir_gecesi" && (
        <G>
          <Path
            d="M66 16 A34 34 0 1 0 98 66 A40 40 0 1 1 66 16Z"
            fill={light}
          />
          <Path
            d="M74 31 L79 45 L94 50 L79 55 L74 69 L69 55 L54 50 L69 45Z"
            fill={gold}
          />
          <Circle cx="101" cy="28" r="3" fill={gold} />
          <Circle cx="95" cy="78" r="2" fill={gold} />
        </G>
      )}
      {id === "ramazan_bayrami" && (
        <G>
          <Rect x="29" y="47" width="62" height="43" rx="5" fill={light} />
          <Rect x="23" y="40" width="74" height="12" rx="3" fill={gold} />
          <Path d="M57 41 H66 V89 H57Z" fill="#4E9E96" />
          <Path
            d="M62 40 C30 35 32 16 48 24 C56 28 60 36 62 40 C66 22 87 16 91 28 C95 40 75 43 62 40Z"
            fill="none"
            stroke={light}
            strokeWidth="4"
          />
          <Path
            d="M17 27 L20 32 L26 34 L20 36 L17 42 L15 36 L9 34 L15 32Z"
            fill={gold}
          />
        </G>
      )}
      {id === "kurban_bayrami" && (
        <G>
          <Ellipse cx="61" cy="61" rx="31" ry="22" fill={light} />
          <Circle cx="40" cy="49" r="12" fill={light} />
          <Circle cx="82" cy="49" r="12" fill={light} />
          <Ellipse cx="60" cy="70" rx="17" ry="13" fill={gold} />
          <Circle cx="52" cy="65" r="2.8" fill="#7A5A55" />
          <Circle cx="68" cy="65" r="2.8" fill="#7A5A55" />
          <Path
            d="M58 74 Q60 79 62 74"
            stroke="#7A5A55"
            strokeWidth="2"
            fill="none"
          />
          <Path d="M38 81 L32 93 M82 81 L88 93" {...line} />
        </G>
      )}
      {id === "hac_mevsimi" && (
        <G>
          <Rect
            x="28"
            y="33"
            width="64"
            height="57"
            rx="2"
            fill="#29394F"
            stroke={light}
            strokeWidth="3"
          />
          <Rect x="28" y="47" width="64" height="10" fill={gold} />
          <Path d="M37 38 H83 M37 83 H83" stroke={gold} strokeWidth="2" />
          <Path d="M60 22 V12 M46 18 H74" {...line} />
          <Circle cx="22" cy="75" r="3" fill={turquoise} />
          <Circle cx="99" cy="69" r="3" fill={turquoise} />
        </G>
      )}
      {id === "muharrem_asura" && (
        <G>
          <Path
            d="M26 58 Q27 91 60 92 Q93 91 94 58Z"
            fill={light}
            stroke={gold}
            strokeWidth="3"
          />
          <Path d="M22 58 H98" {...line} />
          <Ellipse cx="60" cy="58" rx="33" ry="10" fill={gold} />
          <Circle cx="47" cy="56" r="4" fill="#B76E59" />
          <Circle cx="68" cy="62" r="4" fill="#6C8E6D" />
          <Circle cx="80" cy="55" r="3" fill="#B76E59" />
          <Path
            d="M49 39 Q41 31 49 21 M65 39 Q57 31 65 21"
            {...line}
            fill="none"
            opacity={0.7}
          />
        </G>
      )}
    </Svg>
  );
}
