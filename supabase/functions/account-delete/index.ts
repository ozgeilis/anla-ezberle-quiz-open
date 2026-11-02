import { createClient } from "npm:@supabase/supabase-js@2.118.0";
import { deletionHandler } from "./handler.ts";
import { googleOtpProof } from "./googleOtp.ts";
import { appleDeletionService } from "./appleService.ts";
import { eraseAccount } from "./erase.ts";
// Same server-managed key resolution as the duel API; never bundled with Expo.
function key(map: string, single: string, legacy: string) {
  const raw = Deno.env.get(map);
  if (raw) {
    const values = JSON.parse(raw);
    const found =
      values.default ??
      Object.values(values).find(
        (v) =>
          typeof v === "string" &&
          v.startsWith(
            map.includes("SECRET") ? "sb_secret_" : "sb_publishable_",
          ),
      );
    if (typeof found === "string") return found;
  }
  const found = Deno.env.get(single) ?? Deno.env.get(legacy);
  if (!found) throw Error("Server configuration missing");
  return found;
}
Deno.serve(async (req: Request) => {
  try {
    const options = {
      auth: { persistSession: false, autoRefreshToken: false },
    };
    const client = createClient(
      Deno.env.get("SUPABASE_URL")!,
      key(
        "SUPABASE_PUBLISHABLE_KEYS",
        "SUPABASE_PUBLISHABLE_KEY",
        "SUPABASE_ANON_KEY",
      ),
      options,
    );
    const adminClient = () =>
      createClient(
        Deno.env.get("SUPABASE_URL")!,
        key(
          "SUPABASE_SECRET_KEYS",
          "SUPABASE_SECRET_KEY",
          "SUPABASE_SERVICE_ROLE_KEY",
        ),
        options,
      );
    const erase = async (actor: string) => {
      const admin = createClient(
        Deno.env.get("SUPABASE_URL")!,
        key(
          "SUPABASE_SECRET_KEYS",
          "SUPABASE_SECRET_KEY",
          "SUPABASE_SERVICE_ROLE_KEY",
        ),
        options,
      );
      const { data: userData, error: userError } =
        await admin.auth.admin.getUserById(actor);
      if (userError || !userData.user?.email) return false;
      return eraseAccount(
        {
          async files(id) {
            const { data, error } = await admin.rpc(
              "account_deletion_storage",
              { actor: id },
            );
            if (error || !Array.isArray(data?.files))
              throw new Error("Storage preflight failed");
            return data.files;
          },
          async remove(bucket, names) {
            const { error } = await admin.storage.from(bucket).remove(names);
            if (error) throw new Error("Storage deletion failed");
          },
          async prepare(id) {
            const { data, error } = await admin.rpc(
              "prepare_account_deletion",
              { actor: id },
            );
            return !error && data?.ready === true;
          },
          async deleteAuth(id) {
            const { error } = await admin.auth.admin.deleteUser(id, false);
            return !error;
          },
          async verify(id, email) {
            const { data, error } = await admin.rpc("verify_account_deletion", {
              actor: id,
              prior_email: email,
            });
            return !error && data?.deleted === true;
          },
        },
        actor,
        userData.user.email,
      );
    };
    const rpc = async (name: string, args: Record<string, unknown>) => {
      const { data, error } = await adminClient().rpc(name, args);
      if (error) throw Error("APPLE_DELETION_UNAVAILABLE");
      return data;
    };
    const createApple = () =>
      appleDeletionService(
        (name) => Deno.env.get(name),
        {
          begin: (actor, nonceHash) =>
            rpc("begin_apple_deletion", { actor, nonce_hash: nonceHash }),
          claim: (actor, challenge) =>
            rpc("claim_apple_deletion", { actor, challenge }),
          async save(actor, challenge, lease, stage, ciphertext) {
            if (
              (await rpc("save_apple_deletion", {
                actor,
                challenge,
                lease_id: lease,
                next_stage: stage,
                encrypted_token: ciphertext,
              })) !== true
            )
              throw Error("APPLE_SAVE_FAILED");
          },
          async release(actor, challenge, lease) {
            await rpc("release_apple_deletion", {
              actor,
              challenge,
              lease_id: lease,
            });
          },
        },
        erase,
      );
    // Misconfigured Apple secrets must not take down password/Google erasure.
    const apple =
      Deno.env.get("APPLE_ACCOUNT_DELETION_ENABLED") === "true"
        ? {
            begin: (actor: string) => createApple().begin(actor),
            erase: (
              ...args: Parameters<ReturnType<typeof createApple>["erase"]>
            ) => createApple().erase(...args),
          }
        : undefined;
    try {
      return await deletionHandler({
        apple,
        googleOtp:
          Deno.env.get("GOOGLE_ACCOUNT_DELETION_ENABLED") === "true"
            ? googleOtpProof({
                async create(actor) {
                  const admin = createClient(
                    Deno.env.get("SUPABASE_URL")!,
                    key(
                      "SUPABASE_SECRET_KEYS",
                      "SUPABASE_SECRET_KEY",
                      "SUPABASE_SERVICE_ROLE_KEY",
                    ),
                    options,
                  );
                  const { data, error } = await admin.rpc(
                    "begin_google_deletion",
                    { actor },
                  );
                  if (error || typeof data !== "string")
                    throw Error("REAUTH_UNAVAILABLE");
                  return data;
                },
                async send(email) {
                  const { error } = await client.auth.signInWithOtp({
                    email,
                    options: { shouldCreateUser: false },
                  });
                  return !error;
                },
                async claim(actor, challenge) {
                  const admin = createClient(
                    Deno.env.get("SUPABASE_URL")!,
                    key(
                      "SUPABASE_SECRET_KEYS",
                      "SUPABASE_SECRET_KEY",
                      "SUPABASE_SERVICE_ROLE_KEY",
                    ),
                    options,
                  );
                  const { data, error } = await admin.rpc(
                    "claim_google_deletion",
                    { actor, challenge },
                  );
                  return !error && data === true;
                },
                async verify(email, token) {
                  const { data, error } = await client.auth.verifyOtp({
                    email,
                    token,
                    type: "email",
                  });
                  return error ? null : (data.user?.id ?? null);
                },
              })
            : undefined,
        async user(jwt) {
          const { data, error } = await client.auth.getUser(jwt);
          if (error || !data.user) return null;
          const appleSubject = data.user.identities?.find(
            (i) => i.provider === "apple",
          )?.identity_data?.sub;
          let appleSessionActive = false;
          if (typeof appleSubject === "string" && appleSubject) {
            // getUser verified this exact JWT above. Never use decoded claims as identity proof.
            try {
              const part = jwt.split(".")[1];
              const claims = JSON.parse(
                atob(part.replaceAll("-", "+").replaceAll("_", "/")),
              );
              if (typeof claims.session_id === "string")
                appleSessionActive =
                  (await rpc("apple_deletion_session", {
                    actor: data.user.id,
                    session: claims.session_id,
                  })) === true;
            } catch {
              appleSessionActive = false;
            }
          }
          return error || !data.user
            ? null
            : {
                id: data.user.id,
                apple:
                  data.user.identities?.some((i) => i.provider === "apple") ===
                  true,
                appleSubject:
                  typeof appleSubject === "string" ? appleSubject : undefined,
                appleSessionActive,
                email: data.user.email,
                verified: !!data.user.email_confirmed_at,
                anonymous: data.user.is_anonymous,
                google:
                  data.user.identities?.some((i) => i.provider === "google") ===
                  true,
              };
        },
        async reauthenticate(email, password) {
          const { data, error } = await client.auth.signInWithPassword({
            email,
            password,
          });
          return error ? null : (data.user?.id ?? null);
        },
        erase,
      })(req);
    } finally {
      // Fresh password proof creates a request-local Auth session. Dispose of it
      // even when erasure fails; never retain an extra refresh token.
      await client.auth.signOut({ scope: "local" }).catch(() => undefined);
    }
  } catch {
    return new Response(JSON.stringify({ error: "DELETION_NOT_COMPLETED" }), {
      status: 503,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  }
});
