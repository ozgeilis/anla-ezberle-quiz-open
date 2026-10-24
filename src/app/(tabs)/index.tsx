import React from "react";
import { HomeScreen } from "../../features/home/HomeScreen";
import { TabScreen } from "../../components/ui/TabScreen";
export default function Screen() {
  return (
    <TabScreen>
      <HomeScreen />
    </TabScreen>
  );
}
