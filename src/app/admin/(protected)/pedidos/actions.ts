"use server";

import { revalidatePath } from "next/cache";

import {
  orderToEmailData,
  sendOrderCancelledEmail,
  sendOrderDeliveredEmail,
  sendOrderPreparingEmail,
  sendOrderReadyForPickupEmail,
  sendOrderShippedEmail,
} from "@/lib/email";
import { deleteOrderFromDb, getOrderById, updateOrderStatusInDb, updateTrackingCodeInDb } from "@/lib/queries";
import type { OrderStatus } from "@/types/database.types";

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const current = await getOrderById(orderId);
  if (!current) return { ok: false as const };

  const statusChanged = current.status !== status;

  try {
    await updateOrderStatusInDb(orderId, status);
  } catch {
    return { ok: false as const };
  }

  if (statusChanged) {
    const emailData = orderToEmailData(current);
    if (status === "em_separacao") await sendOrderPreparingEmail(emailData);
    else if (status === "pronto_para_retirar") await sendOrderReadyForPickupEmail(emailData);
    else if (status === "enviado") await sendOrderShippedEmail(emailData, current.tracking_code);
    else if (status === "entregue") await sendOrderDeliveredEmail(emailData);
    else if (status === "cancelado") await sendOrderCancelledEmail(emailData);
  }

  revalidatePath("/admin/pedidos");
  revalidatePath(`/admin/pedidos/${orderId}`);
  revalidatePath("/admin");

  return { ok: true as const };
}

/**
 * Transição para "Enviado" com código de rastreio — chamada pelo diálogo que
 * aparece só nesse momento (o campo não fica visível o tempo todo). Salva o
 * código e o status juntos e dispara um único e-mail de "pedido enviado".
 */
export async function markOrderShipped(orderId: string, trackingCode: string) {
  const current = await getOrderById(orderId);
  if (!current) return { ok: false as const };

  const alreadyShipped = current.status === "enviado";
  const trimmedCode = trackingCode.trim() || null;

  try {
    await updateTrackingCodeInDb(orderId, trimmedCode);
    await updateOrderStatusInDb(orderId, "enviado");
  } catch {
    return { ok: false as const };
  }

  if (!alreadyShipped) {
    const emailData = orderToEmailData(current);
    await sendOrderShippedEmail(emailData, trimmedCode);
  }

  revalidatePath("/admin/pedidos");
  revalidatePath(`/admin/pedidos/${orderId}`);
  revalidatePath("/admin");

  return { ok: true as const };
}

export async function updateTrackingCode(orderId: string, trackingCode: string) {
  try {
    await updateTrackingCodeInDb(orderId, trackingCode.trim() || null);
  } catch {
    return { ok: false as const };
  }

  revalidatePath(`/admin/pedidos/${orderId}`);
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
