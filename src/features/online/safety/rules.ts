export const reportReasons = [
  { value: "inappropriate_name", label: "Uygunsuz kullanıcı adı" },
  { value: "harassment", label: "Taciz" },
  { value: "spam", label: "Spam" },
  { value: "other", label: "Diğer" },
] as const;
export type ReportReason = (typeof reportReasons)[number]["value"];
// Immediate guidance only. The authoritative database also normalizes and filters.
export function profileContentError(value: string) {
  const folded = value
    .normalize("NFKC")
    .toLocaleLowerCase("tr-TR")
    .replace(
      /[ışğüöç0134]/g,
      (c) =>
        ({
          ı: "i",
          ş: "s",
          ğ: "g",
          ü: "u",
          ö: "o",
          ç: "c",
          0: "o",
          1: "l",
          3: "e",
          4: "a",
        })[c] ?? c,
    )
    .replace(/[^a-z0-9]/g, "");
  return /(siktir|orospu|yarrak|fuck|shit|amk)/.test(folded) ||
    /^nazi[0-9]*$/.test(folded) ||
    /[​-‏‪-‮⁦-⁩]/.test(value)
    ? "Bu ad uygun değil. Başka bir ad seç."
    : null;
}
export function reportDetailsError(value: string) {
  return value.length > 500 || /[\u0000-\u001f-]/.test(value)
    ? "Açıklama en fazla 500 karakter olmalı; kontrol karakteri içermemeli."
    : null;
}
