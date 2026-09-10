"use client";

import { Suspense, useActionState } from "react";
import { Loader2, Lock } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { login, type LoginState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { STORE } from "@/config/store";

const initialState: LoginState = {};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-pine-900 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-rose-100">
            <Lock className="size-5 text-rose-600" />
          </span>
          <h1 className="font-display text-lg font-bold text-pine-900">{STORE.shortName} · Admin</h1>
          <p className="text-sm text-muted-foreground">Acesso restrito à equipe</p>
        </div>

        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>

        <p className="mt-5 rounded-lg bg-mint-50 p-3 text-center text-xs text-pine-900">
          Modo demonstração — use <strong>equipe@brubellys.com.br</strong> / <strong>brubellys2026</strong>
        </p>
      </div>
    </div>
  );
}

function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/admin";

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      <input type="hidden" name="redirect" value={redirectTo} />
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" name="email" type="email" required autoFocus />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Senha</Label>
        <Input id="password" name="password" type="password" required />
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" size="lg" disabled={pending} className="mt-1">
        {pending && <Loader2 className="size-4 animate-spin" />}
        Entrar
      </Button>
    </form>
  );
}
