import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CreditCard, ShieldCheck, Truck } from "lucide-react";

import { BannerCarousel } from "@/components/store/banner-carousel";
import { CategoryGrid } from "@/components/store/category-grid";
import { ProductCard } from "@/components/store/product-card";
import { PromoBannerCarousel } from "@/components/store/promo-banner-carousel";
import { Button } from "@/components/ui/button";
import { STORE } from "@/config/store";
import { getBanners, getCategories, getHomeHeroBanner, getPromoBanners, getProducts } from "@/lib/queries";

const DEFAULT_HERO = {
  image_url: "/banners/hero-flatlay.jpg",
  title: "Nova coleção",
  subtitle:
    "Peças macias, coloridas e feitas para acompanhar cada travessura — do primeiro bodinho ao look do primeiro dia de aula.",
  cta_label: "Ver coleção",
  href: "/produtos",
  image_position: "center",
};

export default async function HomePage() {
  const [categories, banners, promoBanners, novidades, maisVendidos, homeHeroBanner] = await Promise.all([
    getCategories(),
    getBanners(),
    getPromoBanners(),
    getProducts({ featuredSection: "novidades" }),
    getProducts({ featuredSection: "mais-vendidos" }),
    getHomeHeroBanner(),
  ]);

  const hero = homeHeroBanner ?? DEFAULT_HERO;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
      <section className="grid gap-6 max-md:gap-0 pt-6 max-md:pt-0 sm:pt-10 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
        <div className="relative flex flex-col justify-center overflow-hidden rounded-2xl bg-mint-400/40 px-6 py-10 max-md:order-2 max-md:mt-6 sm:px-10 sm:py-14">
          <Image
            src={hero.image_url}
            alt={hero.title}
            fill
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover"
            style={{ objectPosition: hero.image_position || "center" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/30" />
          <div className="relative">
            <span className="w-fit rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-pine-900">
              {hero.title}
            </span>
            {hero.subtitle && (
              <p className="mt-4 max-w-sm text-[15px] text-pine-900/80">{hero.subtitle}</p>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href={hero.href}>
                  {hero.cta_label || "Ver coleção"} <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="max-md:order-1">
          <BannerCarousel banners={banners} />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl font-bold text-pine-900 sm:text-2xl">Escolha por categoria</h2>
        <div className="mt-4">
          <CategoryGrid categories={categories} />
        </div>
      </section>

      <section className="mt-14">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-xl font-bold text-pine-900 sm:text-2xl">Novidades</h2>
          <Link href="/produtos?destaque=novidades" className="text-sm font-semibold text-rose-600 hover:underline">
            Ver todas
          </Link>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {novidades.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <PromoBannerCarousel banners={promoBanners} />

      <section className="mt-14">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-xl font-bold text-pine-900 sm:text-2xl">Mais vendidos</h2>
          <Link href="/produtos?destaque=mais-vendidos" className="text-sm font-semibold text-rose-600 hover:underline">
            Ver todos
          </Link>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {maisVendidos.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mt-14 flex justify-center">
        <div className="relative aspect-[6/7] w-full max-w-md overflow-hidden rounded-2xl">
          <Image
            src="/banners/promo-menino-folhagem.jpg"
            alt="Coleção verão para meninos"
            fill
            priority={false}
            sizes="(min-width: 640px) 400px, 90vw"
            className="object-cover object-[50%_12%]"
          />
        </div>
      </section>

      <section className="mt-16 grid gap-4 rounded-2xl bg-rose-100 p-6 sm:grid-cols-3 sm:p-8">
        <div className="flex items-start gap-3">
          <Truck className="mt-0.5 size-6 shrink-0 text-rose-600" strokeWidth={1.5} />
          <div>
            <p className="font-display text-sm font-semibold text-pine-900">Frete para todo o Brasil</p>
            <p className="text-xs text-pine-900/70">
              Ou retire grátis em {STORE.address.city}-{STORE.address.state}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <CreditCard className="mt-0.5 size-6 shrink-0 text-rose-600" strokeWidth={1.5} />
          <div>
            <p className="font-display text-sm font-semibold text-pine-900">Parcelamos no cartão</p>
            <p className="text-xs text-pine-900/70">Cartão, Pix ou boleto via Mercado Pago</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 size-6 shrink-0 text-rose-600" strokeWidth={1.5} />
          <div>
            <p className="font-display text-sm font-semibold text-pine-900">Compra protegida</p>
            <p className="text-xs text-pine-900/70">Pagamento processado pelo Mercado Pago</p>
          </div>
        </div>
      </section>
    </div>
  );
}
