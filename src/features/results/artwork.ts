import type { ImageSourcePropType } from "react-native";
import type { ResultTier } from "./presentation";
export const resultArtwork: Record<ResultTier, ImageSourcePropType> = {
  perfect: require("../../../assets/images/result-rewards/perfect.png"),
  excellent: require("../../../assets/images/result-rewards/excellent.png"),
  steady: require("../../../assets/images/result-rewards/steady.png"),
  beginning: require("../../../assets/images/result-rewards/beginning.png"),
  learning: require("../../../assets/images/result-rewards/learning.png"),
};
