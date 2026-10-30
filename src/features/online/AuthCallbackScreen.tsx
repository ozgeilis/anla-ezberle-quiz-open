import { completeGoogleAuth, hasGoogleAttempt } from "./googleAuth";
import React, { useEffect, useRef, useState } from "react";
import { Platform, TextInput, View } from "react-native";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { Button, Card, Page, Txt } from "../../components/ui";
import { useTheme } from "../../theme/tokens";
import { onlineClient } from "./client";
import { passwordError } from "./account";
import { verifyEmailLink } from "./verifyLink";
import { Feedback, FeedbackDialog } from "../../components/ui/FeedbackDialog";
import { useOnlineAuth } from "./OnlineProvider";
export function AuthCallbackScreen() {
  const incoming = Linking.useURL(),
    theme = useTheme(),
    auth = useOnlineAuth();
  const processed = useRef(new Set<string>()),
    generation = useRef(0),
    mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const [webUrl, setWebUrl] = useState(() =>
    Platform.OS === "web" && typeof window !== "undefined"
      ? window.location.href
      : null,
  );
  useEffect(() => {
    if (Platform.OS !== "web") return;
    const changed = () => setWebUrl(window.location.href);
    window.addEventListener("hashchange", changed);
    window.addEventListener("popstate", changed);
    return () => {
      window.removeEventListener("hashchange", changed);
      window.removeEventListener("popstate", changed);
    };
  }, []);
  const [isGoogleCallback, setIsGoogleCallback] = useState(false);
  const [message, setMessage] = useState(
    "Doğrulama bağlantısı kontrol ediliyor…",
  );
  const [recovery, setRecovery] = useState(false),
    [verified, setVerified] = useState(false),
    [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const passwordLock = useRef(false);
  useEffect(() => {
    const value = webUrl ?? incoming;
    if (!value || processed.current.has(value)) return;
    let candidate: URL | null = null;
    try {
      candidate = new URL(value);
      if (processed.current.size && !candidate.hash && !candidate.search)
        return;
    } catch {
      // Malformed links are reported by the async verification path below.
    }
    processed.current.add(value);
    const revision = ++generation.current;
    let googleCallback = false;
    const verify = async () => {
      // Even a misconfigured build must not leave email credentials in history.
      if (Platform.OS === "web")
        window.history.replaceState(null, "", "/online/auth");
      await Promise.resolve();
      if (!mounted.current || generation.current !== revision) return;
      setVerified(false);
      setRecovery(false);
      setFeedback(null);
      setMessage("Doğrulama bağlantısı kontrol ediliyor…");
      const client = onlineClient();
      if (!client) throw new Error("Servis yapılandırılmadı.");
      googleCallback =
        candidate?.searchParams.get("flow") === "google" ||
        (await hasGoogleAttempt());
      setIsGoogleCallback(googleCallback);
      if (googleCallback) {
        await completeGoogleAuth(value);
        if (mounted.current && generation.current === revision)
          router.replace("/profile");
        return;
      }
      const { recovery: recovering } = await verifyEmailLink(
        value,
        client.auth,
      );
      if (!mounted.current || generation.current !== revision) return;
      setVerified(true);
      setFeedback({
        tone: "success",
        title: recovering ? "Bağlantı Doğrulandı" : "E-posta Doğrulandı!",
        message: recovering
          ? "Yeni şifreni belirleyebilirsin."
          : "E-posta adresin sunucuda doğrulandı. Çevrimiçi erişimin hesabının yetkilerine göre kullanılabilir.",
        actionLabel: recovering ? undefined : "Profilime Git",
      });
      setRecovery(recovering);
      setMessage(
        recovering
          ? "Yeni şifreni belirleyebilirsin."
          : "E-posta adresin doğrulandı. Kullanıcı adını profilinden oluşturabilirsin.",
      );
    };
    verify().catch((e) => {
      if (mounted.current && generation.current === revision) {
        setVerified(false);
        setRecovery(false);
        const text =
          e instanceof Error ? e.message : "Doğrulama tamamlanamadı.";
        setMessage(text);
        setFeedback({
          tone: "error",
          title: "Doğrulama Başarısız",
          message: text,
          actionLabel: googleCallback
            ? "Giriş Ekranına Dön"
            : "Yeni Bağlantı İste",
        });
      }
    });
  }, [incoming, webUrl]);
  return (
    <Page
      title={recovery ? "Yeni Şifre Oluştur" : "Hesabını doğrula"}
      subtitle="Güvenli çevrimiçi hesabın"
    >
      <Card style={{ gap: 16 }}>
        {!feedback && <Txt accessibilityLiveRegion="polite">{message}</Txt>}
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
                    setRecovery(false);
                    setMessage("Şifren kaydedildi.");
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
          let destination: "/profile" | "/online/verify-email" | "/online" =
            success ? "/profile" : "/online/verify-email";
          if (!success && isGoogleCallback) destination = "/online";
          router.replace(destination);
        }}
      />
    </Page>
  );
}
