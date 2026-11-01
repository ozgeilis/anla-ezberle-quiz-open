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
  return hasCallbackPayload(url.toString()) || url.searchParams.has("flow")
    ? url.toString()
    : null;
}
/** Prefer the original intent, including a provider's error fragment. Router
 * markers alone are not credentials and must not consume the pending verifier.
 * Ignore an older Linking URL when the current route identifies another flow. */
export function nativeCallbackUrl(
  incoming: string | null,
  route: string | null,
) {
  if (hasCallbackPayload(incoming)) {
    try {
      const raw = new URL(incoming!);
      const expected = route ? new URL(route) : null;
      const identityKeys = [
        "flow",
        "attempt",
        "code",
        "token_hash",
        "purpose",
        "type",
      ];
      if (
        !expected ||
        (raw.protocol === expected.protocol &&
          raw.host === expected.host &&
          raw.pathname === expected.pathname &&
          identityKeys.every(
            (key) =>
              !expected.searchParams.has(key) ||
              JSON.stringify(raw.searchParams.getAll(key)) ===
                JSON.stringify(expected.searchParams.getAll(key)),
          ))
      )
        return incoming;
    } catch {
      /* Let the route's normal validator report an invalid payload. */
    }
  }
  return hasCallbackPayload(route) ? route : null;
}
export function hasCallbackPayload(value: string | null) {
  if (!value) return false;
  try {
    const url = new URL(value),
      fragment = new URLSearchParams(url.hash.slice(1));
    return (
      ["code", "token_hash", "error"].some((key) =>
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
    const fragment = new URLSearchParams(url.hash.slice(1));
    // Router can expose a denial fragment as query params. Only diagnostic
    // errors are equivalent; never normalize credentials or mixed proof.
    if (
      url.searchParams.get("flow") === "google" &&
      !["code", "token_hash", "error"].some((key) =>
        url.searchParams.has(key),
      ) &&
      fragment.getAll("error").length === 1 &&
      [...fragment.keys()].every((key) =>
        ["error", "error_code", "error_description"].includes(key),
      )
    ) {
      for (const [key, item] of fragment) url.searchParams.append(key, item);
      url.hash = "";
    }
    url.searchParams.sort();
    if (url.hash) {
      fragment.sort();
      url.hash = fragment.toString();
    }
    return url.toString();
  } catch {
    return value;
  }
}
