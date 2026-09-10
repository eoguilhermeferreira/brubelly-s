import "server-only";

import { MOCK_BANNERS, MOCK_CATEGORIES, MOCK_CUSTOMERS, MOCK_ORDERS, MOCK_PRODUCTS } from "@/lib/mock-data";
import type { Banner, Category, Customer, Order, Product } from "@/types/database.types";

/**
 * Camada de leitura de dados da loja.
 *
 * MODO ATUAL: os dados vêm de `lib/mock-data.ts` (em memória).
 * Quando as credenciais do Supabase forem configuradas (ver `.env.example`),
 * troque o corpo de cada função por uma consulta real via
 * `createPublicClient()` (`lib/supabase/public.ts`), mantendo a mesma
 * assinatura — nenhuma página precisa mudar.
 */

const DELAY_MS = 0;

async function simulateLatency<T>(value: T): Promise<T> {
  if (DELAY_MS > 0) await new Promise((r) => setTimeout(r, DELAY_MS));
  return value;
}

export async function getCategories(): Promise<Category[]> {
  return simulateLatency(MOCK_CATEGORIES.filter((c) => !c.parent_id).sort((a, b) => a.position - b.position));
}

export async function getAllCategories(): Promise<Category[]> {
  return simulateLatency(MOCK_CATEGORIES);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return simulateLatency(MOCK_CATEGORIES.find((c) => c.slug === slug) ?? null);
}

export async function getSubcategories(parentId: string): Promise<Category[]> {
  return simulateLatency(MOCK_CATEGORIES.filter((c) => c.parent_id === parentId));
}

export async function getBanners(): Promise<Banner[]> {
  return simulateLatency(MOCK_BANNERS.filter((b) => b.active).sort((a, b) => a.position - b.position));
}

export type ProductFilters = {
  categorySlug?: string;
  featuredSection?: Product["featured_section"];
  search?: string;
};

function categoryAndDescendantIds(categorySlug: string): string[] {
  const category = MOCK_CATEGORIES.find((c) => c.slug === categorySlug);
  if (!category) return [];
  const childIds = MOCK_CATEGORIES.filter((c) => c.parent_id === category.id).map((c) => c.id);
  return [category.id, ...childIds];
}

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  let results = MOCK_PRODUCTS.filter((p) => p.active);

  if (filters.categorySlug) {
    const ids = categoryAndDescendantIds(filters.categorySlug);
    results = results.filter((p) => ids.includes(p.category_id));
  }

  if (filters.featuredSection) {
    results = results.filter((p) => p.featured_section === filters.featuredSection);
  }

  if (filters.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
    );
  }

  return simulateLatency(results);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return simulateLatency(MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  return simulateLatency(
    MOCK_PRODUCTS.filter((p) => p.id !== product.id && p.category_id === product.category_id && p.active).slice(
      0,
      limit,
    ),
  );
}

export async function getCategoryName(categoryId: string): Promise<string> {
  return MOCK_CATEGORIES.find((c) => c.id === categoryId)?.name ?? "";
}

// --- Admin (protegido por src/proxy.ts) ---------------------------------

export async function getAllProductsAdmin(): Promise<Product[]> {
  return simulateLatency(MOCK_PRODUCTS);
}

export async function getOrders(): Promise<Order[]> {
  return simulateLatency([...MOCK_ORDERS].sort((a, b) => b.created_at.localeCompare(a.created_at)));
}

export async function getOrderByCode(code: string): Promise<Order | null> {
  return simulateLatency(MOCK_ORDERS.find((o) => o.code.toLowerCase() === code.toLowerCase()) ?? null);
}

export async function getOrderById(id: string): Promise<Order | null> {
  return simulateLatency(MOCK_ORDERS.find((o) => o.id === id) ?? null);
}

export async function getCustomers(): Promise<Customer[]> {
  return simulateLatency(MOCK_CUSTOMERS);
}

export async function getDashboardStats() {
  const orders = MOCK_ORDERS;
  const revenue = orders
    .filter((o) => o.payment_status === "approved")
    .reduce((sum, o) => sum + o.total_cents, 0);

  return simulateLatency({
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.status === "aguardando_pagamento").length,
    revenueCents: revenue,
    totalProducts: MOCK_PRODUCTS.length,
    totalCustomers: MOCK_CUSTOMERS.length,
    recentOrders: [...orders].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 5),
  });
}
