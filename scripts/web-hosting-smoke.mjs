// Read-only checks against the actual public hosting URL. Never sends credentials.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const origin = new URL(process.argv[2] ?? "");
assert.equal(origin.protocol, "https:");
assert(origin.hostname.endsWith(".vercel.app"));
assert(!origin.username && !origin.password && !origin.search && !origin.hash);
const routes = [
  "/",
  "/profile",
  "/achievements",
  "/categories",
  "/ranking",
  "/online",
  "/online/auth",
  "/live",
  "/settings",
  "/online/inbox",
  "/online/invitations",
];
let home;
for (const path of routes) {
  const response = await fetch(new URL(path, origin), { redirect: "manual" });
  assert.equal(response.status, 200, `Direct route failed: ${path}`);
  assert(response.headers.get("content-type")?.includes("text/html"));
  assert(response.headers.get("x-robots-tag")?.includes("noindex"));
  assert.equal(response.headers.get("referrer-policy"), "no-referrer");
  const html = await response.text();
  assert(
    html.includes("Anla &amp; Ezberle") || html.includes("Anla & Ezberle"),
  );
  assert(!/vercel.*authentication required/i.test(html));
  if (path === "/") home = html;
}
const assets = [
  ...home.matchAll(/(?:src|href)=["']([^"']+\.(?:js|css)(?:\?[^"']*)?)["']/g),
]
  .map((match) => new URL(match[1], origin))
  .filter((url) => url.origin === origin.origin);
assert(assets.some((url) => url.pathname.endsWith(".js")));
for (const url of assets) {
  const response = await fetch(url);
  assert.equal(response.status, 200);
  assert(!response.headers.get("content-type")?.includes("text/html"));
}
const assetManifestResponse = await fetch(new URL("/web-assets.json", origin));
assert.equal(assetManifestResponse.status, 200);
const assetManifest = await assetManifestResponse.json();
const topicResponse = await fetch(new URL("/topic-manifest.json", origin));
assert.equal(topicResponse.status, 200);
assert(topicResponse.headers.get("content-type")?.includes("application/json"));
const deployedTopics = await topicResponse.json();
assert.deepEqual(
  deployedTopics,
  JSON.parse(readFileSync("dist/topic-manifest.json", "utf8")),
  "Production must serve the topic counts from this tested build",
);
assert.equal(deployedTopics.bankVersion, 73);
assert.equal(deployedTopics.topicVersion, 3);
assert.equal(deployedTopics.topics.length, 6);
assert.equal(deployedTopics.categoryVersion, 2);
assert.equal(deployedTopics.children.playable, false);
assert.equal(deployedTopics.children.includedInTotal, false);
assert.equal(deployedTopics.total, 1500);
assert.equal(
  deployedTopics.topics.reduce((sum, t) => sum + t.count, 0),
  1500,
);
assert.equal(assetManifest.filter((a) => a.path.endsWith(".ttf")).length, 6);
for (const asset of assetManifest) {
  for (const path of [asset.path, asset.destination]) {
    const response = await fetch(new URL(path, origin));
    assert.equal(response.status, 200, "Exported font/image route failed");
    assert(!response.headers.get("content-type")?.includes("text/html"));
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (path.endsWith(".ttf"))
      assert(
        bytes[0] === 0 && bytes[1] === 1 && bytes[2] === 0 && bytes[3] === 0,
        "Expected actual TrueType bytes, not an SPA fallback",
      );
  }
}
console.log(
  JSON.stringify({
    origin: origin.origin,
    directRoutes: routes.length,
    assetsChecked: assets.length,
    fontAndImageRoutes: assetManifest.length * 2,
    publicAccess: true,
    bankVersion: deployedTopics.bankVersion,
    topicVersion: deployedTopics.topicVersion,
    topicTotal: deployedTopics.total,
    note: "HTTP/asset acceptance only; authentication, gameplay and browser layout require separate checks.",
  }),
);
