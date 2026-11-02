import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

// Local operator UI only. This process never receives passwords or session tokens.
export function validateConfig({ url, publishableKey, localTest = false }) {
  const parsed = new URL(url);
  const hosted =
    parsed.protocol === "https:" &&
    /^[a-z0-9]+\.supabase\.co$/.test(parsed.hostname) &&
    !parsed.port;
  const isolated =
    localTest &&
    parsed.protocol === "http:" &&
    parsed.hostname === "127.0.0.1" &&
    Boolean(parsed.port);
  if (
    (!hosted && !isolated) ||
    parsed.username ||
    parsed.password ||
    parsed.search ||
    parsed.hash ||
    parsed.pathname !== "/" ||
    !/^sb_publishable_[A-Za-z0-9_-]+$/.test(publishableKey ?? "")
  )
    throw new Error(
      "Only a Supabase origin and a publishable key are allowed.",
    );
  return { url: parsed.origin, publishableKey };
}

export function createModerationServer(config) {
  const publicConfig = validateConfig(config);
  const files = new Map([
    ["/", ["index.html", "text/html; charset=utf-8"]],
    ["/client.mjs", ["client.mjs", "text/javascript; charset=utf-8"]],
    ["/styles.css", ["styles.css", "text/css; charset=utf-8"]],
  ]);
  return createServer(async (request, response) => {
    const port = response.socket.localPort;
    const host = `127.0.0.1:${port}`;
    const origin = `http://${host}`;
    const headers = {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
      "Cross-Origin-Opener-Policy": "same-origin",
      "Content-Security-Policy": `default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self' ${publicConfig.url}; base-uri 'none'; form-action 'none'; frame-ancestors 'none'`,
    };
    if (
      request.headers.host !== host ||
      (request.headers.origin && request.headers.origin !== origin) ||
      (request.headers["sec-fetch-site"] &&
        !["same-origin", "none"].includes(request.headers["sec-fetch-site"]))
    ) {
      response.writeHead(403, headers).end("Forbidden");
      return;
    }
    if (request.method !== "GET") {
      response.writeHead(405, { ...headers, Allow: "GET" }).end();
      return;
    }
    if (request.url === "/config.json") {
      response
        .writeHead(200, { ...headers, "Content-Type": "application/json" })
        .end(JSON.stringify(publicConfig));
      return;
    }
    const file = files.get(request.url);
    if (!file) {
      response.writeHead(404, headers).end();
      return;
    }
    try {
      const bytes = await readFile(new URL(file[0], import.meta.url));
      response
        .writeHead(200, { ...headers, "Content-Type": file[1] })
        .end(bytes);
    } catch {
      response.writeHead(500, headers).end("Local UI unavailable");
    }
  });
}

if (
  process.argv[1] &&
  pathToFileURL(resolve(process.argv[1])).href === import.meta.url
) {
  const port = Number(process.env.MODERATION_PORT ?? "8136");
  if (!Number.isInteger(port) || port < 1024 || port > 65535)
    throw new Error("Invalid local port");
  createModerationServer({
    url: process.env.MODERATION_SUPABASE_URL,
    publishableKey: process.env.MODERATION_PUBLISHABLE_KEY,
    localTest: process.env.MODERATION_LOCAL_TEST === "1",
  }).listen(port, "127.0.0.1", () => {
    console.log(`Local moderator console: http://127.0.0.1:${port}`);
  });
}
