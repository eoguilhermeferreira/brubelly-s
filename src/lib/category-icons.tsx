import { Baby, Footprints, Ribbon, Shirt, ShoppingBag, type LucideIcon } from "lucide-react";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  bebe: Baby,
  menina: Shirt,
  menino: Shirt,
  calcados: Footprints,
  acessorios: Ribbon,
};

export function getCategoryIcon(slug: string): LucideIcon {
  return CATEGORY_ICONS[slug] ?? ShoppingBag;
}
