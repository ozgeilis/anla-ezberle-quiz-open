import { useLocalSearchParams } from "expo-router";
import { SettingsScreen } from "../../features/settings/SettingsScreen";
export default function SettingDetailRoute() {
  const { section } = useLocalSearchParams<{ section: string }>();
  return (
    <SettingsScreen
      section={typeof section === "string" ? section : "invalid"}
    />
  );
}
