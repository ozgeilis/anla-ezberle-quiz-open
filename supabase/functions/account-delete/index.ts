import { createClient } from "npm:@supabase/supabase-js@2.118.0";
import { deletionHandler } from "./handler.ts";
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
    try {
      return await deletionHandler({
        async user(jwt) {
          const { data, error } = await client.auth.getUser(jwt);
          return error || !data.user
            ? null
            : {
                id: data.user.id,
                email: data.user.email,
                verified: !!data.user.email_confirmed_at,
                anonymous: data.user.is_anonymous,
              };
        },
        async reauthenticate(email, password) {
          const { data, error } = await client.auth.signInWithPassword({
            email,
            password,
          });
          return error ? null : (data.user?.id ?? null);
        },
        async erase(actor) {
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
                const { error } = await admin.storage
                  .from(bucket)
                  .remove(names);
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
                const { data, error } = await admin.rpc(
                  "verify_account_deletion",
                  { actor: id, prior_email: email },
                );
                return !error && data?.deleted === true;
              },
            },
            actor,
            userData.user.email,
          );
        },
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
