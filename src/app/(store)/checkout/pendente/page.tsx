import Link from "next/link";
import { Clock } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function CheckoutPendentePage() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-20 text-center sm:px-6">
      <span className="flex size-16 items-center justify-center rounded-full bg-gold-400/30">
        <Clock className="size-8 text-gold-600" strokeWidth={1.5} />
      </span>
      <h1 className="font-display text-2xl font-bold text-pine-900">Pagamento em análise</h1>
      <p className="text-muted-foreground">
        Assim que o Mercado Pago confirmar, avisamos por e-mail e você pode acompanhar o status
        pelo número do pedido.
      </p>
      <div className="mt-2 flex gap-3">
        <Button variant="outline" asChild>
          <Link href="/pedido">Acompanhar pedido</Link>
        </Button>
        <Button asChild>
          <Link href="/">Voltar à loja</Link>
        </Button>
      </div>
    </div>
  );
}
