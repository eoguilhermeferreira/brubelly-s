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
  pronto_para_retirar: "Pronto para retirar",
  cancelado: "Cancelado",
};

export const ORDER_STATUS_TONE: Record<string, "default" | "rose" | "mint" | "gold" | "outline"> = {
  aguardando_pagamento: "gold",
  pago: "mint",
  em_separacao: "outline",
  enviado: "mint",
  entregue: "default",
  pronto_para_retirar: "mint",
  cancelado: "rose",
};
