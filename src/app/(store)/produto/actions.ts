"use server";

import { quoteShipping } from "@/lib/melhor-envio";
import { createPublicClient } from "@/lib/supabase/public";
import type { ShippingOption } from "@/lib/shipping";

export async function quoteProductShipping(productId: string, cep: string): Promise<ShippingOption[]> {
  const digits = cep.replace(/\D/g, "");
  if (digits.length !== 8) return [];

  const supabase = createPublicClient();
  const { data: product } = await supabase
    .from("products")
    .select("weight_grams, price_cents")
    .eq("id", productId)
    .maybeSingle();

  if (!product) return [];

  return quoteShipping({
    destinationCep: digits,
    totalWeightGrams: product.weight_grams,
    subtotalCents: product.price_cents,
  });
}
