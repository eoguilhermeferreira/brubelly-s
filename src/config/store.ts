export const STORE = {
  name: "BruBelly's Boutique",
  shortName: "BruBelly's",
  tagline: "Moda infantil com carinho de boutique",
  description:
    "Roupas e calçados infantis selecionados com carinho — do bebê ao pré-adolescente, com caimento confortável e tecidos macios para o dia a dia e ocasiões especiais.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.brubellys.com.br",
  logo: "/logo-brubellys.svg",

  contact: {
    whatsapp: "5511999999999",
    whatsappDisplay: "(11) 99999-9999",
    email: "ola@brubellys.com.br",
    instagram: "brubellysboutique",
  },

  social: {
    instagram: "https://instagram.com/brubellysboutique",
    tiktok: "https://tiktok.com/@brubellysboutique",
  },

  address: {
    city: "São Paulo",
    state: "SP",
  },

  shipping: {
    /** Frete fixo usado como fallback quando o Melhor Envio não responde ou não está configurado. */
    flatRateCents: 1990,
    freeShippingThresholdCents: 29900,
    originZipCode: "01310-100",
  },

  checkout: {
    /** Checkout Pro do Mercado Pago — redireciona para a página de pagamento deles. */
    provider: "mercadopago" as const,
  },

  currency: "BRL",
  locale: "pt-BR",
} as const;

export const AGE_GROUPS = [
  { slug: "bebe", label: "Bebê", range: "0–24 meses" },
  { slug: "infantil", label: "Infantil", range: "2–8 anos" },
  { slug: "juvenil", label: "Juvenil", range: "9–14 anos" },
] as const;

export const SIZE_CHART = [
  "RN",
  "P",
  "M",
  "G",
  "1",
  "2",
  "3",
  "4",
  "6",
  "8",
  "10",
  "12",
  "14",
] as const;
