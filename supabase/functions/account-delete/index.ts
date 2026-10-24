import { createClient } from "npm:@supabase/supabase-js@2.118.0";
import { deletionHandler } from "./handler.ts";
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
        const { data, error } = await admin.rpc("delete_player_account", {
          actor,
        });
        return !error && data?.deleted === true;
      },
    })(req);
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
