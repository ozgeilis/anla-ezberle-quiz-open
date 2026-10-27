import React from "react";
import { RankingScreen } from "../../features/ranking/RankingScreen";
import { TabScreen } from "../../components/ui/TabScreen";
export default function Screen() {
  return (
    <TabScreen>
      <RankingScreen />
    </TabScreen>
  );
}
