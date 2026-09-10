import { notFound } from "next/navigation";

import { ProductCard } from "@/components/store/product-card";
import { getCategoryBySlug, getProducts, getSubcategories } from "@/lib/queries";

export async function generateMetadata({ params }: PageProps<"/categoria/[slug]">) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  return { title: category?.name ?? "Categoria" };
}

export default async function CategoryPage({ params }: PageProps<"/categoria/[slug]">) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [products, subcategories] = await Promise.all([
    getProducts({ categorySlug: slug }),
    getSubcategories(category.id),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-2xl font-bold text-pine-900">{category.name}</h1>

      {subcategories.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {subcategories.map((sub) => (
            <a
              key={sub.id}
              href={`/produtos?categoria=${sub.slug}`}
              className="rounded-full border border-border px-3.5 py-1.5 text-sm font-medium text-pine-900 hover:bg-accent"
            >
              {sub.name}
            </a>
          ))}
        </div>
      )}

      {products.length === 0 ? (
        <p className="mt-14 text-center text-muted-foreground">Nenhum produto nesta categoria ainda.</p>
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
