"use server";

import { createCheckoutPreference } from "@/lib/mercadopago";
import { getOrderByCode } from "@/lib/queries";
import type { Order } from "@/types/database.types";

/**
 * Confere código do pedido + e-mail antes de expor qualquer dado — mesma
 * regra de segurança usada em `findOrder` e em `getOrderByCode`.
 */
async function findOwnedOrder(code: string, email: string): Promise<Order | null> {
  const order = await getOrderByCode(code.trim());
  if (!order || order.customer_email.toLowerCase() !== email.trim().toLowerCase()) return null;
  return order;
}

export async function findOrder(code: string, email: string): Promise<Order | { error: string }> {
  const order = await findOwnedOrder(code, email);

  if (!order) {
    return { error: "Não encontramos nenhum pedido com esses dados. Confira o número e o e-mail informados." };
  }

  return order;
}

type PayAgainResult = { ok: true; url: string } | { ok: false; error: string };

/**
 * Gera um novo link de pagamento (Checkout Pro) para um pedido já existente
 * e ainda não pago — usado pelo botão "Pagar agora" em Meus Pedidos. Nunca
 * cria um pedido novo; o código e o valor continuam os mesmos.
 */
export async function payOrderAgain(code: string, email: string): Promise<PayAgainResult> {
  const order = await findOwnedOrder(code, email);
  if (!order) {
    return { ok: false, error: "Não encontramos nenhum pedido com esses dados." };
  }

  if (order.payment_status === "approved") {
    return { ok: false, error: "Este pedido já está pago." };
  }

  const preferenceUrl = await createCheckoutPreference({
    orderCode: order.code,
    items: order.items.map((item) => ({
      id: item.product_id,
      title: item.variation_label ? `${item.product_name} (${item.variation_label})` : item.product_name,
      quantity: item.quantity,
      unitPriceCents: item.unit_price_cents,
    })),
    shippingCents: order.shipping_cents,
    payerEmail: order.customer_email,
  });

  if (!preferenceUrl) {
    return { ok: false, error: "Pagamento indisponível no momento. Tente novamente em instantes." };
  }

  return { ok: true, url: preferenceUrl };
}
