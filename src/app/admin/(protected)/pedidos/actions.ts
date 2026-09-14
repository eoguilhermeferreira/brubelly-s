"use server";

import { revalidatePath } from "next/cache";

import { deleteOrderFromDb, updateOrderStatusInDb } from "@/lib/queries";
import type { OrderStatus } from "@/types/database.types";

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  try {
    await updateOrderStatusInDb(orderId, status);
  } catch {
    return { ok: false as const };
  }

  revalidatePath("/admin/pedidos");
  revalidatePath(`/admin/pedidos/${orderId}`);
  revalidatePath("/admin");

  return { ok: true as const };
}

export async function deleteOrder(orderId: string) {
  try {
    await deleteOrderFromDb(orderId);
  } catch {
    return { ok: false as const };
  }

  revalidatePath("/admin/pedidos");
  revalidatePath("/admin");

  return { ok: true as const };
}
