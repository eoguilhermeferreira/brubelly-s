export const FEATURED_SECTIONS = {
  novidades: "Novidades",
  "mais-vendidos": "Mais vendidos",
  promocoes: "Promoções",
} as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pedido_recebido: "Pedido recebido",
  em_separacao: "Em separação",
  enviado: "Enviado",
  entregue: "Entregue",
  pronto_para_retirar: "Pronto para retirar",
  cancelado: "Cancelado",
};

export const ORDER_STATUS_TONE: Record<string, "default" | "rose" | "mint" | "gold" | "outline"> = {
  pedido_recebido: "outline",
  em_separacao: "gold",
  enviado: "mint",
  entregue: "default",
  pronto_para_retirar: "mint",
  cancelado: "rose",
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: "Aguardando pagamento",
  approved: "Pago",
  rejected: "Pagamento recusado",
  refunded: "Reembolsado",
};

export const PAYMENT_STATUS_TONE: Record<string, "default" | "rose" | "mint" | "gold" | "outline"> = {
  pending: "gold",
  approved: "mint",
  rejected: "rose",
  refunded: "outline",
};
