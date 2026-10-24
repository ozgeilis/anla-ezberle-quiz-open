import React from "react";
import { CategoriesScreen } from "../../features/categories/CategoriesScreen";
import { TabScreen } from "../../components/ui/TabScreen";
export default function Screen() {
  return (
    <TabScreen>
      <CategoriesScreen />
    </TabScreen>
  );
}
