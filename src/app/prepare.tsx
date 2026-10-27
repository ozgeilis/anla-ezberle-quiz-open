import React from "react";
import { useLocalSearchParams } from "expo-router";
import { PreparationScreen } from "../features/categories/PreparationScreen";
import { broadPreparationFromParams } from "../features/categories/preparation";
export default function PrepareRoute() {
  const params = useLocalSearchParams();
  const initial = broadPreparationFromParams(params);
  return <PreparationScreen key={JSON.stringify(initial)} initial={initial} />;
}
