"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";

import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatPrice } from "@/lib/format";

export function CartSheet() {
  const { items, isOpen, setOpen, subtotalCents, removeItem, setQuantity } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-md p-0">
        <SheetHeader>
          <SheetTitle>Sua sacola</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag className="size-10 text-mint-500" strokeWidth={1.5} />
            <p className="font-display text-base font-semibold text-pine-900">Sua sacola está vazia</p>
            <p className="text-sm text-muted-foreground">
              Que tal dar uma olhada nas novidades da coleção?
            </p>
            <Button onClick={() => setOpen(false)} asChild>
              <Link href="/produtos">Ver produtos</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5">
              <ul className="flex flex-col gap-4">
                {items.map((item) => (
                  <li key={`${item.productId}-${item.variationValue}`} className="flex gap-3">
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-mint-50">
                      <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-display text-sm font-semibold leading-tight text-pine-900">
                            {item.name}
                          </p>
                          {item.variationLabel && (
                            <p className="text-xs text-muted-foreground">
                              {item.variationLabel}: {item.variationValue}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          aria-label={`Remover ${item.name}`}
                          onClick={() => removeItem(item)}
                          className="rounded-full p-1 text-muted-foreground hover:bg-accent hover:text-rose-600"
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
                            className="flex size-6 items-center justify-center rounded-full hover:bg-accent"
                          >
                            <Minus className="size-3" />
                          </button>
                          <span className="w-4 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            type="button"
                            aria-label="Aumentar quantidade"
                            onClick={() => setQuantity(item, item.quantity + 1)}
                            disabled={item.quantity >= item.maxStock}
                            className="flex size-6 items-center justify-center rounded-full hover:bg-accent disabled:opacity-30"
                          >
                            <Plus className="size-3" />
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-pine-900">
                          {formatPrice(item.unitPriceCents * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <SheetFooter className="border-t border-border pt-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-semibold text-pine-900">{formatPrice(subtotalCents)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Frete calculado no próximo passo.</p>
              <Button size="lg" className="w-full" onClick={() => setOpen(false)} asChild>
                <Link href="/checkout">Finalizar compra</Link>
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
