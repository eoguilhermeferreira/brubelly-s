"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { CartSheet } from "@/components/store/cart-sheet";
import {
  CartTriggerButton,
  MobileNav,
  MobileSearchBar,
  MobileSearchToggle,
} from "@/components/store/header-actions";
import { STORE } from "@/config/store";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/database.types";

/** id do sentinel colocado logo após o banner full-bleed mobile, em page.tsx */
const HERO_SENTINEL_ID = "mobile-hero-sentinel";

export function HeaderShell({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolledPastHero, setScrolledPastHero] = React.useState(true);
  const [searchOpen, setSearchOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isHome) return;
    const sentinel = document.getElementById(HERO_SENTINEL_ID);
    if (!sentinel) return;
    // O callback do observer já dispara uma vez, de imediato, com o estado
    // atual de interseção — não precisa de um setState síncrono aqui antes.
    const observer = new IntersectionObserver(([entry]) => setScrolledPastHero(!entry.isIntersecting), {
      threshold: 0,
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [isHome]);

  // `transparent` só tem efeito visual abaixo de md (classes max-md:) — todo
  // elemento que muda de cor com ele também recebe um md:… fixo, garantindo
  // que o desktop nunca mude mesmo que este estado calcule errado.
  const transparent = isHome && !scrolledPastHero && !searchOpen;

  return (
    <header
      className={cn(
        "z-30 w-full transition-colors duration-200",
        "max-md:fixed max-md:top-0",
        "md:sticky md:top-0 md:border-b md:border-border/70 md:bg-paper/90 md:backdrop-blur-sm",
        transparent
          ? "max-md:border-b max-md:border-transparent max-md:bg-transparent"
          : "max-md:border-b max-md:border-border/70 max-md:bg-paper/90 max-md:backdrop-blur-sm",
      )}
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {searchOpen ? (
          <MobileSearchBar onClose={() => setSearchOpen(false)} />
        ) : (
          <>
            <div className="flex items-center gap-2">
              <MobileNav categories={categories} light={transparent} />
              <Link href="/" aria-label={STORE.name} className="relative">
                <span
                  className={cn(
                    "absolute inset-0 -m-1.5 rounded-full bg-white/85 transition-opacity md:opacity-0",
                    transparent ? "max-md:opacity-100" : "max-md:opacity-0",
                  )}
                  aria-hidden
                />
                <Image
                  src={STORE.logo}
                  alt={STORE.name}
                  width={STORE.logoWidth}
                  height={STORE.logoHeight}
                  priority
                  className="relative h-11 w-auto sm:h-12"
                />
              </Link>
            </div>

            <nav className="hidden items-center gap-6 md:flex">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categoria/${category.slug}`}
                  className="font-display text-[15px] font-semibold text-pine-900 transition-colors hover:text-rose-600"
                >
                  {category.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1">
              <Link
                href="/pedido"
                className={cn(
                  "hidden rounded-full px-3 py-2 text-sm font-medium hover:bg-accent sm:block md:text-pine-900",
                  transparent ? "max-md:text-white" : "max-md:text-pine-900",
                )}
              >
                Meu pedido
              </Link>
              <MobileSearchToggle light={transparent} open={searchOpen} onOpenChange={setSearchOpen} />
              <CartTriggerButton light={transparent} />
            </div>
          </>
        )}
      </div>
      <CartSheet />
    </header>
  );
}
