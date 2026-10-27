import React, { useState } from "react";
import { router } from "expo-router";
import { Button, Card, Txt } from "../../components/ui";
import type { Feedback } from "../../components/ui/FeedbackDialog";
import { useTheme } from "../../theme/tokens";
import { useOnlineAuth } from "../online/OnlineProvider";

export function AccountSettings({
  setFeedback,
}: {
  setFeedback: React.Dispatch<React.SetStateAction<Feedback | null>>;
}) {
  const auth = useOnlineAuth(),
    t = useTheme();
  const [busy, setBusy] = useState(false);
  return (
    <>
      <Card style={{ gap: 12 }}>
        <Txt weight="bold">
          {auth.session ? "Çevrimiçi hesabın" : "Misafir Oyuncu"}
        </Txt>
        {auth.session ? (
          <>
            <Txt>{auth.session.user.email}</Txt>
            <Txt size={12} color={t.muted}>
              {auth.session.user.email_confirmed_at
                ? "E-posta doğrulandı"
                : "E-posta doğrulamanı tamamla"}
            </Txt>
            <Button
              title="Şifremi sıfırla"
              variant="outline"
              onPress={() => router.push("/online/forgot-password")}
            />
            <Button
              title={busy ? "Çıkış yapılıyor…" : "Hesaptan Çık"}
              variant="outline"
              disabled={busy}
              onPress={() => {
                setBusy(true);
                void auth
                  .signOut()
                  .then(() =>
                    setFeedback({
                      tone: "information",
                      title: "Oturum Kapatıldı",
                      message:
                        "Yerel oyun kayıtların, XP ve rozetlerin korunuyor.",
                    }),
                  )
                  .catch(() =>
                    setFeedback({
                      tone: "error",
                      title: "Çıkış tamamlanamadı",
                      message: "Bağlantını kontrol edip yeniden dene.",
                    }),
                  )
                  .finally(() => setBusy(false));
              }}
            />
          </>
        ) : (
          <>
            <Txt size={13}>
              Yerel oyun geçmişin bu cihazda korunur. Çevrimiçi özellikler için
              hesabını bağla.
            </Txt>
            <Button
              title="Hesap Oluştur / Giriş Yap"
              onPress={() => router.push("/online")}
            />
          </>
        )}
        <Button
          title="E-posta doğrulama"
          variant="outline"
          onPress={() => router.push("/online/verify-email")}
        />
      </Card>
      <Card style={{ gap: 10, borderColor: t.danger }}>
        <Txt weight="bold" color={t.danger}>
          Hesap silme
        </Txt>
        <Txt size={13}>
          Kalıcı silme ve güvenli kimlik doğrulaması için mevcut hesap silme
          ekranına geç.
        </Txt>
        <Button
          title="Hesabımı Sil"
          icon="trash-2"
          variant="danger"
          onPress={() => router.push("/account-delete")}
        />
      </Card>
    </>
  );
}
