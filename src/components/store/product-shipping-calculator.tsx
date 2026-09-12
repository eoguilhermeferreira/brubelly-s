"use client";

import * as React from "react";
import { Loader2, Truck } from "lucide-react";

import { quoteProductShipping } from "@/app/(store)/produto/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCep, formatPrice } from "@/lib/format";
import type { ShippingOption } from "@/lib/shipping";

export function ProductShippingCalculator({ productId }: { productId: string }) {
  const [cep, setCep] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [options, setOptions] = React.useState<ShippingOption[] | null>(null);
  const [notFound, setNotFound] = React.useState(false);

  async function handleCalculate() {
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) return;

    setLoading(true);
    setNotFound(false);
    const result = await quoteProductShipping(productId, digits);
    setOptions(result);
    setNotFound(result.length === 0);
    setLoading(false);
  }

  return (
    <div className="mt-5 rounded-xl border border-border bg-white p-4">
      <p className="flex items-center gap-1.5 text-sm font-semibold text-pine-900">
        <Truck className="size-4" /> Calcular frete
      </p>
      <div className="mt-2.5 flex gap-2">
        <Input
          value={cep}
          onChange={(e) => setCep(formatCep(e.target.value))}
          placeholder="00000-000"
          className="max-w-40"
        />
        <Button type="button" variant="outline" onClick={handleCalculate} disabled={loading || cep.replace(/\D/g, "").length !== 8}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Calcular"}
        </Button>
      </div>

      {options && options.length > 0 && (
        <ul className="mt-3 flex flex-col gap-1.5">
          {options.map((option) => (
            <li key={option.id} className="flex items-center justify-between text-sm">
              <span className="text-pine-900">{option.name}</span>
              <span className="font-semibold text-pine-900">
                {option.priceCents === 0 ? "Grátis" : formatPrice(option.priceCents)}
              </span>
            </li>
          ))}
        </ul>
      )}
      {notFound && <p className="mt-2 text-sm text-destructive">CEP não encontrado, confira e tente de novo.</p>}
    </div>
  );
}
