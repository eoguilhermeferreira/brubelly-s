import "server-only";
import { cookies } from "next/headers";

/**
 * MODO MOCK: autenticação de demonstração para o painel /admin, sem
 * depender do Supabase Auth. Troque por `admin_profiles` + Supabase Auth
 * (ver arquitetura no CLAUDE.md) antes de ir para produção.
 */
const SESSION_COOKIE = "brubellys_admin_session";

const DEMO_EMAIL = process.env.ADMIN_DEMO_EMAIL ?? "equipe@brubellys.com.br";
const DEMO_PASSWORD = process.env.ADMIN_DEMO_PASSWORD ?? "brubellys2026";

export async function verifyAdminCredentials(email: string, password: string) {
  return email.trim().toLowerCase() === DEMO_EMAIL.toLowerCase() && password === DEMO_PASSWORD;
}

export async function createAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "active", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function hasAdminSession() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value === "active";
}

export { SESSION_COOKIE };
