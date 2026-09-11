import "server-only";

import { createClient } from "@/lib/supabase/server";

/**
 * Autenticação do painel /admin via Supabase Auth. Login válido não é
 * suficiente por si só: o usuário também precisa ter um registro em
 * `admin_profiles` (é essa tabela que a RLS de `orders`/`customers` usa
 * para liberar leitura) — sem isso, qualquer conta do Supabase Auth do
 * projeto poderia entrar no painel.
 */
export async function getAdminProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from("admin_profiles").select("*").eq("id", user.id).maybeSingle();
  return profile;
}
