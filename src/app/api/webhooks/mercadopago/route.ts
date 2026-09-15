import { NextResponse, type NextRequest } from "next/server";

import {
  orderToEmailData,
  sendPaymentApprovedEmail,
  sendPaymentRefundedEmail,
  sendPaymentRejectedEmail,
} from "@/lib/email";
import { fetchPayment, mapMercadoPagoStatus } from "@/lib/mercadopago";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Order } from "@/types/database.types";

/**
 * Webhook do Mercado Pago. Regra de ouro: nunca confiar no conteúdo da
 * notificação em si — sempre buscar o pagamento de verdade na API pelo id
 * recebido antes de atualizar qualquer status.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const paymentId: string | undefined = body?.data?.id;

  if (!paymentId) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const payment = await fetchPayment(paymentId);
  if (!payment) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const status = mapMercadoPagoStatus(payment.status);
  const orderCode = payment.external_reference;

  if (orderCode) {
    const admin = createAdminClient();
    const { data: current } = await admin
      .from("orders")
      .select("*, items:order_items(*)")
      .eq("code", orderCode)
      .maybeSingle();

    if (current) {
      const statusChanged = current.payment_status !== status;

      await admin
        .from("orders")
        .update({
          payment_status: status,
          mercadopago_payment_id: String(paymentId),
          ...(status === "approved" ? { status: "pago" } : {}),
        })
        .eq("code", orderCode);

      if (statusChanged) {
        const emailData = orderToEmailData(current as Order);
        if (status === "approved") await sendPaymentApprovedEmail(emailData);
        else if (status === "rejected") await sendPaymentRejectedEmail(emailData);
        else if (status === "refunded") await sendPaymentRefundedEmail(emailData);
      }
    }
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
