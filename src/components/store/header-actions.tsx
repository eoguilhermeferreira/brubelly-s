"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search, ShoppingBag, X } from "lucide-react";

import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { STORE } from "@/config/store";
import type { Category } from "@/types/database.types";

export function CartTriggerButton({ light = false }: { light?: boolean }) {
  const { itemCount, setOpen } = useCart();

  return (
    <button
      type="button"
      aria-label="Abrir sacola"
      onClick={() => setOpen(true)}
      className="relative flex size-10 items-center justify-center rounded-full hover:bg-accent focus-visible:outline-2 focus-visible:outline-mint-600"
    >
      <ShoppingBag
        className={cn("size-5 md:text-pine-900", light ? "max-md:text-white" : "max-md:text-pine-900")}
        strokeWidth={1.75}
      />
      {itemCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex size-[18px] items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      )}
    </button>
  );
}

export function MobileNav({ categories, light = false }: { categories: Category[]; light?: boolean }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <button
        type="button"
        aria-label="Abrir menu"
        onClick={() => setOpen(true)}
        className="flex size-10 items-center justify-center rounded-full hover:bg-accent md:hidden"
      >
        <Menu className={cn("size-5", light ? "text-white" : "text-pine-900")} />
      </button>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <Image
            src={STORE.logo}
            alt={STORE.name}
            width={STORE.logoWidth}
            height={STORE.logoHeight}
            className="h-8 w-auto self-start"
          />
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-5">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="rounded-lg px-3 py-2.5 font-display text-base font-semibold text-pine-900 hover:bg-accent"
          >
            Início
          </Link>
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

export function MobileSearchToggle({
  light = false,
  open,
  onOpenChange,
}: {
  light?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <button
      type="button"
      aria-label="Buscar produtos"
      onClick={() => onOpenChange(!open)}
      className="flex size-10 items-center justify-center rounded-full hover:bg-accent md:hidden"
    >
      <Search className={cn("size-5", light ? "text-white" : "text-pine-900")} />
    </button>
  );
}

export function MobileSearchBar({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = inputRef.current?.value.trim();
    if (!value) return;
    router.push(`/produtos?busca=${encodeURIComponent(value)}`);
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 items-center gap-2">
      <Search className="size-4 shrink-0 text-muted-foreground" />
      <input
        ref={inputRef}
        type="search"
        name="busca"
        placeholder="Buscar produtos..."
        className="flex-1 bg-transparent text-[15px] text-pine-900 outline-none placeholder:text-muted-foreground"
      />
      <button
        type="button"
        aria-label="Fechar busca"
        onClick={onClose}
        className="flex size-9 shrink-0 items-center justify-center rounded-full hover:bg-accent"
      >
        <X className="size-5 text-pine-900" />
      </button>
    </form>
  );
}
