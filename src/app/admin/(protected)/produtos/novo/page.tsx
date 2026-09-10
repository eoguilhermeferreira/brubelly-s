import Link from "next/link";
import { ArrowLeft, DatabaseZap } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function AdminNewProductPage() {
  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin/produtos" className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-pine-900">
        <ArrowLeft className="size-4" /> Voltar para produtos
      </Link>

      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-white p-12 text-center">
        <DatabaseZap className="size-8 text-mint-600" strokeWidth={1.5} />
        <h1 className="font-display text-lg font-bold text-pine-900">Conecte o Supabase para cadastrar produtos</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Este projeto está em modo demonstração, com catálogo de exemplo. Preencha as variáveis do
          Supabase no <code className="rounded bg-muted px-1 py-0.5 text-xs">.env</code> para habilitar
          criação e edição reais.
        </p>
        <Button asChild variant="outline" className="mt-2">
          <Link href="/admin/produtos">Voltar</Link>
        </Button>
      </div>
    </div>
  );
}
