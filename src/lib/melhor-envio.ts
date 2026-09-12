import "server-only";

import { STORE } from "@/config/store";
import { getFlatRateShipping, getLocalDeliveryOption, isSameCityAsStore, type ShippingOption } from "@/lib/shipping";
import { lookupCep } from "@/lib/viacep";

type QuoteParams = {
  destinationCep: string;
  totalWeightGrams: number;
  subtotalCents: number;
};

/**
 * Cotação de frete. Regra de prioridade:
 * 1. Se o CEP for da mesma cidade/UF da loja, a entrega é feita pela própria
 *    loja (motoboy próprio) — nem consulta transportadora, só devolve a
 *    entrega local com valor fixo.
 * 2. Senão, cotação real via Melhor Envio. Se o token não estiver
 *    configurado, ou a chamada falhar, cai no frete fixo
 *    (`getFlatRateShipping`) — nunca deixa o checkout travado por causa da
 *    transportadora.
 */
export async function quoteShipping({
  destinationCep,
  totalWeightGrams,
  subtotalCents,
}: QuoteParams): Promise<ShippingOption[]> {
  const address = await lookupCep(destinationCep);
  if (address && isSameCityAsStore(address.localidade, address.uf)) {
    return [getLocalDeliveryOption()];
  }

  const token = process.env.MELHOR_ENVIO_TOKEN;

  if (!token) {
    return [getFlatRateShipping(subtotalCents)];
  }

  try {
    const response = await fetch(
      "https://melhorenvio.com.br/api/v2/me/shipment/calculate",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent": `${STORE.name} (${STORE.contact.email})`,
        },
        body: JSON.stringify({
          from: { postal_code: STORE.shipping.originZipCode.replace("-", "") },
          to: { postal_code: destinationCep.replace(/\D/g, "") },
          products: [{ id: "cart", width: 20, height: 15, length: 20, weight: Math.max(totalWeightGrams / 1000, 0.1), quantity: 1 }],
        }),
        signal: AbortSignal.timeout(8000),
      },
    );

    if (!response.ok) throw new Error(`Melhor Envio respondeu ${response.status}`);

    const data: Array<{ id: number; name: string; price: string; delivery_time: number; error?: string }> =
      await response.json();

    const options = data
      .filter((option) => !option.error)
      .map((option) => ({
        id: String(option.id),
        name: option.name,
        priceCents: Math.round(parseFloat(option.price) * 100),
        estimatedDays: option.delivery_time,
      }));

    return options.length > 0 ? options : [getFlatRateShipping(subtotalCents)];
  } catch (error) {
    console.error("[melhor-envio] cotação falhou, usando frete fixo:", error);
    return [getFlatRateShipping(subtotalCents)];
  }
}
