import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { createPublicClient } from "@/lib/supabase/public";
import { createClient as createServerClient } from "@/lib/supabase/server";
import type { Banner, Category, Customer, Order, OrderStatus, Product } from "@/types/database.types";

/**
 * Camada de leitura de dados da loja, ligada ao Supabase.
 *
 * - Catálogo (categorias, produtos, banners): client público (anon key),
 *   sem cookies — seguro para cache. RLS permite leitura de tudo (ativo ou
 *   não); o filtro de "ativo"/"destaque" é feito aqui, na query.
 * - Dados administrativos (pedidos, clientes, dashboard): client
 *   autenticado por cookies — RLS só libera leitura para quem está em
 *   `admin_profiles`.
 * - Consulta pública de pedido por código + e-mail (guest, sem login): usa
 *   o client de service role, já que a tabela `orders` nega leitura por
 *   anon/authenticated comum. É seguro porque o e-mail é conferido no
 *   código antes de expor qualquer dado (ver `pedido/actions.ts`).
 */

const PRODUCT_SELECT = "*, images:product_images(*), variations:product_variations(*)";

function mapProduct(row: Record<string, unknown>): Product {
  const images = (row.images as Product["images"]) ?? [];
  const variations = (row.variations as Product["variations"]) ?? [];
  return {
    ...(row as Omit<Product, "images" | "variations">),
    images: [...images].sort((a, b) => a.position - b.position),
    variations,
  } as Product;
}

export async function getCategories(): Promise<Category[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .is("parent_id", null)
    .order("position");
  if (error) throw error;
  return data;
}

export async function getAllCategories(): Promise<Category[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("categories").select("*").order("position");
  if (error) throw error;
  return data;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("categories").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data;
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("categories").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function getSubcategories(parentId: string): Promise<Category[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("parent_id", parentId)
    .order("position");
  if (error) throw error;
  return data;
}

export async function getBanners(): Promise<Banner[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .eq("active", true)
    .order("position");
  if (error) throw error;
  return data;
}

export async function getAllBanners(): Promise<Banner[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("banners").select("*").order("position");
  if (error) throw error;
  return data;
}

export async function getBannerById(id: string): Promise<Banner | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("banners").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export type ProductFilters = {
  categorySlug?: string;
  featuredSection?: Product["featured_section"];
  search?: string;
};

async function categoryAndDescendantIds(categorySlug: string): Promise<string[]> {
  const supabase = createPublicClient();
  const { data: category, error } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .maybeSingle();
  if (error) throw error;
  if (!category) return [];

  const { data: children, error: childError } = await supabase
    .from("categories")
    .select("id")
    .eq("parent_id", category.id);
  if (childError) throw childError;

  return [category.id, ...children.map((c) => c.id)];
}

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const supabase = createPublicClient();
  let query = supabase.from("products").select(PRODUCT_SELECT).eq("active", true);

  if (filters.categorySlug) {
    const ids = await categoryAndDescendantIds(filters.categorySlug);
    query = query.in("category_id", ids.length > 0 ? ids : ["00000000-0000-0000-0000-000000000000"]);
  }

  if (filters.featuredSection) {
    query = query.eq("featured_section", filters.featuredSection);
  }

  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data.map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("products").select(PRODUCT_SELECT).eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data ? mapProduct(data) : null;
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("category_id", product.category_id)
    .eq("active", true)
    .neq("id", product.id)
    .limit(limit);
  if (error) throw error;
  return data.map(mapProduct);
}

export async function getCategoryName(categoryId: string): Promise<string> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("categories")
    .select("name")
    .eq("id", categoryId)
    .maybeSingle();
  if (error) throw error;
  return data?.name ?? "";
}

// --- Admin (protegido por src/proxy.ts + RLS de admin_profiles) --------

export async function getAllProductsAdmin(): Promise<Product[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("products").select(PRODUCT_SELECT);
  if (error) throw error;
  return data.map(mapProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("products").select(PRODUCT_SELECT).eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? mapProduct(data) : null;
}

export async function getOrders(): Promise<Order[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Order[];
}

/**
 * Consulta pública de pedido (guest) por código — usada em "Meu pedido".
 * Usa o client de service role porque `orders` nega leitura para
 * anon/authenticated comuns; a segurança vem da conferência de e-mail em
 * `pedido/actions.ts` antes de expor qualquer dado ao chamador.
 */
export async function getOrderByCode(code: string): Promise<Order | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .ilike("code", code)
    .maybeSingle();
  if (error) throw error;
  return data as Order | null;
}

export async function getOrderById(id: string): Promise<Order | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as Order | null;
}

export async function getCustomers(): Promise<Customer[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from("customers").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getDashboardStats() {
  const supabase = await createServerClient();
  const [{ data: orders, error: ordersError }, { count: totalProducts }, { count: totalCustomers }] =
    await Promise.all([
      supabase.from("orders").select("*, items:order_items(*)").order("created_at", { ascending: false }),
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("customers").select("*", { count: "exact", head: true }),
    ]);
  if (ordersError) throw ordersError;

  const allOrders = (orders ?? []) as Order[];
  const revenue = allOrders
    .filter((o) => o.payment_status === "approved")
    .reduce((sum, o) => sum + o.total_cents, 0);

  return {
    totalOrders: allOrders.length,
    pendingOrders: allOrders.filter((o) => o.status === "aguardando_pagamento").length,
    revenueCents: revenue,
    totalProducts: totalProducts ?? 0,
    totalCustomers: totalCustomers ?? 0,
    recentOrders: allOrders.slice(0, 5),
  };
}

export async function updateOrderStatusInDb(orderId: string, status: OrderStatus) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
  if (error) throw error;
}
