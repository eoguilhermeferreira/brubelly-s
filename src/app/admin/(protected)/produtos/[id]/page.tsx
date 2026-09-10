import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { getAllCategories, getAllProductsAdmin } from "@/lib/queries";

export default async function AdminProductDetailPage({ params }: PageProps<"/admin/produtos/[id]">) {
  const { id } = await params;
  const [products, categories] = await Promise.all([getAllProductsAdmin(), getAllCategories()]);
  const product = products.find((p) => p.id === id);
  if (!product) notFound();

  const categoryName = categories.find((c) => c.id === product.category_id)?.name ?? "—";

  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin/produtos" className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-pine-900">
        <ArrowLeft className="size-4" /> Voltar para produtos
      </Link>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-mint-50">
          {product.images[0] && (
            <Image src={product.images[0].url} alt="" fill sizes="280px" className="object-cover" />
          )}
        </div>

        <div className="rounded-2xl border border-border bg-white p-5">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display text-xl font-bold text-pine-900">{product.name}</h1>
              <p className="text-sm text-muted-foreground">{categoryName} · {product.color}</p>
            </div>
            <Badge variant={product.active ? "mint" : "outline"}>{product.active ? "Ativo" : "Inativo"}</Badge>
          </div>

          <p className="mt-4 text-sm text-pine-900/80">{product.description}</p>

          <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border pt-4 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-muted-foreground">Preço</dt>
              <dd className="font-semibold text-pine-900">{formatPrice(product.price_cents)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Estoque</dt>
              <dd className="font-semibold text-pine-900">{product.stock} un.</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Peso</dt>
              <dd className="font-semibold text-pine-900">{product.weight_grams} g</dd>
            </div>
          </dl>

          {product.variations.length > 0 && (
            <div className="mt-5 border-t border-border pt-4">
              <p className="text-sm font-medium text-pine-900">Variações ({product.variations[0].label})</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.variations.map((v) => (
                  <span key={v.id} className="rounded-full border border-border px-3 py-1 text-xs">
                    {v.value} · {v.stock} un.
                  </span>
                ))}
              </div>
            </div>
          )}

          <Button className="mt-5" disabled title="Disponível ao conectar o Supabase">
            Salvar alterações
          </Button>
        </div>
      </div>
    </div>
  );
}
