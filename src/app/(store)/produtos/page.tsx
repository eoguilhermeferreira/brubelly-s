import type { Metadata } from "next";

import { ProductCard } from "@/components/store/product-card";
import { Input } from "@/components/ui/input";
import { getCategories, getProducts } from "@/lib/queries";
import type { Product } from "@/types/database.types";

export const metadata: Metadata = { title: "Produtos" };

const FEATURED_LABELS: Record<string, string> = {
  novidades: "Novidades",
  "mais-vendidos": "Mais vendidos",
  promocoes: "Promoções",
};

export default async function ProdutosPage({
  searchParams,
}: PageProps<"/produtos">) {
  const params = await searchParams;
  const search = typeof params.busca === "string" ? params.busca : undefined;
  const categoria = typeof params.categoria === "string" ? params.categoria : undefined;
  const destaqueRaw = typeof params.destaque === "string" ? params.destaque : undefined;
  const destaque = (destaqueRaw as Product["featured_section"]) ?? undefined;

  const [products, categories] = await Promise.all([
    getProducts({ search, categorySlug: categoria, featuredSection: destaque }),
    getCategories(),
  ]);

  const title = destaque ? FEATURED_LABELS[destaque] : categoria
    ? categories.find((c) => c.slug === categoria)?.name
    : "Todos os produtos";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-2xl font-bold text-pine-900">{title}</h1>

        <form className="flex w-full max-w-xs items-center gap-2 sm:w-72" action="/produtos">
          <Input type="search" name="busca" placeholder="Buscar produtos..." defaultValue={search} />
        </form>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((category) => (
          <a
            key={category.id}
            href={`/produtos?categoria=${category.slug}`}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              categoria === category.slug
                ? "border-rose-500 bg-rose-500 text-white"
                : "border-border text-pine-900 hover:bg-accent"
            }`}
          >
            {category.name}
          </a>
        ))}
        {categoria && (
          <a href="/produtos" className="rounded-full px-3.5 py-1.5 text-sm text-muted-foreground underline">
            Limpar filtro
          </a>
        )}
      </div>

      {products.length === 0 ? (
        <p className="mt-14 text-center text-muted-foreground">
          Nenhum produto encontrado{search ? ` para "${search}"` : ""}.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
