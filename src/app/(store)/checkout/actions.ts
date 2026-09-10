"use server";

import { checkoutSchema, type CheckoutFieldErrors } from "@/lib/checkout-schema";
import { orderCode } from "@/lib/format";
import { createCheckoutPreference } from "@/lib/mercadopago";
import { quoteShipping } from "@/lib/melhor-envio";
import { lookupCep } from "@/lib/viacep";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { getPickupOption, type ShippingOption } from "@/lib/shipping";

export async function lookupAddressByCep(cep: string) {
  const address = await lookupCep(cep);
  if (!address) return null;
  return {
    street: address.logradouro,
    neighborhood: address.bairro,
    city: address.localidade,
    state: address.uf,
  };
}

export type CartLine = {
  productId: string;
  variationValue: string | null;
  quantity: number;
};

/**
 * Recalcula preço e peso no servidor a partir do catálogo — nunca confia no
 * valor mostrado no carrinho do navegador.
 */
function resolveLines(lines: CartLine[]) {
  return lines
    .map((line) => {
      const product = MOCK_PRODUCTS.find((p) => p.id === line.productId);
      if (!product) return null;
      const variation = line.variationValue
        ? product.variations.find((v) => v.value === line.variationValue)
        : undefined;
      const availableStock = variation ? variation.stock : product.stock;
      const quantity = Math.max(1, Math.min(line.quantity, availableStock));

      return {
        product,
        variation,
        quantity,
        lineTotalCents: product.price_cents * quantity,
        lineWeightGrams: product.weight_grams * quantity,
      };
    })
    .filter((l): l is NonNullable<typeof l> => l !== null);
}

export async function getShippingOptions(cep: string, lines: CartLine[]): Promise<ShippingOption[]> {
  const resolved = resolveLines(lines);
  const subtotalCents = resolved.reduce((sum, l) => sum + l.lineTotalCents, 0);
  const totalWeightGrams = resolved.reduce((sum, l) => sum + l.lineWeightGrams, 0);

  return quoteShipping({ destinationCep: cep, totalWeightGrams, subtotalCents });
}

type CreateOrderInput = {
  form: Record<string, string>;
  lines: CartLine[];
  shippingOptionId: string;
};

type CreateOrderResult =
  | { ok: true; orderCode: string; totalCents: number; redirectUrl: string }
  | { ok: false; fieldErrors: CheckoutFieldErrors; formError?: string };

export async function createOrder({ form, lines, shippingOptionId }: CreateOrderInput): Promise<CreateOrderResult> {
  const parsed = checkoutSchema.safeParse({ ...form, shippingOptionId });

  if (!parsed.success) {
    const fieldErrors: CheckoutFieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof CheckoutFieldErrors;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, fieldErrors };
  }

  const resolved = resolveLines(lines);
  if (resolved.length === 0) {
    return { ok: false, fieldErrors: {}, formError: "Sua sacola está vazia." };
  }

  const subtotalCents = resolved.reduce((sum, l) => sum + l.lineTotalCents, 0);
  const totalWeightGrams = resolved.reduce((sum, l) => sum + l.lineWeightGrams, 0);

  let shipping: ShippingOption;
  if (parsed.data.deliveryMethod === "retirada") {
    shipping = getPickupOption();
  } else {
    const options = await quoteShipping({
      destinationCep: parsed.data.cep,
      totalWeightGrams,
      subtotalCents,
    });
    shipping = options.find((o) => o.id === shippingOptionId) ?? options[0];
  }
  const totalCents = subtotalCents + shipping.priceCents;

  const code = orderCode(Math.floor(Date.now() / 1000) % 100000);

  const preferenceUrl = await createCheckoutPreference({
    orderCode: code,
    items: resolved.map((l) => ({
      id: l.product.id,
      title: `${l.product.name}${l.variation ? ` (${l.variation.value})` : ""}`,
      quantity: l.quantity,
      unitPriceCents: l.product.price_cents,
    })),
    shippingCents: shipping.priceCents,
    payerEmail: parsed.data.email,
  });

  // MODO MOCK: sem MERCADOPAGO_ACCESS_TOKEN configurado, não há pagamento real
  // nem persistência em banco — vamos direto para a página de sucesso com o
  // resumo do pedido nos parâmetros da URL, só para fins de demonstração.
  const redirectUrl =
    preferenceUrl ??
    `/checkout/sucesso?code=${code}&total=${totalCents}&name=${encodeURIComponent(parsed.data.name)}`;

  return { ok: true, orderCode: code, totalCents, redirectUrl };
}
