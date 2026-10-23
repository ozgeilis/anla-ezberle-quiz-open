import assert from "node:assert/strict";
import { test } from "node:test";
import {
  challengeStatus,
  newestFirst,
  notificationTime,
} from "../src/features/online/notifications";
import type { DirectChallenge } from "../src/features/online/types";
const now = Date.parse("2026-10-22T12:00:00Z");
const invite: DirectChallenge = {
  id: "invite",
  incoming: true,
  state: "pending",
  createdAt: new Date(now - 60000).toISOString(),
  expiresAt: new Date(now + 60000).toISOString(),
  matchId: null,
  matchState: null,
  player: null,
};
test("only unexpired pending invitations expose authorized direction-specific actions", () => {
  assert.deepEqual(challengeStatus(invite, now), {
    title: "Sana meydan okuyor",
    canReply: true,
    canCancel: false,
  });
  assert.equal(
    challengeStatus({ ...invite, incoming: false }, now).canCancel,
    true,
  );
  for (const state of [
    "accepted",
    "declined",
    "cancelled",
    "expired",
  ] as const) {
    const s = challengeStatus({ ...invite, state }, now);
    assert(!s.canReply && !s.canCancel);
  }
  for (const expiresAt of [
    new Date(now).toISOString(),
    new Date(now - 1).toISOString(),
    "invalid",
  ]) {
    const s = challengeStatus({ ...invite, expiresAt }, now);
    assert(!s.canReply && !s.canCancel);
  }
});
test("notification ordering is newest-first without mutating the provider snapshot", () => {
  const list = [
    { id: "old", createdAt: "2026-10-21" },
    { id: "new", createdAt: "2026-10-22" },
  ];
  assert.deepEqual(
    newestFirst(list).map((n) => n.id),
    ["new", "old"],
  );
  assert.equal(list[0]!.id, "old");
  assert.equal(
    notificationTime(new Date(now - 5 * 60000).toISOString(), now),
    "5 dk",
  );
  assert.equal(
    notificationTime(new Date(now - 2 * 3600000).toISOString(), now),
    "2 sa",
  );
  assert.equal(
    notificationTime(new Date(now + 3600000).toISOString(), now),
    "Az önce",
  );
  assert.equal(notificationTime("invalid", now), "Tarih yok");
});
