import React from "react";
import { Switch, View } from "react-native";
import { Button, Card, Txt } from "../../components/ui";
import { useTheme } from "../../theme/tokens";
import { useAds } from "./AdProvider";
import { adConfig } from "./adConfig";

export function AdPrivacySettings() {
  const ads = useAds(),
    theme = useTheme();
  if (!ads.enabled) return null;
  return (
    <Card style={{ gap: 12 }}>
      <Txt weight="bold">Reklam Gizlilik Tercihleri</Txt>
      <Txt size={12}>
        {adConfig.mode === "live"
          ? "Bu sürüm Google AdMob reklamlarını kullanır."
          : "Bu test sürümü yalnız Google’ın test reklamlarını kullanır."}{" "}
        Uygun koşullarda ana sayfada ve tur sonrasında reklam gösterilebilir.
        Reklam gösterimi için ayrı bir açma anahtarı yoktur. Google gizlilik
        tercihlerin ayrıca uygulanır. Doğum tarihin veya kesin yaşın istenmez.
      </Txt>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Txt size={14} weight="semibold">
            18 yaş veya üzerindeyim
          </Txt>
          <Txt size={12} color={theme.muted}>
            Bu cihazdaki reklamlar yalnız yetişkinler içindir. Yaş uygunluğu,
            Google gizlilik veya Apple takip izni yerine geçmez.
          </Txt>
        </View>
        <Switch
          accessibilityLabel="18 yaş veya üzerindeyim"
          value={ads.preferences.adultConfirmed}
          disabled={ads.busy}
          trackColor={{ true: theme.accent }}
          onValueChange={(value) =>
            void ads.updatePreferences({ adultConfirmed: value })
          }
        />
      </View>
      {ads.preferences.adultConfirmed && (
        <Button
          title="Reklam izinlerini hazırla"
          disabled={ads.busy}
          onPress={ads.prepareConsent}
          variant="outline"
        />
      )}
      {ads.preferences.adultConfirmed && ads.privacyOptionsRequired && (
        <Button
          title="Google reklam gizlilik seçenekleri"
          disabled={ads.busy}
          onPress={ads.openPrivacyOptions}
          variant="outline"
        />
      )}
      {ads.preferences.adultConfirmed && !ads.privacyOptionsRequired && (
        <Txt size={12} color={theme.muted}>
          Google yeniden açılabilir bir izin formu sunduğunda gizlilik düğmesi
          burada görünür. Durumu güncellemek için “Reklam izinlerini hazırla”yı
          kullanabilirsin.
        </Txt>
      )}
      <Txt size={12} color={theme.muted}>
        Google cihaz/ağ ve reklam etkileşimi verilerini işleyebilir. iOS’ta
        Apple takip iznini reddedersen IDFA kullanılmadan, kişiselleştirilmemiş
        reklam istenebilir; gerekli Google izinleri yine uygulanır.
      </Txt>
      <Txt size={12} accessibilityLiveRegion="polite" color={theme.muted}>
        {ads.busy
          ? "Google reklam izinleri kontrol ediliyor…"
          : ads.error ||
            (ads.ready
              ? "Gizlilik kontrolleri tamamlandı. Uygun reklam alanlarında yüklenebilen reklamlar gösterilebilir."
              : ads.preferences.adultConfirmed
                ? "Reklamlar hazır değil. Gerekli izinler ana sayfada kontrol edilir; istersen burada yeniden deneyebilirsin."
                : "Yaşı belirsiz veya reşit olmayan kullanıcılara reklam gösterilmez.")}
      </Txt>
    </Card>
  );
}
