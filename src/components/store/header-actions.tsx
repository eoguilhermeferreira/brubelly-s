"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, ShoppingBag } from "lucide-react";

import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { STORE } from "@/config/store";
import type { Category } from "@/types/database.types";

export function CartTriggerButton() {
  const { itemCount, setOpen } = useCart();

  return (
    <button
      type="button"
      aria-label="Abrir sacola"
      onClick={() => setOpen(true)}
      className="relative flex size-10 items-center justify-center rounded-full hover:bg-accent focus-visible:outline-2 focus-visible:outline-mint-600"
    >
      <ShoppingBag className="size-5 text-pine-900" strokeWidth={1.75} />
      {itemCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex size-[18px] items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      )}
    </button>
  );
}

export function MobileNav({ categories }: { categories: Category[] }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <button
        type="button"
        aria-label="Abrir menu"
        onClick={() => setOpen(true)}
        className="flex size-10 items-center justify-center rounded-full hover:bg-accent md:hidden"
      >
        <Menu className="size-5 text-pine-900" />
      </button>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <Image
            src={STORE.logo}
            alt={STORE.name}
            width={STORE.logoWidth}
            height={STORE.logoHeight}
            className="h-9 w-auto"
          />
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-5">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categoria/${category.slug}`}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 font-display text-base font-semibold text-pine-900 hover:bg-accent"
            >
              {category.name}
            </Link>
          ))}
          <Link
            href="/pedido"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent"
          >
            Consultar meu pedido
          </Link>
        </nav>
        <div className="mt-auto px-5 pb-5">
          <Button asChild className="w-full" onClick={() => setOpen(false)}>
            <Link href="/produtos">Ver tudo</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
