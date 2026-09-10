"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";

import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { STORE } from "@/config/store";

export default function CarrinhoPage() {
  const { items, subtotalCents, removeItem, setQuantity } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-6">
        <ShoppingBag className="size-12 text-mint-500" strokeWidth={1.5} />
        <h1 className="font-display text-2xl font-bold text-pine-900">Sua sacola está vazia</h1>
        <p className="text-muted-foreground">Vamos encontrar looks fofos para vestir os pequenos?</p>
        <Button size="lg" asChild>
          <Link href="/produtos">Ver produtos</Link>
        </Button>
      </div>
    );
  }

  const freeShipping = subtotalCents >= STORE.shipping.freeShippingThresholdCents;
  const missingForFreeShipping = STORE.shipping.freeShippingThresholdCents - subtotalCents;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-2xl font-bold text-pine-900">Sua sacola</h1>

      {!freeShipping && (
        <p className="mt-3 rounded-lg bg-mint-50 px-4 py-2.5 text-sm text-pine-900">
          Faltam <strong>{formatPrice(missingForFreeShipping)}</strong> para você ganhar frete grátis 💚
        </p>
      )}

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
        <ul className="flex flex-col divide-y divide-border">
          {items.map((item) => (
            <li key={`${item.productId}-${item.variationValue}`} className="flex gap-4 py-5">
              <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-mint-50">
                <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link href={`/produto/${item.slug}`} className="font-display font-semibold text-pine-900 hover:text-rose-600">
                      {item.name}
                    </Link>
                    {item.variationLabel && (
                      <p className="text-sm text-muted-foreground">
                        {item.variationLabel}: {item.variationValue}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    aria-label={`Remover ${item.name}`}
                    onClick={() => removeItem(item)}
                    className="rounded-full p-1.5 text-muted-foreground hover:bg-accent hover:text-rose-600"
                  >
                    <X className="size-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 rounded-full border border-border px-1">
                    <button
                      type="button"
                      aria-label="Diminuir quantidade"
                      onClick={() => setQuantity(item, item.quantity - 1)}
                      className="flex size-7 items-center justify-center rounded-full hover:bg-accent"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-5 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      type="button"
                      aria-label="Aumentar quantidade"
                      onClick={() => setQuantity(item, item.quantity + 1)}
                      disabled={item.quantity >= item.maxStock}
                      className="flex size-7 items-center justify-center rounded-full hover:bg-accent disabled:opacity-30"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                  <span className="font-semibold text-pine-900">
                    {formatPrice(item.unitPriceCents * item.quantity)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="h-fit rounded-2xl border border-border bg-white p-5">
          <h2 className="font-display font-semibold text-pine-900">Resumo</h2>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold text-pine-900">{formatPrice(subtotalCents)}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Frete calculado no checkout</p>
          <Button size="lg" className="mt-4 w-full" asChild>
            <Link href="/checkout">Ir para o pagamento</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
