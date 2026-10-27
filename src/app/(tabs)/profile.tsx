import React from "react";
import { ProfileScreen } from "../../features/profile/ProfileScreen";
import { TabScreen } from "../../components/ui/TabScreen";
export default function Screen() {
  return (
    <TabScreen>
      <ProfileScreen />
    </TabScreen>
  );
}
