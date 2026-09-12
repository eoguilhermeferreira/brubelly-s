/**
 * Tipos manuais que espelham o schema de `supabase/migrations/0001_init.sql`.
 * Quando o projeto Supabase real existir, troque este arquivo pelo gerado
 * via `supabase gen types typescript --project-id <id> > src/types/database.types.ts`.
 */

export type Category = {
  id: string;
  slug: string;
  name: string;
  parent_id: string | null;
  image_url: string | null;
  position: number;
};

export type ProductVariation = {
  id: string;
  product_id: string;
  label: string; // ex: "Tamanho"
  value: string; // ex: "2", "RN", "10"
  stock: number;
};

export type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  alt: string;
  position: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category_id: string;
  color: string | null;
  price_cents: number;
  compare_at_price_cents: number | null;
  stock: number;
  weight_grams: number;
  active: boolean;
  featured_section: "novidades" | "mais-vendidos" | "promocoes" | null;
  images: ProductImage[];
  variations: ProductVariation[];
};

export type Banner = {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  href: string;
  cta_label: string | null;
  image_position: string;
  position: number;
  active: boolean;
};

export type OrderStatus =
  | "aguardando_pagamento"
  | "pago"
  | "em_separacao"
  | "enviado"
  | "entregue"
  | "pronto_para_retirar"
  | "cancelado";

export type DeliveryMethod = "entrega" | "retirada";

export type PaymentStatus = "pending" | "approved" | "rejected" | "refunded";

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  variation_label: string | null;
  unit_price_cents: number;
  quantity: number;
};

export type ShippingAddress = {
  recipient: string;
  cep: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
};

export type Order = {
  id: string;
  code: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_method: DeliveryMethod;
  shipping_address: ShippingAddress;
  subtotal_cents: number;
  shipping_cents: number;
  total_cents: number;
  payment_method: "mercadopago";
  payment_status: PaymentStatus;
  mercadopago_payment_id: string | null;
  status: OrderStatus;
  items: OrderItem[];
  created_at: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders_count: number;
  total_spent_cents: number;
  created_at: string;
};
