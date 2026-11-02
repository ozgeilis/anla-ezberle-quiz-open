import React from "react";
import { Redirect, useLocalSearchParams } from "expo-router";
import { PreparationScreen } from "../features/categories/PreparationScreen";
import {
  broadPreparationFromParams,
  unavailablePreparationLink,
} from "../features/categories/preparation";
export default function PrepareRoute() {
  const params = useLocalSearchParams();
  if (unavailablePreparationLink(params))
    return <Redirect href="/categories" />;
  const initial = broadPreparationFromParams(params);
  return <PreparationScreen key={JSON.stringify(initial)} initial={initial} />;
}
