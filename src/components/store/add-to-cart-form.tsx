"use client";

import * as React from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { useCart } from "@/components/cart/cart-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/database.types";

export function AddToCartForm({ product }: { product: Product }) {
  const { addItem, setOpen } = useCart();
  const hasVariations = product.variations.length > 0;
  const [selectedValue, setSelectedValue] = React.useState<string | null>(
    hasVariations ? null : "default",
  );
  const [quantity, setQuantity] = React.useState(1);

  const selectedVariation = product.variations.find((v) => v.value === selectedValue);
  const maxStock = hasVariations ? (selectedVariation?.stock ?? 0) : product.stock;
  const canAdd = hasVariations ? Boolean(selectedValue) && maxStock > 0 : product.stock > 0;
  const effectivePriceCents = selectedVariation?.price_cents ?? product.price_cents;
  const onSale = Boolean(product.compare_at_price_cents && product.compare_at_price_cents > effectivePriceCents);

  function handleAdd() {
    if (!canAdd) return;

    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0]?.url ?? "",
        unitPriceCents: effectivePriceCents,
        variationLabel: hasVariations ? (product.variations[0]?.label ?? null) : null,
        variationValue: hasVariations ? selectedValue : null,
        maxStock,
      },
      quantity,
    );

    toast.success("Adicionado à sacola", { description: product.name });
    setOpen(true);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span className="font-display text-2xl font-bold text-rose-600">
          {formatPrice(effectivePriceCents)}
        </span>
        {onSale && (
          <>
            <span className="text-base text-muted-foreground line-through">
              {formatPrice(product.compare_at_price_cents!)}
            </span>
            <Badge variant="rose">
              -{Math.round((1 - effectivePriceCents / product.compare_at_price_cents!) * 100)}%
            </Badge>
          </>
        )}
      </div>

      {hasVariations && (
        <div>
          <p className="text-sm font-semibold text-pine-900">
            {product.variations[0].label}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.variations.map((variation) => {
              const outOfStock = variation.stock === 0;
              const active = selectedValue === variation.value;
              return (
                <button
                  key={variation.id}
                  type="button"
                  disabled={outOfStock}
                  onClick={() => {
                    setSelectedValue(variation.value);
                    setQuantity(1);
                  }}
                  className={cn(
                    "flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-semibold transition-colors",
                    active
                      ? "border-rose-500 bg-rose-500 text-white"
                      : "border-border text-pine-900 hover:border-mint-500",
                    outOfStock && "cursor-not-allowed border-border/50 text-muted-foreground/50 line-through",
                  )}
                >
                  {variation.value}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 rounded-full border border-border px-2 py-1">
          <button
            type="button"
            aria-label="Diminuir quantidade"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex size-8 items-center justify-center rounded-full hover:bg-accent"
          >
            <Minus className="size-3.5" />
          </button>
          <span className="w-5 text-center font-semibold">{quantity}</span>
          <button
            type="button"
            aria-label="Aumentar quantidade"
            onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
            disabled={quantity >= maxStock}
            className="flex size-8 items-center justify-center rounded-full hover:bg-accent disabled:opacity-30"
          >
            <Plus className="size-3.5" />
          </button>
        </div>
        {hasVariations && selectedValue && maxStock <= 5 && maxStock > 0 && (
          <span className="text-xs font-medium text-gold-600">Só {maxStock} em estoque</span>
        )}
      </div>

      <Button size="lg" onClick={handleAdd} disabled={!canAdd}>
        <ShoppingBag className="size-4" />
        {canAdd ? "Adicionar à sacola" : hasVariations && !selectedValue ? "Escolha um tamanho" : "Esgotado"}
      </Button>
    </div>
  );
}
