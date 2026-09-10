import { NextResponse, type NextRequest } from "next/server";

import { fetchPayment, mapMercadoPagoStatus } from "@/lib/mercadopago";

/**
 * Webhook do Mercado Pago. Regra de ouro: nunca confiar no conteúdo da
 * notificação em si — sempre buscar o pagamento de verdade na API pelo id
 * recebido antes de atualizar qualquer status.
 *
 * MODO MOCK: sem banco conectado, este handler só valida e loga o evento.
 * Quando o Supabase estiver configurado, troque o `// TODO` abaixo por um
 * update na tabela `orders` (via `lib/supabase/admin.ts`, que ignora RLS)
 * usando `external_reference` para achar o pedido.
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

  console.log("[webhook/mercadopago]", { orderCode, paymentId, status });

  // TODO: quando o Supabase estiver configurado —
  // const admin = createAdminClient();
  // await admin.from("orders").update({ payment_status: status, mercadopago_payment_id: paymentId })
  //   .eq("code", orderCode);

  return NextResponse.json({ ok: true }, { status: 200 });
}
