import type { MetadataRoute } from "next";

import { STORE } from "@/config/store";
import { getAllCategories, getProducts } from "@/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([getAllCategories(), getProducts()]);

  const staticRoutes: MetadataRoute.Sitemap = ["", "/produtos", "/pedido"].map((path) => ({
    url: `${STORE.url}${path}`,
    lastModified: new Date(),
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories
    .filter((c) => !c.parent_id)
    .map((c) => ({ url: `${STORE.url}/categoria/${c.slug}`, lastModified: new Date() }));

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${STORE.url}/produto/${p.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
