import { NextResponse, type NextRequest } from "next/server";

import { fetchPayment, mapMercadoPagoStatus } from "@/lib/mercadopago";
import { createAdminClient } from "@/lib/supabase/admin";

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
    await admin
      .from("orders")
      .update({
        payment_status: status,
        mercadopago_payment_id: String(paymentId),
        ...(status === "approved" ? { status: "pago" } : {}),
      })
      .eq("code", orderCode);
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
