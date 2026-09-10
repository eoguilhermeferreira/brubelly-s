"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingCart,
  Tag,
  Users,
} from "lucide-react";

import { logout } from "@/app/admin/actions";
import { STORE } from "@/config/store";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/categorias", label: "Categorias", icon: Tag },
  { href: "/admin/banners", label: "Banners", icon: ImageIcon },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingCart },
  { href: "/admin/clientes", label: "Clientes", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-pine-700/40 bg-pine-900 text-white md:flex">
      <div className="px-5 py-5">
        <Image
          src={STORE.logo}
          alt={STORE.name}
          width={STORE.logoWidth}
          height={STORE.logoHeight}
          className="h-9 w-auto"
        />
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3">
        {NAV_ITEMS.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon className="size-4" strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <form action={logout} className="px-3 pb-5">
        <button
          type="submit"
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white"
        >
          <LogOut className="size-4" strokeWidth={1.75} />
          Sair
        </button>
      </form>
    </aside>
  );
}
