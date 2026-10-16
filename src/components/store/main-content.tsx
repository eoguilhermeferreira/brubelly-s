"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * No mobile o header é fixed (fora do fluxo), então o conteúdo abaixo dele
 * precisa de um padding-top equivalente à altura do header — exceto na home,
 * onde o banner é desenhado de propósito pra ficar embaixo do header
 * transparente. Altura = py-3 (24px) + logo h-11 (44px) + safe-area do notch.
 */
export function MainContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <main
      className={cn(
        "flex-1",
        !isHome && "max-md:pt-[calc(68px+env(safe-area-inset-top))]",
      )}
    >
      {children}
    </main>
  );
}
