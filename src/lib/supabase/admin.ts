import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service role — ignora RLS. Uso restrito a: criação de pedido no checkout
 * e no webhook do Mercado Pago. NUNCA importar em código que roda no cliente.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}
