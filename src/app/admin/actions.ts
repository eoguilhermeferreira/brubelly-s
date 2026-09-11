"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type LoginState = { error?: string };

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirect") ?? "/admin");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return { error: "E-mail ou senha incorretos." };
  }

  const { data: profile } = await supabase.from("admin_profiles").select("id").eq("id", data.user.id).maybeSingle();
  if (!profile) {
    await supabase.auth.signOut();
    return { error: "Este usuário não tem acesso ao painel administrativo." };
  }

  redirect(redirectTo.startsWith("/admin") ? redirectTo : "/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
