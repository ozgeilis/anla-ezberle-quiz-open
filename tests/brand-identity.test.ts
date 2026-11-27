import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import config from "../app.json";
import listing from "../store/google-play/tr-TR/listing.json";
import appleListing from "../store/app-store/tr-TR/listing.json";
import assets from "../config/brand-assets.json";
import { createHash } from "node:crypto";
import { brand } from "../src/branding/identity";
import { tr } from "../src/localization/tr";

test("launcher and store identity stay separate with the approved Android identity and unchanged callbacks", () => {
  assert.equal(config.expo.name, brand.title);
  assert.equal(config.expo.web.name, brand.title);
  assert.equal(config.expo.slug, "anla-ezberle-quiz");
  assert.equal(config.expo.scheme, "anla-ezberle-quiz");
  assert.equal(config.expo.android.package, "com.kovynelstudio.anlaezberle");
  assert.equal(
    config.expo.ios.bundleIdentifier,
    "com.anlaezberle.quiz.prototype",
  );
  assert.equal(brand.title, "İslami Quiz");
  assert.equal(brand.titleLines.join(" "), brand.title);
  assert.equal(listing.title, brand.title);
  assert.equal(appleListing.name, brand.title);
  assert([...appleListing.subtitle].length <= 30);
  assert(Buffer.byteLength(appleListing.keywords, "utf8") <= 100);
  assert(appleListing.description.includes(brand.legacyTitle));
  assert(listing.fullDescription.includes(brand.legacyTitle));
  assert.equal(appleListing.targetVersion, "0.1.2");
  assert.equal(
    appleListing.marketingUrl,
    "https://anla-ezberle-quiz.vercel.app",
  );
  assert.equal(
    appleListing.privacyUrl,
    "https://anla-ezberle-quiz.vercel.app/privacy",
  );
  assert.equal(
    appleListing.supportUrl,
    "https://anla-ezberle-quiz.vercel.app/settings/help",
  );
  assert([...listing.title].length <= 30);
  assert.equal(
    listing.shortDescription,
    "Kur’an, siyer ve daha fazlasında bilgini sına; öğren, yarış, rozet kazan!",
  );
  assert([...listing.shortDescription].length <= 80);
  assert.equal(listing.developerName, brand.developer);
  assert.equal(listing.status, "draft_not_published");
  assert.equal(tr.title, brand.title);
  assert.equal(tr.subtitle, "İslami Bilgi Yarışması");
  assert.equal(tr.slogan, brand.slogan);
});
test("native splash and adaptive icon have real high-resolution assets and light/dark configuration", () => {
  const splash = config.expo.plugins.find(
    (p) => Array.isArray(p) && p[0] === "expo-splash-screen",
  ) as [
    string,
    {
      image: string;
      imageWidth: number;
      backgroundColor: string;
      dark: { image: string; backgroundColor: string };
    },
  ];
  assert(splash);
  assert.equal(splash[1].backgroundColor, "#FFFFFF");
  assert.equal(splash[1].dark.backgroundColor, "#FFFFFF");
  assert.equal(splash[1].imageWidth, 240);
  assert.equal(config.expo.android.adaptiveIcon.backgroundColor, "#FFFFFF");
  const png = (file: string, size: number) => {
    const b = readFileSync(file);
    assert.equal(b.subarray(1, 4).toString(), "PNG");
    assert.equal(b.readUInt32BE(16), size);
    assert.equal(b.readUInt32BE(20), size);
  };
  for (const file of [
    config.expo.icon,
    config.expo.android.adaptiveIcon.foregroundImage,
    splash[1].image,
    splash[1].dark.image,
  ])
    png(file, 1024);
  png(assets.outputs.playStore, 512);
  png(assets.outputs.playStoreAlias, 512);
  const iosIcon = readFileSync(assets.outputs.icon);
  assert.equal(iosIcon[25], 2, "iOS uses opaque RGB, never alpha");
  const playIcon = readFileSync(assets.outputs.playStore);
  assert.equal(playIcon[24], 8);
  assert.equal(playIcon[25], 6, "Play uses a 32-bit RGBA PNG");
  assert(playIcon.length <= 1024 * 1024);
  assert.equal(config.expo.icon, `./${assets.outputs.icon}`);
  assert.equal(
    config.expo.android.adaptiveIcon.foregroundImage,
    `./${assets.outputs.adaptiveForeground}`,
  );
  assert.equal(config.expo.web.favicon, `./${assets.outputs.favicon}`);
  assert.equal(splash[1].image, `./${assets.outputs.splash}`);
  assert.equal(
    createHash("sha256").update(readFileSync(assets.source)).digest("hex"),
    assets.sourceSha256,
  );
  png(config.expo.ios.icon, 1024);
  png(config.expo.web.favicon, 64);
});
