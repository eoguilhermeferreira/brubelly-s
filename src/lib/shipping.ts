import { STORE } from "@/config/store";

export type ShippingOption = {
  id: string;
  name: string;
  priceCents: number;
  estimatedDays: number;
};

export const PICKUP_OPTION_ID = "retirada-loja";

/** Retirada gratuita na loja física — sem custo, sem depender de cotação de frete. */
export function getPickupOption(): ShippingOption {
  return {
    id: PICKUP_OPTION_ID,
    name: `Retirada na loja (${STORE.address.city}-${STORE.address.state})`,
    priceCents: 0,
    estimatedDays: 0,
  };
}

/** Frete fixo — fallback quando o Melhor Envio não responde ou não está configurado. */
export function getFlatRateShipping(subtotalCents: number): ShippingOption {
  const free = subtotalCents >= STORE.shipping.freeShippingThresholdCents;
  return {
    id: "flat-rate",
    name: free ? "Frete grátis" : "Frete padrão",
    priceCents: free ? 0 : STORE.shipping.flatRateCents,
    estimatedDays: 7,
  };
}

export const LOCAL_DELIVERY_OPTION_ID = "entrega-local";

/**
 * Entrega local feita pela própria loja (motoboy próprio), sem passar por
 * transportadora — usada quando o CEP de destino é da mesma cidade da loja.
 */
export function getLocalDeliveryOption(): ShippingOption {
  return {
    id: LOCAL_DELIVERY_OPTION_ID,
    name: `Entrega em ${STORE.address.city}/${STORE.address.state}`,
    priceCents: STORE.shipping.localDeliveryCents,
    estimatedDays: 1,
  };
}

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

/** Compara cidade/UF de um CEP com o endereço da loja, ignorando maiúsculas/acentos. */
export function isSameCityAsStore(city: string, state: string): boolean {
  return normalize(city) === normalize(STORE.address.city) && normalize(state) === normalize(STORE.address.state);
}
