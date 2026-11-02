// No Apple token is returned to the caller or stored without authenticated encryption.
export interface AppleDeletionJob {
  stage: "proof" | "token" | "revoked";
  nonceHash: string;
  appleSubject: string;
  ciphertext: string | null;
  lease: string;
}
export interface AppleDeletionStore {
  begin(actor: string, nonceHash: string): Promise<string>;
  claim(actor: string, challenge: string): Promise<AppleDeletionJob | null>;
  save(
    actor: string,
    challenge: string,
    lease: string,
    stage: "token" | "revoked",
    ciphertext: string | null,
  ): Promise<void>;
  release(actor: string, challenge: string, lease: string): Promise<void>;
}
export class AppleDeletionError extends Error {
  constructor(
    public readonly code:
      | "APPLE_FRESH_PROOF_REQUIRED"
      | "APPLE_RETRY_REQUIRED"
      | "APPLE_PROOF_INVALID"
      | "APPLE_DELETION_UNAVAILABLE",
  ) {
    super(code);
  }
}
export interface AppleDeletionDependencies {
  store: AppleDeletionStore;
  verify(token: string, subject: string, nonceHash: string): Promise<void>;
  exchange(
    code: string,
  ): Promise<{ identityToken: string; refreshToken: string }>;
  revoke(token: string): Promise<void>;
  encrypt(token: string, context: string): Promise<string>;
  decrypt(envelope: string, context: string): Promise<string>;
  erase(actor: string): Promise<boolean>;
}
export function appleDeletionProof(deps: AppleDeletionDependencies) {
  return {
    async begin(actor: string) {
      const nonce = crypto.randomUUID() + crypto.randomUUID();
      const digest = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(nonce),
      );
      const nonceHash = Array.from(new Uint8Array(digest), (b) =>
        b.toString(16).padStart(2, "0"),
      ).join("");
      const challenge = await deps.store.begin(actor, nonceHash);
      return { challenge, nonce };
    },
    async erase(
      actor: string,
      subject: string,
      challenge: string,
      proof?: { identityToken: string; authorizationCode: string },
    ) {
      if (!/^[0-9a-f-]{36}$/i.test(challenge))
        throw new AppleDeletionError("APPLE_PROOF_INVALID");
      const job = await deps.store.claim(actor, challenge);
      if (!job) throw new AppleDeletionError("APPLE_FRESH_PROOF_REQUIRED");
      if (job.appleSubject !== subject) {
        await deps.store.release(actor, challenge, job.lease);
        throw new AppleDeletionError("APPLE_PROOF_INVALID");
      }
      const context = `${actor}:${challenge}`;
      let stage = job.stage;
      try {
        if (stage === "proof") {
          if (
            !proof ||
            !proof.authorizationCode ||
            proof.authorizationCode.length > 2048 ||
            !proof.identityToken ||
            proof.identityToken.length > 8192
          )
            throw new AppleDeletionError("APPLE_FRESH_PROOF_REQUIRED");
          // Verify the native proof before exchanging a single-use code.
          await deps.verify(proof.identityToken, subject, job.nonceHash);
          let tokens;
          try {
            tokens = await deps.exchange(proof.authorizationCode);
          } catch {
            throw new AppleDeletionError("APPLE_FRESH_PROOF_REQUIRED");
          }
          await deps.verify(tokens.identityToken, subject, job.nonceHash);
          const encrypted = await deps.encrypt(tokens.refreshToken, context);
          await deps.store.save(
            actor,
            challenge,
            job.lease,
            "token",
            encrypted,
          );
          job.ciphertext = encrypted;
          stage = "token";
        }
        if (stage === "token") {
          if (!job.ciphertext)
            throw new AppleDeletionError("APPLE_PROOF_INVALID");
          await deps.revoke(await deps.decrypt(job.ciphertext, context));
          // Clear ciphertext after success. A lost save can safely repeat Apple's idempotent revoke.
          await deps.store.save(actor, challenge, job.lease, "revoked", null);
          stage = "revoked";
        }
        if (!(await deps.erase(actor)))
          throw new AppleDeletionError("APPLE_RETRY_REQUIRED");
        return true;
      } catch (error) {
        if (error instanceof AppleDeletionError) throw error;
        throw new AppleDeletionError(
          stage === "proof" ? "APPLE_PROOF_INVALID" : "APPLE_RETRY_REQUIRED",
        );
      } finally {
        // Best effort only: the short lease also recovers a terminated Edge worker.
        await deps.store
          .release(actor, challenge, job.lease)
          .catch(() => undefined);
      }
    },
  };
}
