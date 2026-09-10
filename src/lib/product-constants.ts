export const FEATURED_SECTIONS = {
  novidades: "Novidades",
  "mais-vendidos": "Mais vendidos",
  promocoes: "Promoções",
} as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  aguardando_pagamento: "Aguardando pagamento",
  pago: "Pago",
  em_separacao: "Em separação",
  enviado: "Enviado",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

export const ORDER_STATUS_TONE: Record<string, "default" | "rose" | "mint" | "gold" | "outline"> = {
  aguardando_pagamento: "gold",
  pago: "mint",
  em_separacao: "outline",
  enviado: "mint",
  entregue: "default",
  cancelado: "rose",
};
