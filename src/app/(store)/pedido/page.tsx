"use client";

import * as React from "react";
import { Loader2, Search } from "lucide-react";

import { findOrder } from "@/app/(store)/pedido/actions";
import { OrderSummary } from "@/components/pedido/order-summary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Order } from "@/types/database.types";

export default function PedidoPage() {
  const [code, setCode] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [order, setOrder] = React.useState<Order | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(null);

    const result = await findOrder(code, email);
    setLoading(false);

    if ("error" in result) {
      setError(result.error);
      return;
    }
    setOrder(result);
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-bold text-pine-900">Consultar pedido</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Digite o número do pedido e o e-mail usado na compra — sem necessidade de senha.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="code">Número do pedido</Label>
          <Input id="code" placeholder="BB00001" value={code} onChange={(e) => setCode(e.target.value)} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <Button type="submit" size="lg" disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
          Buscar pedido
        </Button>
      </form>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      {order && (
        <div className="mt-8">
          <OrderSummary order={order} />
        </div>
      )}
    </div>
  );
}
