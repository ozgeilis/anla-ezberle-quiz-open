import { createClient } from "npm:@supabase/supabase-js@2.118.0";
import { pushDispatchHandler } from "./handler.ts";
// Server environment only. Neither the dispatcher secret nor Expo access token
// is a publishable key, and none may be exported through EXPO_PUBLIC_*.
Deno.serve(async (req: Request) => {
  try {
    const named = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") ?? "{}");
    const key =
      named.default ??
      Object.values(named).find(
        (v) => typeof v === "string" && v.startsWith("sb_secret_"),
      ) ??
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const client = createClient(Deno.env.get("SUPABASE_URL")!, key as string, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    return await pushDispatchHandler({
      secret: Deno.env.get("PUSH_DISPATCH_SECRET") ?? "",
      expoAccessToken: Deno.env.get("EXPO_ACCESS_TOKEN") ?? "",
      async rpc(operation, body = {}) {
        const { data, error } = await client.rpc("push_worker", {
          operation,
          body,
        });
        if (error) throw Error("Worker RPC failed");
        return data;
      },
      fetch,
    })(req);
  } catch {
    return new Response('{"error":"Push service unavailable"}', {
      status: 503,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  }
});
