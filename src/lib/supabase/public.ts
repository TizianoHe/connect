import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Supabase client for reading **public** data on the server.
 *
 * Unlike `createClient()` in `./server.ts`, this one never touches `cookies()`.
 * That matters for more than tidiness: reading cookies opts a route out of
 * static rendering entirely, so any page that used the cookie-bound client was
 * server-rendered from scratch on every single request — even when it only
 * showed published profiles that are identical for every visitor.
 *
 * Use this for anonymous reads of published data (home page, browse listing).
 * Use `./server.ts` whenever the query depends on who is signed in — RLS needs
 * the user's session for that, and this client does not carry one.
 */
export function createPublicClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}
