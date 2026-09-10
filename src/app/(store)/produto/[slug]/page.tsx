import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { AddToCartForm } from "@/components/store/add-to-cart-form";
import { ProductCard } from "@/components/store/product-card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import { getCategoryName, getProductBySlug, getRelatedProducts } from "@/lib/queries";

export async function generateMetadata({ params }: PageProps<"/produto/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return { title: product.name, description: product.description };
}

export default async function ProductPage({ params }: PageProps<"/produto/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [categoryName, related] = await Promise.all([
    getCategoryName(product.category_id),
    getRelatedProducts(product),
  ]);

  const onSale = product.compare_at_price_cents && product.compare_at_price_cents > product.price_cents;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <nav className="flex items-center gap-1 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-pine-900">Início</Link>
        <ChevronRight className="size-3" />
        <Link href="/produtos" className="hover:text-pine-900">Produtos</Link>
        <ChevronRight className="size-3" />
        <span className="text-pine-900">{categoryName}</span>
      </nav>

      <div className="mt-4 grid gap-8 lg:grid-cols-2 lg:gap-14">
        <div className="tag-shape relative aspect-square overflow-hidden bg-mint-50">
          <span className="tag-hole z-10" aria-hidden />
          {product.images[0] && (
            <Image
              src={product.images[0].url}
              alt={product.images[0].alt}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          )}
        </div>

        <div className="flex flex-col">
          <p className="font-tag text-xs uppercase tracking-wider text-muted-foreground">{product.color}</p>
          <h1 className="mt-1 font-display text-2xl font-bold text-pine-900 sm:text-3xl">{product.name}</h1>

          <div className="mt-3 flex items-center gap-3">
            <span className="font-display text-2xl font-bold text-rose-600">
              {formatPrice(product.price_cents)}
            </span>
            {onSale && (
              <>
                <span className="text-base text-muted-foreground line-through">
                  {formatPrice(product.compare_at_price_cents!)}
                </span>
                <Badge variant="rose">
                  -{Math.round((1 - product.price_cents / product.compare_at_price_cents!) * 100)}%
                </Badge>
              </>
            )}
          </div>

          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-pine-900/80">
            {product.description}
          </p>

          <div className="mt-6">
            <AddToCartForm product={product} />
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-border pt-6 text-sm">
            <dt className="text-muted-foreground">Categoria</dt>
            <dd className="text-pine-900">{categoryName}</dd>
            <dt className="text-muted-foreground">Cor</dt>
            <dd className="text-pine-900">{product.color}</dd>
            <dt className="text-muted-foreground">Frete e troca</dt>
            <dd className="text-pine-900">Troca grátis em até 30 dias</dd>
          </dl>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-xl font-bold text-pine-900">Combina com</h2>
          <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
