/** Apple identity proof boundary. Native email/name are display data, never account keys. */
export type AppleProof = {
  state: string | null;
  identityToken: string | null;
  fullName?: { givenName?: string | null; familyName?: string | null } | null;
};
export class AppleFlowError extends Error {}
export function appleIdentityToken(proof: AppleProof, expectedState: string) {
  if (!expectedState || proof.state !== expectedState || !proof.identityToken)
    throw new AppleFlowError("Apple girişini doğrulayamadık. Yeniden dene.");
  return proof.identityToken;
}
export function appleDisplayName(proof: AppleProof) {
  return [proof.fullName?.givenName, proof.fullName?.familyName]
    .filter((part): part is string => typeof part === "string" && !!part.trim())
    .map((part) => part.trim())
    .join(" ")
    .slice(0, 100);
}
export function appleServerIdentity(
  user: {
    id: string;
    is_anonymous?: boolean;
    email_confirmed_at?: string;
    identities?: { provider: string }[];
  } | null,
  sessionActor: string,
) {
  return (
    !!user &&
    user.id === sessionActor &&
    user.is_anonymous !== true &&
    !!user.email_confirmed_at &&
    !!user.identities?.some((i) => i.provider === "apple")
  );
}
export function appleCapability(data: unknown) {
  if (!data || typeof data !== "object") return false;
  const flags = data as Record<string, unknown>;
  // Do not expose passwordless signup before deletion + Apple token revocation work.
  return (
    flags.appleOAuthEnabled === true &&
    flags.appleDeletionEnabled === true &&
    flags.appleRevocationEnabled === true
  );
}

/** Invalidates pending proof when another verified account signs in or the owner cancels. */
export class AppleAttemptGuard {
  private generation = 0;
  private transferActor: string | null = null;
  start() {
    this.transferActor = null;
    return ++this.generation;
  }
  cancel() {
    this.generation++;
    this.transferActor = null;
  }
  isCurrent(attempt: number) {
    return attempt === this.generation;
  }
  assertCurrent(attempt: number) {
    if (!this.isCurrent(attempt))
      throw new AppleFlowError("Apple girişi iptal edildi.");
  }
  prepareTransfer(attempt: number, actor: string) {
    this.assertCurrent(attempt);
    this.transferActor = actor;
  }
  observeSignIn(actor: string) {
    if (actor !== this.transferActor) this.cancel();
  }
  finish(attempt: number) {
    if (attempt === this.generation) this.transferActor = null;
  }
}
