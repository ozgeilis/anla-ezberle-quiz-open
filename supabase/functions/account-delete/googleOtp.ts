/** Request-local Auth OTP proof. Never trusts a caller-supplied email/actor. */
export interface GoogleOtpDependencies {
  create(actor: string): Promise<string>;
  send(email: string): Promise<boolean>;
  claim(actor: string, challenge: string): Promise<boolean>;
  verify(email: string, code: string): Promise<string | null>;
}
export function googleOtpProof(deps: GoogleOtpDependencies) {
  return {
    async send(actor: string, email: string) {
      const challenge = await deps.create(actor);
      if (!(await deps.send(email))) throw Error("OTP_SEND_FAILED");
      return challenge;
    },
    async verify(
      actor: string,
      email: string,
      challenge: string,
      code: string,
    ) {
      if (!/^[0-9a-f-]{36}$/i.test(challenge) || !/^\d{8}$/.test(code))
        return false;
      if (!(await deps.claim(actor, challenge))) return false;
      return (await deps.verify(email, code)) === actor;
    },
  };
}
