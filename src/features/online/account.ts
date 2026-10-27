export const AUTH_EMAIL_COOLDOWN_SECONDS = 60;
export function validEmail(email: string) {
  return (
    email.trim().length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  );
}
export function verifiedAccount(
  user:
    { email_confirmed_at?: string; is_anonymous?: boolean } | null | undefined,
) {
  return !!user?.email_confirmed_at && user.is_anonymous !== true;
}
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;
export const PASSWORD_GUIDANCE =
  "Şifre en az 8 karakter olmalı; büyük harf, küçük harf, rakam ve özel karakter içermeli.";
export function passwordError(password: string) {
  if (password.length > PASSWORD_MAX_LENGTH)
    return "Şifre en fazla 128 karakter olmalı.";
  return password.length < PASSWORD_MIN_LENGTH ||
    !/[a-z]/.test(password) ||
    !/[A-Z]/.test(password) ||
    !/[0-9]/.test(password) ||
    !/[^a-zA-Z0-9]/.test(password)
    ? PASSWORD_GUIDANCE
    : null;
}
export function authMessage(code: string | undefined) {
  const messages: Record<string, string> = {
    invalid_credentials:
      "E-posta veya şifre eşleşmedi. Bilgilerini kontrol et.",
    email_address_invalid: "Geçerli bir e-posta adresi yaz.",
    validation_failed: "Bilgilerini kontrol edip yeniden dene.",
    request_timeout:
      "İşlem zaman aşımına uğradı. Bağlantını kontrol edip yeniden dene.",
    unexpected_failure:
      "E-posta işlemi tamamlanamadı. Gönderim servisinde geçici bir sorun olabilir. Biraz sonra yeniden dene.",
    email_provider_disabled: "E-posta ile giriş geçici olarak kullanılamıyor.",
    session_not_found:
      "Oturumun sona erdi. Yeni bir bağlantı iste veya yeniden giriş yap.",
    refresh_token_not_found: "Oturumun sona erdi. Yeniden giriş yap.",
    bad_code_verifier:
      "Bağlantı bu oturumda doğrulanamadı. Yeni bir bağlantı iste.",
    flow_state_expired: "Bağlantının süresi doldu. Yeni bir bağlantı iste.",
    flow_state_not_found:
      "Bağlantı kullanılmış veya geçersiz. Yeni bir bağlantı iste.",
    reauthentication_needed:
      "Güvenlik için yeni bir şifre sıfırlama bağlantısı iste.",
    signup_disabled: "Yeni hesap kaydı henüz açılmadı.",
    email_address_not_authorized:
      "Doğrulama e-postası gönderilemiyor. E-posta servisi henüz genel kullanıma açılmadı.",
    email_not_confirmed:
      "E-posta adresini doğruladıktan sonra giriş yapabilirsin.",
    over_email_send_rate_limit:
      "E-posta gönderim sınırına ulaşıldı. Bir süre sonra yeniden dene.",
    over_request_rate_limit:
      "Çok fazla deneme yapıldı. Bir süre sonra yeniden dene.",
    otp_expired:
      "Doğrulama bağlantısı geçersiz veya süresi dolmuş. Yeni bağlantı iste.",
    user_already_exists:
      "Bu adresle bir hesap bulunuyor. Giriş yapabilir veya şifreni sıfırlayabilirsin.",
    same_password: "Yeni şifren önceki şifrenle aynı olamaz.",
    weak_password: "Daha güçlü bir şifre seç.",
  };
  return (
    messages[code ?? ""] ??
    "Hesap işlemi tamamlanamadı. Bilgilerini ve bağlantını kontrol et."
  );
}

export function authFailureMessage(
  error: { code?: string; status?: number },
  emailOperation = false,
) {
  if (error.status === 0)
    return "Hesap servisine ulaşılamadı. Bağlantını kontrol edip yeniden dene.";
  if (error.code) return authMessage(error.code);
  if (error.status === 429)
    return authMessage(
      emailOperation ? "over_email_send_rate_limit" : "over_request_rate_limit",
    );
  if (error.status && error.status >= 500)
    return "Hesap servisi geçici olarak kullanılamıyor. Biraz sonra yeniden dene.";
  return authMessage(undefined);
}
