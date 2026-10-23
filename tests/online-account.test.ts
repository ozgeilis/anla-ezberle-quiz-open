import assert from "node:assert/strict";
import { test } from "node:test";
import {
  passwordError,
  authMessage,
  authFailureMessage,
  validEmail,
  verifiedAccount,
} from "../src/features/online/account";
test("account passwords enforce server-compatible bounds and character classes", () => {
  for (const value of [
    "",
    "Aa1!short",
    "a".repeat(12),
    "Abcdefghijk!",
    "1234567890A!",
    "Aa1!" + "x".repeat(125),
  ])
    assert.ok(passwordError(value));
  assert.equal(passwordError("Sample_42_Strong!"), null);
  assert.equal(passwordError("Aa1!" + "x".repeat(124)), null);
});
test("account errors explain mail readiness and expired confirmation without exposing server details", () => {
  assert.match(authMessage("email_address_not_authorized"), /servisi/);
  assert.match(authMessage("otp_expired"), /süresi/);
  assert.match(authMessage("signup_disabled"), /açılmadı/);
  assert.match(authMessage("over_email_send_rate_limit"), /sınırına/);
  assert.equal(authMessage("secret_backend_error"), authMessage(undefined));
});

test("only confirmed non-anonymous accounts expose online identity", () => {
  assert.equal(verifiedAccount(null), false);
  assert.equal(verifiedAccount({}), false);
  assert.equal(
    verifiedAccount({ email_confirmed_at: "2026-10-21", is_anonymous: true }),
    false,
  );
  assert.equal(
    verifiedAccount({ email_confirmed_at: "2026-10-21", is_anonymous: false }),
    true,
  );
});
test("email validation rejects whitespace, missing domain and oversized addresses", () => {
  for (const value of [
    "",
    "name",
    "a@b",
    "a b@example.com",
    "x".repeat(255) + "@example.com",
  ])
    assert.equal(validEmail(value), false);
  assert.equal(validEmail("  player+auth-test@example.invalid  "), true);
});
test("auth failures have actionable Turkish text without server internals", () => {
  assert.match(authMessage("invalid_credentials"), /eşleşmedi/);
  assert.match(authMessage("unexpected_failure"), /gönderim|Gönderim/);
  assert.match(authMessage("over_request_rate_limit"), /Çok fazla/);
  assert.match(authMessage("same_password"), /aynı olamaz/);
  assert.match(authMessage("flow_state_expired"), /süresi doldu/);
  assert.match(
    authMessage("reauthentication_needed"),
    /yeni bir şifre sıfırlama/,
  );
});

test("Auth error status fallbacks keep rate limits and network failures actionable", () => {
  assert.match(
    authFailureMessage({ status: 429 }, true),
    /E-posta gönderim sınırına/,
  );
  assert.match(authFailureMessage({ status: 429 }), /Çok fazla/);
  assert.match(authFailureMessage({ status: 0 }), /Bağlantını/);
  assert.match(authFailureMessage({ status: 503 }), /geçici/);
});
