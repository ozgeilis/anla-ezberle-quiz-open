import React from "react";
import { Switch, View } from "react-native";
import { Button, Card, Txt } from "../../components/ui";
import { useTheme } from "../../theme/tokens";
import { useAds } from "./AdProvider";

export function AdPrivacySettings() {
  const ads = useAds(),
    theme = useTheme();
  if (!ads.enabled) return null;
  return (
    <Card style={{ gap: 12 }}>
      <Txt weight="bold">Reklam Gizlilik Tercihleri</Txt>
      <Txt size={12}>
        Bu test sürümü yalnız Google’ın test reklamlarını kullanır. Reklam
        istemezsen oyuna reklamsız devam edebilirsin. Doğum tarihin veya kesin
        yaşın istenmez.
      </Txt>
      {(
        [
          {
            key: "adultConfirmed",
            title: "18 yaş veya üzerindeyim",
            description:
              "Bu cihazdaki reklam testi yalnız yetişkinler içindir.",
          },
          {
            key: "testAdsAllowed",
            title: "Test reklamlarına izin ver",
            description:
              "Google cihaz/ağ ve reklam etkileşimi verilerini işleyebilir. Bu tercih UMP onayının yerine geçmez.",
          },
        ] as const
      ).map(({ key, title, description }) => (
        <View
          key={key}
          style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
        >
          <View style={{ flex: 1 }}>
            <Txt size={14} weight="semibold">
              {title}
            </Txt>
            <Txt size={12} color={theme.muted}>
              {description}
            </Txt>
          </View>
          <Switch
            accessibilityLabel={title}
            value={ads.preferences[key]}
            disabled={
              ads.busy ||
              (key === "testAdsAllowed" && !ads.preferences.adultConfirmed)
            }
            trackColor={{ true: theme.accent }}
            onValueChange={(value) =>
              void ads.updatePreferences({ [key]: value })
            }
          />
        </View>
      ))}
      {ads.preferences.adultConfirmed && ads.preferences.testAdsAllowed && (
        <Button
          title="Reklam izinlerini hazırla"
          disabled={ads.busy}
          onPress={ads.prepareConsent}
          variant="outline"
        />
      )}
      {
        <Button
          title="Google reklam gizlilik seçenekleri"
          disabled={ads.busy}
          onPress={ads.openPrivacyOptions}
          variant="outline"
        />
      }
      <Txt size={12} accessibilityLiveRegion="polite" color={theme.muted}>
        {ads.error ||
          (ads.ready
            ? "İzinler hazır. Yüklenebilen test reklamları ana sayfada gösterilir; bu anahtarla her zaman kapatabilirsin."
            : "Reklamlar kapalı. Yaşı belirsiz veya reşit olmayan kullanıcılara reklam gösterilmez.")}
      </Txt>
    </Card>
  );
}
