interface ConsentContext {
  enabled: boolean;
  loaded: boolean;
  eligible: boolean;
  busy: boolean;
  playing: boolean;
  foreground: boolean;
  path: string;
}

// Manual actions must explain why they did not reach the SDK. These checks
// preserve the same no-gameplay/no-background/no-other-route boundaries.
export function consentBlockMessage(
  context: ConsentContext,
  interactive: boolean,
) {
  if (!context.enabled) return "Bu sürümde reklam izin hizmeti kullanılamıyor.";
  if (!context.loaded)
    return "Reklam tercihleri henüz okunamadı. Lütfen yeniden dene.";
  if (!context.eligible)
    return "Reklam izinleri için önce yetişkin yaş uygunluğunu belirtmelisin.";
  if (context.busy)
    return "Bir reklam izin işlemi devam ediyor. Bitmesini bekleyip yeniden dene.";
  if (context.playing)
    return "Devam eden turu bitir veya turdan çık; ardından gizlilik seçeneklerini yeniden aç.";
  if (!context.foreground)
    return "Uygulama ön plana döndüğünde gizlilik seçeneklerini yeniden dene.";
  if (
    interactive
      ? !["/", "/settings/privacy"].includes(context.path)
      : context.path !== "/"
  )
    return "Reklam izinlerini Ana Sayfa veya Ayarlar → Gizlilik ekranından açabilirsin.";
  return null;
}

export async function presentPrivacyOptions(
  requirement: string,
  show: () => Promise<unknown>,
): Promise<boolean> {
  if (requirement === "NOT_REQUIRED") return false;
  if (requirement !== "REQUIRED")
    throw Error("Privacy options requirement is unknown");
  await show();
  return true;
}
