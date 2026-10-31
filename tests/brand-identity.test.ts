import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import config from "../app.json";
import listing from "../store/google-play/tr-TR/listing.json";
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
  assert.equal(listing.title, "Anla & Ezberle: İslami Quiz");
  assert.equal([...listing.title].length, 27);
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
  png("store/google-play/icon-512.png", 512);
  png(config.expo.ios.icon, 1024);
  png(config.expo.web.favicon, 64);
});
