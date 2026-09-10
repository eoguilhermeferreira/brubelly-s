import "server-only";
import { MercadoPagoConfig, Payment, Preference } from "mercadopago";

import { STORE } from "@/config/store";

function getClient() {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) return null;
  return new MercadoPagoConfig({ accessToken });
}

export type CheckoutItem = {
  id: string;
  title: string;
  quantity: number;
  unitPriceCents: number;
};

/**
 * Checkout Pro — cria a preferência e devolve a URL de redirecionamento.
 * Sem `MERCADOPAGO_ACCESS_TOKEN` configurado, devolve `null` e a action de
 * checkout redireciona direto para a página de sucesso (modo demonstração).
 */
export async function createCheckoutPreference(params: {
  orderCode: string;
  items: CheckoutItem[];
  shippingCents: number;
  payerEmail: string;
}): Promise<string | null> {
  const client = getClient();
  if (!client) return null;

  const preference = new Preference(client);

  const items = params.items.map((item) => ({
    id: item.id,
    title: item.title,
    quantity: item.quantity,
    unit_price: item.unitPriceCents / 100,
    currency_id: "BRL",
  }));

  if (params.shippingCents > 0) {
    items.push({
      id: "frete",
      title: "Frete",
      quantity: 1,
      unit_price: params.shippingCents / 100,
      currency_id: "BRL",
    });
  }

  const result = await preference.create({
    body: {
      items,
      payer: { email: params.payerEmail },
      external_reference: params.orderCode,
      back_urls: {
        success: `${STORE.url}/checkout/sucesso`,
        pending: `${STORE.url}/checkout/pendente`,
        failure: `${STORE.url}/checkout/erro`,
      },
      auto_return: "approved",
    },
  });

  return result.init_point ?? null;
}

/**
 * Webhook: sempre busca o pagamento de verdade na API do Mercado Pago pelo
 * id notificado, nunca confia no payload da notificação em si.
 */
export async function fetchPayment(paymentId: string) {
  const client = getClient();
  if (!client) return null;

  const payment = new Payment(client);
  return payment.get({ id: paymentId });
}

export function mapMercadoPagoStatus(status: string | undefined): "pending" | "approved" | "rejected" | "refunded" {
  switch (status) {
    case "approved":
      return "approved";
    case "refunded":
    case "charged_back":
      return "refunded";
    case "rejected":
    case "cancelled":
      return "rejected";
    default:
      return "pending";
  }
}
