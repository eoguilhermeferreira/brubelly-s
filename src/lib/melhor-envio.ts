import "server-only";

import { STORE } from "@/config/store";
import { getLocalDeliveryOption, isSameCityAsStore, type ShippingOption } from "@/lib/shipping";
import { lookupCep } from "@/lib/viacep";

type QuoteParams = {
  destinationCep: string;
  totalWeightGrams: number;
  subtotalCents: number;
};

type RawShippingOption = {
  id: number;
  name: string;
  price: string;
  delivery_time: number;
  company?: { name?: string };
  error?: string;
};

type CarrierKey = "correios" | "jadlog" | "loggi";

const CARRIER_LABELS: Record<CarrierKey, string> = {
  correios: "Correios",
  jadlog: "Jadlog",
  loggi: "Loggi",
};

const CARRIER_ORDER: CarrierKey[] = ["correios", "jadlog", "loggi"];

function matchCarrierKey(companyName: string | undefined): CarrierKey | null {
  const normalized = (companyName ?? "").toLowerCase();
  if (normalized.includes("correios")) return "correios";
  if (normalized.includes("jadlog")) return "jadlog";
  if (normalized.includes("loggi")) return "loggi";
  return null;
}

/** Multiplicador simples por peso — cresce a partir de 1kg. Usado só nos valores calculados (sem cotação real da transportadora). */
function weightMultiplier(totalWeightGrams: number): number {
  const kg = Math.max(totalWeightGrams / 1000, 0.3);
  return 1 + Math.max(0, kg - 1) * 0.4;
}

/**
 * Dois valores calculados (econômico + expresso) pra uma transportadora,
 * usados quando a cotação real do Melhor Envio não devolve opção suficiente
 * dela (ou quando não há token configurado) — pra sempre sobrarem as 6
 * opções (2 por transportadora) pro cliente escolher.
 */
function syntheticCarrierOptions(carrier: CarrierKey, totalWeightGrams: number): ShippingOption[] {
  const base = STORE.shipping.flatRateCents * weightMultiplier(totalWeightGrams);
  const label = CARRIER_LABELS[carrier];

  if (carrier === "correios") {
    return [
      { id: `synthetic-correios-pac`, name: `${label} - PAC`, priceCents: Math.round(base * 0.9), estimatedDays: 8 },
      { id: `synthetic-correios-sedex`, name: `${label} - SEDEX`, priceCents: Math.round(base * 1.6), estimatedDays: 3 },
    ];
  }

  const [economicMult, expressMult] = carrier === "jadlog" ? [0.95, 1.5] : [1, 1.7];
  const [economicDays, expressDays] = carrier === "jadlog" ? [7, 4] : [6, 2];
  return [
    {
      id: `synthetic-${carrier}-economico`,
      name: `${label} Econômico`,
      priceCents: Math.round(base * economicMult),
      estimatedDays: economicDays,
    },
    {
      id: `synthetic-${carrier}-expresso`,
      name: `${label} Expresso`,
      priceCents: Math.round(base * expressMult),
      estimatedDays: expressDays,
    },
  ];
}

function syntheticSixOptions(totalWeightGrams: number, subtotalCents: number): ShippingOption[] {
  const options = CARRIER_ORDER.flatMap((carrier) => syntheticCarrierOptions(carrier, totalWeightGrams));
  return applyFreeShipping(options, subtotalCents);
}

/** Pedido acima do valor mínimo: a opção mais barata das 6 vira grátis. */
function applyFreeShipping(options: ShippingOption[], subtotalCents: number): ShippingOption[] {
  if (subtotalCents < STORE.shipping.freeShippingThresholdCents || options.length === 0) return options;

  const cheapestIndex = options.reduce(
    (minIndex, option, index) => (option.priceCents < options[minIndex].priceCents ? index : minIndex),
    0,
  );
  return options.map((option, index) => (index === cheapestIndex ? { ...option, priceCents: 0 } : option));
}

/**
 * Escolhe as duas opções da Correios que o cliente pediu especificamente:
 * PAC e SEDEX (mesmo que a conta do Melhor Envio devolva outros serviços
 * dela, tipo Mini Envios). Se algum dos dois não vier na cotação real,
 * completa com o valor calculado só pra ele.
 */
function pickCorreiosOptions(raw: RawShippingOption[], totalWeightGrams: number): ShippingOption[] {
  const synthetic = syntheticCarrierOptions("correios", totalWeightGrams);
  const findByName = (needle: string) =>
    raw.find((o) => o.name.toLowerCase().includes(needle) && !o.error);

  const pac = findByName("pac");
  const sedex = findByName("sedex");

  return [
    pac
      ? { id: String(pac.id), name: `Correios - ${pac.name}`, priceCents: Math.round(parseFloat(pac.price) * 100), estimatedDays: pac.delivery_time }
      : synthetic[0],
    sedex
      ? { id: String(sedex.id), name: `Correios - ${sedex.name}`, priceCents: Math.round(parseFloat(sedex.price) * 100), estimatedDays: sedex.delivery_time }
      : synthetic[1],
  ];
}

/** Jadlog e Loggi: pega as duas opções mais baratas que a cotação real devolver, sem exigir nome específico. */
function pickCheapestTwo(carrier: "jadlog" | "loggi", raw: RawShippingOption[], totalWeightGrams: number): ShippingOption[] {
  const real = raw
    .filter((o) => !o.error)
    .sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
    .slice(0, 2)
    .map((o) => ({
      id: String(o.id),
      name: `${CARRIER_LABELS[carrier]} - ${o.name}`,
      priceCents: Math.round(parseFloat(o.price) * 100),
      estimatedDays: o.delivery_time,
    }));

  if (real.length >= 2) return real;

  const synthetic = syntheticCarrierOptions(carrier, totalWeightGrams);
  return [...real, ...synthetic.slice(real.length, 2)];
}

/**
 * Cotação de frete. Regra de prioridade:
 * 1. Se o CEP for da mesma cidade/UF da loja, a entrega é feita pela própria
 *    loja (motoboy próprio) — nem consulta transportadora, só devolve a
 *    entrega local com valor fixo.
 * 2. Senão, sempre 6 opções pro cliente escolher: PAC e SEDEX (Correios),
 *    e as duas mais baratas de Jadlog e Loggi. Busca a cotação real no
 *    Melhor Envio quando há token configurado; qualquer opção que não vier
 *    na resposta (carteira não contratada, erro pontual, sem token) é
 *    completada com um valor calculado por peso — o checkout nunca trava
 *    nem mostra menos de 6 opções por causa da transportadora.
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
    return syntheticSixOptions(totalWeightGrams, subtotalCents);
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

    const data: RawShippingOption[] = await response.json();
    const byCarrier: Record<CarrierKey, RawShippingOption[]> = { correios: [], jadlog: [], loggi: [] };
    for (const option of data) {
      const key = matchCarrierKey(option.company?.name);
      if (key) byCarrier[key].push(option);
    }

    const options = [
      ...pickCorreiosOptions(byCarrier.correios, totalWeightGrams),
      ...pickCheapestTwo("jadlog", byCarrier.jadlog, totalWeightGrams),
      ...pickCheapestTwo("loggi", byCarrier.loggi, totalWeightGrams),
    ];

    return applyFreeShipping(options, subtotalCents);
  } catch (error) {
    console.error("[melhor-envio] cotação falhou, usando valores calculados:", error);
    return syntheticSixOptions(totalWeightGrams, subtotalCents);
  }
}
