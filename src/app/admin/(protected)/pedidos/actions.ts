"use server";

import { revalidatePath } from "next/cache";

import { MOCK_ORDERS } from "@/lib/mock-data";
import type { OrderStatus } from "@/types/database.types";

/**
 * MODO MOCK: atualiza o array em memória (válido enquanto o processo do
 * servidor estiver de pé — não persiste entre deploys). Ao conectar o
 * Supabase, troque por um update na tabela `orders`.
 */
export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const order = MOCK_ORDERS.find((o) => o.id === orderId);
  if (!order) return { ok: false as const };

  order.status = status;
  revalidatePath("/admin/pedidos");
  revalidatePath(`/admin/pedidos/${orderId}`);
  revalidatePath("/admin");

  return { ok: true as const };
}
