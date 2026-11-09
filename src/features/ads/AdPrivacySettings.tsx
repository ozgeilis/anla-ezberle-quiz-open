import React from "react";
import { Platform } from "react-native";
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
        Gizlilik koşulları uygunsa ana sayfada ve tur sonrasında reklam
        gösterilir; soru sırasında reklam gösterilmez. Doğum tarihin veya yaşın
        istenmez; reklamlar herkes için kişiselleştirilmemiş ve genel izleyiciye
        uygun içerikle istenir.
      </Txt>
      <Button
        title="Reklam izinlerini yeniden kontrol et"
        disabled={ads.busy}
        onPress={ads.prepareConsent}
        variant="outline"
      />
      {ads.privacyOptionsRequired && (
        <Button
          title="Google reklam gizlilik seçenekleri"
          disabled={ads.busy}
          onPress={ads.openPrivacyOptions}
          variant="outline"
        />
      )}
      <Txt size={12} color={theme.muted}>
        Google cihaz/ağ ve reklam etkileşimi verilerini işleyebilir.
        {Platform.OS === "ios"
          ? " Apple takip iznini reddedersen IDFA kullanılmaz; kararını iOS Ayarlar → Gizlilik ve Güvenlik → Takip bölümünden değiştirebilirsin."
          : ""}{" "}
        Google gizlilik formu bölgende sunuluyorsa izinlerini yukarıdaki
        düğmeyle değiştirebilir veya geri alabilirsin.
      </Txt>
      <Txt size={12} accessibilityLiveRegion="polite" color={theme.muted}>
        {ads.busy
          ? "Google reklam izinleri kontrol ediliyor…"
          : ads.error ||
            (ads.ready
              ? "Gizlilik kontrolleri tamamlandı. Uygun reklam alanlarında reklam gösterilebilir."
              : "Reklamlar hazır değil. Gerekli izinler ana sayfada kontrol edilir; istersen burada yeniden deneyebilirsin.")}
      </Txt>
    </Card>
  );
}
