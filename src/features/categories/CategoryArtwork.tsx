import React, { useState } from "react";
import { Image, View } from "react-native";
import {
  TopicArtwork,
  type TopicArtworkId,
} from "../../components/game/TopicArtwork";
import type { LearningThemeId } from "../../content/questions/learning-topics-v1";

export type CategoryArtworkId = TopicArtworkId | LearningThemeId;
/** Exact existing IDs: these are illustrations, never new or unlocked banks. */
const approvedArt = {
  hac_mevsimi: require("../../../assets/images/category-approved/01_hac_mevsimi.png"),
  muharrem_asura: require("../../../assets/images/category-approved/02_muharrem_ve_asure.png"),
  ramazan: require("../../../assets/images/category-approved/03_ramazan.png"),
  ramazan_bayrami: require("../../../assets/images/category-approved/04_ramazan_bayrami.png"),
  kadir_gecesi: require("../../../assets/images/category-approved/05_kadir_gecesi.png"),
  kurban_bayrami: require("../../../assets/images/category-approved/06_kurban_bayrami.png"),
  peygamberimizin_hayati: require("../../../assets/images/category-approved/07_peygamberimizin_hayati.png"),
  kadin_sahabeler: require("../../../assets/images/category-approved/08_kadin_sahabeler.png"),
  children: require("../../../assets/images/category-approved/09_cocuklar_icin.png"),
} as const;

/** A single contained image viewport for all category cards. Home is unchanged. */
export function CategoryArtwork({ id }: { id: CategoryArtworkId }) {
  const approved = approvedArt[id as keyof typeof approvedArt];
  const [edge, setEdge] = useState(120);
  return (
    <View
      testID={`category-viewport-${id}`}
      pointerEvents="none"
      accessible={false}
      aria-hidden
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        const next = Math.round(Math.min(width, height));
        if (next > 0 && next !== edge) setEdge(next);
      }}
      style={{
        width: "100%",
        aspectRatio: 1.35,
        maxHeight: 128,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {approved ? (
        <Image
          testID={`category-art-${id}`}
          source={approved}
          resizeMode="contain"
          style={{ width: "100%", height: "100%" }}
        />
      ) : (
        <TopicArtwork id={id as TopicArtworkId} size={edge} />
      )}
    </View>
  );
}
