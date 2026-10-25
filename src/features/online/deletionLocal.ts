/** Erase only the confirmed actor's online caches, never another actor or solo games. */
export function deletionCacheKeys(keys: readonly string[], actor: string) {
  if (!/^[a-f0-9-]{36}$/i.test(actor))
    throw new Error("Geçersiz hesap kimliği.");
  const prefixes = [
    `@anla-quiz-online/pending/v1/${actor}/`,
    `@anla-quiz-online/challenge/v1/${actor}/`,
    `anla-live-v1:${actor}:`,
  ];
  return keys.filter(
    (k) =>
      k === `@anla-quiz-online/create/v1/${actor}` ||
      prefixes.some((prefix) => k.startsWith(prefix)),
  );
}
