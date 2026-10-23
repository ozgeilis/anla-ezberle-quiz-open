import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";

// Yalnızca yerel, dışa aktarılmış web önizlemesi; oyun API'si veya online servis değildir.
const root = resolve("dist");
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css",
  ".json": "application/json",
  ".ttf": "font/ttf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".wav": "audio/wav",
};
createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
    const file = resolve(root, `.${pathname}`);
    if (file !== root && !file.startsWith(root + sep)) {
      response.writeHead(403).end();
      return;
    }
    const target =
      pathname === "/" || !extname(pathname)
        ? resolve(root, "index.html")
        : file;
    const bytes = await readFile(target);
    response
      .writeHead(200, {
        "Content-Type": types[extname(target)] ?? "application/octet-stream",
        "Cache-Control": "no-store",
      })
      .end(bytes);
  } catch {
    response.writeHead(404).end("Dosya bulunamadı.");
  }
}).listen(8117, "127.0.0.1", () =>
  console.log("Yerel önizleme: http://127.0.0.1:8117"),
);
