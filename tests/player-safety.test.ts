import assert from "node:assert/strict";
import { test } from "node:test";
import {
  reportReasons,
  reportDetailsError,
  profileContentError,
} from "../src/features/online/safety/rules";
import { usernameError } from "../src/features/online/usernames";
import { displayNameError } from "../src/features/online/identity";
test("common safety reasons and bounded details; never add identifying fields to complaint payload", () => {
  assert.deepEqual(
    reportReasons.map((r) => r.value),
    ["inappropriate_name", "harassment", "spam", "other"],
  );
  assert.equal(reportDetailsError("Kısa açıklama"), null);
  assert(reportDetailsError("x".repeat(501)));
  assert(reportDetailsError("control\ntext"));
});
test("profile and username guidance catches normalization, separated profanity and invisible controls", () => {
  for (const value of [
    "SİKTİR",
    "s.i.k.t.i.r",
    "f u c k",
    "a.m.k",
    "Oyuncu\u200b",
  ])
    assert(profileContentError(value), value);
  assert(usernameError("siktir_1"));
  assert(displayNameError("s.i.k.t.i.r"));
  for (const value of ["Ayşe", "Özge", "Mehmet", "Nazım", "Oyuncu 01"])
    assert.equal(profileContentError(value), null);
});
