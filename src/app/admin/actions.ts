"use server";

import { redirect } from "next/navigation";

import { createAdminSession, destroyAdminSession, verifyAdminCredentials } from "@/lib/auth";

export type LoginState = { error?: string };

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirect") ?? "/admin");

  const valid = await verifyAdminCredentials(email, password);
  if (!valid) {
    return { error: "E-mail ou senha incorretos." };
  }

  await createAdminSession();
  redirect(redirectTo.startsWith("/admin") ? redirectTo : "/admin");
}

export async function logout() {
  await destroyAdminSession();
  redirect("/admin/login");
}
