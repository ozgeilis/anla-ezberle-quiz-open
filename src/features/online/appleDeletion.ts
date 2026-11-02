import {
  randomUUID,
  digestStringAsync,
  CryptoDigestAlgorithm,
} from "expo-crypto";
import { appleNativeAvailable } from "./appleAuth";
import { appleIdentityToken } from "./appleFlow";
import { onlineClient } from "./client";
export class AppleDeletionFailure extends Error {
  constructor(
    public readonly retryable: boolean,
    message: string,
  ) {
    super(message);
  }
}
async function call(actor: string, body: object) {
  const client = onlineClient();
  const session = await client?.auth.getSession();
  if (!client || session?.error || session?.data.session?.user.id !== actor)
    throw new AppleDeletionFailure(
      false,
      "Aktif hesap değişti. Yeniden giriş yap.",
    );
  const { data, error } = await client.functions.invoke("account-delete", {
    body,
  });
  if (error) {
    let code = "";
    try {
      if ("context" in error && error.context instanceof Response) {
        const value: unknown = await error.context.json();
        if (
          value &&
          typeof value === "object" &&
          "error" in value &&
          typeof value.error === "string"
        )
          code = value.error;
      }
    } catch {
      /* No raw transport details reach UI/logs. */
    }
    if (code === "APPLE_FRESH_PROOF_REQUIRED" || code === "APPLE_PROOF_INVALID")
      throw new AppleDeletionFailure(
        false,
        "Yeni Apple kimlik doğrulaması gerekiyor. Tekrar dene.",
      );
    if (code === "APPLE_DELETION_UNAVAILABLE")
      throw new AppleDeletionFailure(
        false,
        "Apple hesap silme servisi henüz hazır değil. Hesabında işlem yapılmadı.",
      );
    throw new AppleDeletionFailure(
      true,
      "Silme tamamlandığı doğrulanamadı. Aynı işlemi yeniden dene; giriş yapamıyorsan destek adresine ulaş.",
    );
  }
  const latest = await client.auth.getSession();
  if (latest.data.session && latest.data.session.user.id !== actor)
    throw new AppleDeletionFailure(
      false,
      "Aktif hesap değişti; yeni hesabına dokunulmadı.",
    );
  return data;
}
export async function beginAppleDeletion(actor: string) {
  if (!(await appleNativeAvailable()))
    throw new AppleDeletionFailure(
      false,
      "Apple ile açılmış hesabını Apple girişini destekleyen iPhone uygulamasından silebilirsin. Destek adresimizden de yardım isteyebilirsin.",
    );
  const data = await call(actor, { operation: "apple-begin" });
  if (typeof data?.challenge !== "string" || typeof data?.nonce !== "string")
    throw new AppleDeletionFailure(false, "Apple doğrulaması başlatılamadı.");
  return { challenge: data.challenge as string, nonce: data.nonce as string };
}
export async function proveAppleDeletion(
  actor: string,
  attempt: { challenge: string; nonce: string },
) {
  const Apple = await import("expo-apple-authentication");
  const state = randomUUID();
  let proof;
  try {
    proof = await Apple.signInAsync({
      state,
      nonce: await digestStringAsync(
        CryptoDigestAlgorithm.SHA256,
        attempt.nonce,
      ),
    });
  } catch {
    throw new AppleDeletionFailure(
      false,
      "Apple doğrulaması tamamlanmadı veya iptal edildi. Hesabın silinmedi.",
    );
  }
  const identityToken = appleIdentityToken(proof, state);
  if (!proof.authorizationCode)
    throw new AppleDeletionFailure(
      false,
      "Apple doğrulama kodu alınamadı. Tekrar dene.",
    );
  const result = await call(actor, {
    operation: "apple-delete",
    confirmation: "DELETE",
    challenge: attempt.challenge,
    identityToken,
    authorizationCode: proof.authorizationCode,
  });
  if (result?.deleted !== true)
    throw new AppleDeletionFailure(
      true,
      "Silme doğrulanamadı. Aynı işlemi yeniden dene.",
    );
}
export async function retryAppleDeletion(actor: string, challenge: string) {
  const data = await call(actor, {
    operation: "apple-delete",
    confirmation: "DELETE",
    challenge,
  });
  if (data?.deleted !== true)
    throw new AppleDeletionFailure(true, "Silme doğrulanamadı. Yeniden dene.");
}
