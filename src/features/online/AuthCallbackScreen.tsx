import React, { useEffect, useRef, useState } from "react";
import { TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { Button, Card, Page, Txt } from "../../components/ui";
import { useTheme } from "../../theme/tokens";
import { passwordError } from "./account";
import { Feedback, FeedbackDialog } from "../../components/ui/FeedbackDialog";
import { useOnlineAuth } from "./OnlineProvider";
import { useAuthCallback } from "./useAuthCallback";
export function AuthCallbackScreen() {
  const router = useRouter(),
    theme = useTheme(),
    auth = useOnlineAuth();
  const callback = useAuthCallback();
  const isGoogleCallback = callback.state.google;
  const verified = callback.state.status === "success";
  const [passwordSaved, setPasswordSaved] = useState(false);
  const recovery =
    callback.state.status === "success" &&
    callback.state.recovery &&
    !passwordSaved;
  const message = passwordSaved ? "Şifren kaydedildi." : callback.state.message;
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const passwordLock = useRef(false);
  useEffect(() => {
    const result = callback.state;
    // Wait until the one session owner observes the exact server-verified user.
    if (
      result.status === "success" &&
      !result.recovery &&
      auth.ready &&
      auth.session?.user.id === result.userId
    )
      router.replace("/profile");
    // A credential-free revisit with an already restored session needs no waiting.
    if (
      (result.status === "missing" ||
        (result.status === "error" && !result.recovery)) &&
      auth.ready &&
      auth.session
    )
      router.replace("/profile");
  }, [callback.state, auth.ready, auth.session, router]);
  return (
    <Page
      title={recovery ? "Yeni Şifre Oluştur" : "Hesabını doğrula"}
      subtitle="Güvenli çevrimiçi hesabın"
    >
      <Card style={{ gap: 16 }}>
        {!feedback && <Txt accessibilityLiveRegion="polite">{message}</Txt>}
        {callback.state.status === "error" && (
          <Button title="Tekrar Dene" onPress={callback.retry} />
        )}
        {verified && recovery && (
          <View style={{ gap: 12 }}>
            <TextInput
              accessibilityLabel="Yeni şifre"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              maxLength={128}
              autoComplete="new-password"
              style={{
                padding: 14,
                minHeight: 52,
                borderWidth: 1,
                borderRadius: 14,
                borderColor: theme.border,
                color: theme.text,
                backgroundColor: theme.background,
              }}
            />
            <TextInput
              accessibilityLabel="Yeni şifreyi tekrarla"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              maxLength={128}
              autoComplete="new-password"
              style={{
                padding: 14,
                minHeight: 52,
                borderWidth: 1,
                borderRadius: 14,
                borderColor: theme.border,
                color: theme.text,
                backgroundColor: theme.background,
              }}
            />
            <Txt size={12} color={theme.muted}>
              {passwordError(password) ?? "Şifre uygun."}
            </Txt>
            {!!confirmPassword && password !== confirmPassword && (
              <Txt accessibilityRole="alert">Şifreler eşleşmiyor.</Txt>
            )}
            <Button
              title="Yeni Şifreyi Kaydet"
              disabled={
                busy ||
                !!passwordError(password) ||
                password !== confirmPassword
              }
              onPress={() => {
                if (passwordLock.current) return;
                passwordLock.current = true;
                setBusy(true);
                auth
                  .updatePassword(password)
                  .then(() => {
                    setPassword("");
                    setConfirmPassword("");
                    setPasswordSaved(true);
                    setFeedback({
                      tone: "success",
                      title: "Şifren Kaydedildi",
                      message: "Yeni şifrenle giriş yapabilirsin.",
                    });
                  })
                  .catch(() =>
                    setFeedback({
                      tone: "error",
                      title: "Şifre Kaydedilemedi",
                      message: "Bağlantını kontrol edip yeniden dene.",
                    }),
                  )
                  .finally(() => {
                    passwordLock.current = false;
                    setBusy(false);
                  });
              }}
            />
          </View>
        )}
        {verified && !recovery && (
          <Button
            title="Profilime Git"
            onPress={() => router.replace("/profile")}
          />
        )}
        {!verified && !isGoogleCallback && (
          <>
            <Button
              title="Yeni Doğrulama Bağlantısı İste"
              onPress={() => router.replace("/online/verify-email")}
            />
            <Button
              title="Şifre Sıfırlama Bağlantısı İste"
              variant="outline"
              onPress={() => router.replace("/online/forgot-password")}
            />
          </>
        )}
        <Button
          title="Giriş Ekranına Dön"
          variant="outline"
          onPress={() => router.replace("/online")}
        />
      </Card>
      <FeedbackDialog
        feedback={feedback}
        onClose={() => setFeedback(null)}
        onAction={() => {
          const success = feedback?.tone === "success";
          setFeedback(null);
          if (success) router.replace("/profile");
        }}
      />
    </Page>
  );
}
