import React, { useRef, useState } from "react";
import { TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Button, Card, Page, Txt } from "../../components/ui";
import { useTheme } from "../../theme/tokens";
import { useOnlineAuth } from "./OnlineProvider";
import { Feedback, FeedbackDialog } from "../../components/ui/FeedbackDialog";
import { validEmail } from "./account";

export function AuthEmailScreen({
  mode,
}: {
  mode: "recovery" | "verification";
}) {
  const theme = useTheme(),
    auth = useOnlineAuth();
  const params = useLocalSearchParams<{ email?: string }>();
  const [email, setEmail] = useState(
    typeof params.email === "string" ? params.email : "",
  );
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  const lock = useRef(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const recovery = mode === "recovery";
  return (
    <Page
      title={recovery ? "Şifremi Unuttum" : "E-postanı doğrula"}
      subtitle="Anla & Ezberle hesabın"
    >
      <Card style={{ gap: 16 }}>
        <Txt>
          {recovery
            ? "Hesabının e-posta adresini yaz. Gelen güvenli bağlantıdan yeni şifreni oluşturabilirsin."
            : "Doğrulama bekleyen hesabın için yeni bir bağlantı iste. Gelen kutunu ve spam klasörünü kontrol et."}
        </Txt>
        <View style={{ gap: 6 }}>
          <Txt weight="bold">E-posta</Txt>
          <TextInput
            accessibilityLabel="E-posta"
            value={email}
            onChangeText={setEmail}
            editable={!busy}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            autoComplete="email"
            maxLength={254}
            style={{
              minHeight: 52,
              padding: 14,
              borderWidth: 1,
              borderRadius: 14,
              borderColor: theme.border,
              color: theme.text,
              backgroundColor: theme.background,
              fontSize: 16,
            }}
          />
        </View>
        {!feedback && !!message && (
          <Txt accessibilityLiveRegion="polite">{message}</Txt>
        )}
        <Button
          title={
            busy
              ? "Gönderiliyor…"
              : recovery
                ? "Şifre Sıfırlama Bağlantısı Gönder"
                : "Doğrulama E-postasını Yeniden Gönder"
          }
          disabled={busy || !validEmail(email)}
          onPress={() => {
            if (lock.current) return;
            lock.current = true;
            setBusy(true);
            setMessage("");
            (recovery
              ? auth.resetPassword(email)
              : auth.resendVerification(email)
            )
              .then(() => {
                const text = recovery
                  ? "Bu adresle uygun bir hesap varsa şifre sıfırlama bağlantısı gönderildi. E-postanı kontrol et. Yeniden istemek için en az 60 saniye bekle."
                  : "Bu adresle doğrulama bekleyen bir hesap varsa yeni bağlantı gönderildi. E-postanı kontrol et. Yeniden istemek için en az 60 saniye bekle.";
                setMessage(text);
                setFeedback({
                  tone: "information",
                  title: recovery
                    ? "Şifre Sıfırlama İsteği Alındı"
                    : "Doğrulama Bağlantısı İstendi",
                  message: text,
                });
              })
              .catch((e) => {
                const text =
                  e instanceof Error
                    ? e.message
                    : "E-posta gönderilemedi. Yeniden dene.";
                setMessage(text);
                setFeedback({
                  tone: "error",
                  title: "E-posta Gönderilemedi",
                  message: text,
                });
              })
              .finally(() => {
                lock.current = false;
                setBusy(false);
              });
          }}
        />
        <Txt size={12} color={theme.muted}>
          Bağlantı tek kullanımlıktır. Yalnızca en son gelen e-postadaki
          bağlantıyı kullan.
        </Txt>
        <Button
          title="Giriş Ekranına Dön"
          variant="outline"
          onPress={() => router.replace("/online")}
        />
      </Card>
      <FeedbackDialog feedback={feedback} onClose={() => setFeedback(null)} />
    </Page>
  );
}
