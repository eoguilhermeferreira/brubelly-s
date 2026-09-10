import Link from "next/link";
import { PartyPopper } from "lucide-react";

import { ClearCartOnMount } from "@/components/cart/clear-cart-on-mount";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";

export default async function CheckoutSucessoPage({
  searchParams,
}: PageProps<"/checkout/sucesso">) {
  const params = await searchParams;
  const code = typeof params.code === "string" ? params.code : null;
  const total = typeof params.total === "string" ? Number(params.total) : null;
  const name = typeof params.name === "string" ? params.name : null;

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-20 text-center sm:px-6">
      <ClearCartOnMount />
      <span className="flex size-16 items-center justify-center rounded-full bg-mint-200">
        <PartyPopper className="size-8 text-pine-900" strokeWidth={1.5} />
      </span>
      <h1 className="font-display text-2xl font-bold text-pine-900">
        {name ? `Obrigada, ${name.split(" ")[0]}!` : "Pedido confirmado!"}
      </h1>
      <p className="text-muted-foreground">
        Recebemos seu pedido e já vamos preparar tudo com carinho.
      </p>

      {code && (
        <div className="mt-2 rounded-xl border border-border bg-white px-6 py-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Número do pedido</p>
          <p className="font-tag text-lg font-semibold text-pine-900">{code}</p>
          {total !== null && (
            <p className="mt-1 text-sm text-muted-foreground">Total: {formatPrice(total)}</p>
          )}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Guarde o número acima — você pode acompanhar o status em &quot;Meu pedido&quot;.
      </p>

      <div className="mt-2 flex gap-3">
        <Button variant="outline" asChild>
          <Link href="/pedido">Acompanhar pedido</Link>
        </Button>
        <Button asChild>
          <Link href="/produtos">Continuar comprando</Link>
        </Button>
      </div>
    </div>
  );
}
