import Image from "next/image";
import Link from "next/link";

import { CartSheet } from "@/components/store/cart-sheet";
import { CartTriggerButton, MobileNav } from "@/components/store/header-actions";
import { STORE } from "@/config/store";
import { getCategories } from "@/lib/queries";

export async function Header() {
  const categories = await getCategories();

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-paper/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <MobileNav categories={categories} />
          <Link href="/" aria-label={STORE.name}>
            <Image
              src={STORE.logo}
              alt={STORE.name}
              width={STORE.logoWidth}
              height={STORE.logoHeight}
              priority
              className="h-11 w-auto sm:h-12"
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
            className="hidden rounded-full px-3 py-2 text-sm font-medium text-pine-900 hover:bg-accent sm:block"
          >
            Meu pedido
          </Link>
          <CartTriggerButton />
        </div>
      </div>
      <CartSheet />
    </header>
  );
}
