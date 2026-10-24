import React from "react";
import { AchievementsScreen } from "../../features/achievements/AchievementsScreen";
import { TabScreen } from "../../components/ui/TabScreen";
export default function Screen() {
  return (
    <TabScreen>
      <AchievementsScreen />
    </TabScreen>
  );
}
