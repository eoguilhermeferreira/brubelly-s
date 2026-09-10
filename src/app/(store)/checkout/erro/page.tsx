import Link from "next/link";
import { XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function CheckoutErroPage() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-20 text-center sm:px-6">
      <span className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
        <XCircle className="size-8 text-destructive" strokeWidth={1.5} />
      </span>
      <h1 className="font-display text-2xl font-bold text-pine-900">Não conseguimos processar o pagamento</h1>
      <p className="text-muted-foreground">
        Nada foi cobrado. Verifique os dados do cartão ou tente outro meio de pagamento.
      </p>
      <div className="mt-2 flex gap-3">
        <Button variant="outline" asChild>
          <Link href="/carrinho">Voltar à sacola</Link>
        </Button>
        <Button asChild>
          <Link href="/checkout">Tentar novamente</Link>
        </Button>
      </div>
    </div>
  );
}
