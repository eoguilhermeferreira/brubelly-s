"use server";

import { STORE } from "@/config/store";
import { checkoutSchema, type CheckoutFieldErrors } from "@/lib/checkout-schema";
import { orderCode } from "@/lib/format";
import { createCheckoutPreference } from "@/lib/mercadopago";
import { quoteShipping } from "@/lib/melhor-envio";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPublicClient } from "@/lib/supabase/public";
import { lookupCep } from "@/lib/viacep";
import { getPickupOption, type ShippingOption } from "@/lib/shipping";
import type { Product } from "@/types/database.types";

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
 * Recalcula preço e peso no servidor a partir do catálogo real — nunca
 * confia no valor mostrado no carrinho do navegador.
 */
async function resolveLines(lines: CartLine[]) {
  if (lines.length === 0) return [];

  const supabase = createPublicClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("*, variations:product_variations(*)")
    .in(
      "id",
      lines.map((l) => l.productId),
    );
  if (error) throw error;

  return lines
    .map((line) => {
      const product = (products as (Product & { variations: Product["variations"] })[]).find(
        (p) => p.id === line.productId,
      );
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
  const resolved = await resolveLines(lines);
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

  const resolved = await resolveLines(lines);
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

  const admin = createAdminClient();

  const shippingAddress =
    parsed.data.deliveryMethod === "entrega"
      ? {
          recipient: parsed.data.name,
          cep: parsed.data.cep,
          street: parsed.data.street,
          number: parsed.data.number,
          complement: parsed.data.complement || null,
          neighborhood: parsed.data.neighborhood,
          city: parsed.data.city,
          state: parsed.data.state,
        }
      : {
          recipient: parsed.data.name,
          cep: STORE.address.zipCode,
          street: STORE.address.street,
          number: STORE.address.number,
          complement: null,
          neighborhood: "",
          city: STORE.address.city,
          state: STORE.address.state,
        };

  // Código do pedido: tenta algumas vezes em caso de colisão (constraint
  // única em `orders.code`) — improvável, mas o gerador é baseado no
  // segundo corrente, não em sequência de banco.
  let code = "";
  let orderId: string | null = null;
  for (let attempt = 0; attempt < 3 && !orderId; attempt++) {
    code = orderCode(Math.floor(Date.now() / 1000) % 100000 + attempt);
    const { data: inserted, error: insertError } = await admin
      .from("orders")
      .insert({
        code,
        customer_name: parsed.data.name,
        customer_email: parsed.data.email,
        customer_phone: parsed.data.phone,
        delivery_method: parsed.data.deliveryMethod,
        shipping_address: shippingAddress,
        subtotal_cents: subtotalCents,
        shipping_cents: shipping.priceCents,
        total_cents: totalCents,
        payment_method: "mercadopago",
        payment_status: "pending",
        status: "aguardando_pagamento",
      })
      .select("id")
      .single();

    if (!insertError && inserted) {
      orderId = inserted.id;
    } else if (insertError?.code !== "23505") {
      // erro que não é de código duplicado — não adianta tentar de novo
      throw insertError;
    }
  }

  if (!orderId) {
    return { ok: false, fieldErrors: {}, formError: "Não foi possível gerar o pedido. Tente novamente." };
  }

  await admin.from("order_items").insert(
    resolved.map((l) => ({
      order_id: orderId,
      product_id: l.product.id,
      product_name: l.product.name,
      variation_label: l.variation ? `Tamanho ${l.variation.value}` : null,
      unit_price_cents: l.product.price_cents,
      quantity: l.quantity,
    })),
  );

  // Cliente: cria ou atualiza o resumo (pedidos/total gasto) por e-mail.
  const { data: existingCustomer } = await admin
    .from("customers")
    .select("id, orders_count, total_spent_cents")
    .eq("email", parsed.data.email)
    .maybeSingle();

  if (existingCustomer) {
    await admin
      .from("customers")
      .update({
        name: parsed.data.name,
        phone: parsed.data.phone,
        orders_count: existingCustomer.orders_count + 1,
        total_spent_cents: existingCustomer.total_spent_cents + totalCents,
      })
      .eq("id", existingCustomer.id);
  } else {
    await admin.from("customers").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      orders_count: 1,
      total_spent_cents: totalCents,
    });
  }

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

  // Sem MERCADOPAGO_ACCESS_TOKEN configurado, não há pagamento real — o
  // pedido já foi persistido acima, mas vai direto para a página de
  // sucesso só para fins de demonstração.
  const redirectUrl =
    preferenceUrl ??
    `/checkout/sucesso?code=${code}&total=${totalCents}&name=${encodeURIComponent(parsed.data.name)}`;

  return { ok: true, orderCode: code, totalCents, redirectUrl };
}
