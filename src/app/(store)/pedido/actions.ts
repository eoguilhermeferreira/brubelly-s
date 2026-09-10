"use server";

import { getOrderByCode } from "@/lib/queries";
import type { Order } from "@/types/database.types";

export async function findOrder(code: string, email: string): Promise<Order | { error: string }> {
  const order = await getOrderByCode(code.trim());

  if (!order || order.customer_email.toLowerCase() !== email.trim().toLowerCase()) {
    return { error: "Não encontramos nenhum pedido com esses dados. Confira o número e o e-mail informados." };
  }

  return order;
}
