// Kept in parity with quiz_private.valid_username; the database is authoritative.
export function usernameError(value: string): string | null {
  if (!/^[a-z0-9_]{3,20}$/.test(value))
    return "3–20 küçük harf, rakam ve alt çizgi kullan.";
  if (
    /^(admin|administrator|moderator|support|system|root|official|diyanet|tdv|anla_ezberle|deleted|null|undefined)$/.test(
      value,
    ) ||
    /(fuck|shit|nazi|siktir|orospu|amk|pic|yarrak)/.test(value)
  )
    return "Bu kullanıcı adına izin verilmiyor. Başka bir ad seç.";
  return null;
}
export function searchUsername(value: string) {
  return value.replace(/^@/, "").toLowerCase().trim();
}
