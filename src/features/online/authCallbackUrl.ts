const keys = [
  "code",
  "token_hash",
  "type",
  "purpose",
  "flow",
  "attempt",
  "error",
  "error_code",
  "error_description",
] as const;
/** Router already received the intent even when a screen's Linking listener
 * mounted too late. Preserve duplicates so validation can reject ambiguity. */
export function callbackUrlFromParams(
  base: string,
  params: Record<string, string | string[] | undefined>,
) {
  const url = new URL(base);
  for (const key of keys) {
    const value = params[key];
    if (value !== undefined)
      for (const item of Array.isArray(value) ? value : [value])
        url.searchParams.append(key, item);
  }
  return hasCallbackPayload(url.toString()) ? url.toString() : null;
}
export function hasCallbackPayload(value: string | null) {
  if (!value) return false;
  try {
    const url = new URL(value),
      fragment = new URLSearchParams(url.hash.slice(1));
    return (
      ["code", "token_hash", "error", "flow"].some((key) =>
        url.searchParams.has(key),
      ) ||
      ["access_token", "refresh_token", "error"].some((key) =>
        fragment.has(key),
      )
    );
  } catch {
    return true;
  }
}

/** Equivalent Linking/router parameter orders share one in-memory exchange.
 * Keep origin, path, values and duplicates: normalization is not validation. */
export function authCallbackKey(value: string) {
  try {
    const url = new URL(value);
    url.searchParams.sort();
    if (url.hash) {
      const fragment = new URLSearchParams(url.hash.slice(1));
      fragment.sort();
      url.hash = fragment.toString();
    }
    return url.toString();
  } catch {
    return value;
  }
}
