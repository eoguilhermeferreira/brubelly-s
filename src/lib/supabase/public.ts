import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Leitura pública (sem auth) — usada por `lib/queries.ts` quando o Supabase
 * real estiver configurado. Não usa cookies, seguro para cache/edge.
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}
