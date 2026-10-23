import assert from "node:assert/strict";
import { test } from "node:test";
import {
  avatarCatalog,
  avatarName,
  isAvatarId,
} from "../src/domain/profile/avatars";
import { emptyData, parseData } from "../src/storage/schema";
import { persistChange } from "../src/storage/persist";
import { progress } from "../src/domain/scoring/progress";
import { GameRecord, stats } from "../src/domain/game/engine";

const legacy: GameRecord = {
  id: "quiz-legacy-personalization",
  bankVersion: 1,
  mode: "mixed",
  questionIds: [
    "quran-001",
    "quran-002",
    "quran-003",
    "quran-004",
    "quran-005",
    "prophets-001",
    "prophets-002",
    "prophets-003",
    "prophets-004",
    "prophets-005",
  ],
  startedAt: 1792324800000,
  completedAt: 1792324830000,
  answers: [1, 2, 3, 0, 1, 2, 1, 0, 2, 3].map((option, i) => ({
    questionId: [
      "quran-001",
      "quran-002",
      "quran-003",
      "quran-004",
      "quran-005",
      "prophets-001",
      "prophets-002",
      "prophets-003",
      "prophets-004",
      "prophets-005",
    ][i]!,
    option,
    at: 1792324800000 + (i + 1) * 3000,
  })),
};
test("avatar IDs remain append-only and every saved legacy/new avatar reloads", () => {
  assert.deepEqual(
    avatarCatalog.map((a) => a.id),
    Array.from({ length: 12 }, (_, i) => i),
  );
  for (const { id } of avatarCatalog) {
    const data = emptyData();
    data.profile.avatar = id;
    assert.equal(parseData(JSON.stringify(data)).profile.avatar, id);
  }
  for (const id of [-1, 12, 4.5, "4", null, NaN])
    assert.equal(isAvatarId(id), false);
  assert.equal(avatarName(999), avatarName(0));
});
test("saving a new avatar/theme preserves completed games, score, XP and showcase", async () => {
  const current = { ...emptyData(), games: [legacy], showcase: ["first_game"] };
  const before = JSON.stringify(current);
  let stored = "";
  const next = await persistChange(
    current,
    (data) => ({
      ...data,
      profile: { ...data.profile, avatar: 11, theme: "dark" },
    }),
    async (value) => {
      stored = value;
    },
  );
  assert.equal(JSON.stringify(current), before);
  assert.equal(next.profile.avatar, 11);
  assert.equal(parseData(stored).profile.theme, "dark");
  assert.deepEqual(next.games, current.games);
  assert.deepEqual(next.showcase, current.showcase);
  assert.equal(stats(next.games[0]!).score, 600);
  assert.equal(progress(next.games).xp, 60);
});
test("failed preference persistence leaves prior avatar/theme and stored bytes intact", async () => {
  const current = emptyData();
  let stored = JSON.stringify(current);
  const before = stored;
  await assert.rejects(
    persistChange(
      current,
      (data) => ({
        ...data,
        profile: { ...data.profile, avatar: 7, theme: "dark" },
      }),
      async () => {
        throw new Error("Storage unavailable");
      },
    ),
  );
  assert.equal(JSON.stringify(current), before);
  assert.equal(stored, before);
  stored = JSON.stringify(
    await persistChange(
      current,
      (data) => ({
        ...data,
        profile: { ...data.profile, avatar: 7, theme: "dark" },
      }),
      async () => {},
    ),
  );
  assert.equal(parseData(stored).profile.avatar, 7);
});
test("invalid preferences never reach storage", async () => {
  let writes = 0;
  await assert.rejects(
    persistChange(
      emptyData(),
      (data) => ({ ...data, profile: { ...data.profile, avatar: 12 } }),
      async () => {
        writes++;
      },
    ),
  );
  assert.equal(writes, 0);
});

test("the saved state is not published while a storage write is pending", async () => {
  const current = emptyData();
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  let published = current;
  const pending = persistChange(
    current,
    (data) => ({ ...data, profile: { ...data.profile, theme: "dark" } }),
    () => gate,
  ).then((next) => {
    published = next;
  });
  await Promise.resolve();
  assert.equal(published, current);
  release();
  await pending;
  assert.equal(published.profile.theme, "dark");
});
