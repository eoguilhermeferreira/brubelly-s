import { STORE } from "@/config/store";

export type ShippingOption = {
  id: string;
  name: string;
  priceCents: number;
  estimatedDays: number;
};

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
