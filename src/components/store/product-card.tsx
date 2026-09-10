import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types/database.types";

export function ProductCard({ product }: { product: Product }) {
  const cover = product.images[0];
  const onSale = product.compare_at_price_cents && product.compare_at_price_cents > product.price_cents;
  const discountPct = onSale
    ? Math.round((1 - product.price_cents / product.compare_at_price_cents!) * 100)
    : null;

  return (
    <Link
      href={`/produto/${product.slug}`}
      className="group block focus-visible:outline-2 focus-visible:outline-mint-600 focus-visible:outline-offset-4 rounded-lg"
    >
      <div className="tag-shape relative aspect-[4/5] overflow-hidden bg-mint-50 transition-transform duration-300 group-hover:-rotate-1 group-hover:scale-[1.02]">
        <span className="tag-hole z-10" aria-hidden />
        {cover && (
          <Image
            src={cover.url}
            alt={cover.alt}
            fill
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 40vw, 90vw"
            className="object-cover"
          />
        )}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.featured_section === "novidades" && <Badge variant="mint">Novo</Badge>}
          {onSale && <Badge variant="rose">-{discountPct}%</Badge>}
        </div>
      </div>

      <div className="mt-3 px-1">
        <p className="font-tag text-[11px] uppercase tracking-wider text-muted-foreground">
          {product.color}
        </p>
        <h3 className="mt-0.5 font-display text-[15px] font-semibold leading-snug text-pine-900">
          {product.name}
        </h3>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-semibold text-rose-600">{formatPrice(product.price_cents)}</span>
          {onSale && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.compare_at_price_cents!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
