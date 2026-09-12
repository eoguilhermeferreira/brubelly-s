import type { ComponentType, SVGProps } from "react";
import { Baby, Flower2, Footprints, Handbag, Shirt, ShoppingBag } from "lucide-react";

import { DressIcon } from "@/components/icons/dress-icon";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export const CATEGORY_ICONS: Record<string, IconComponent> = {
  bebe: Baby,
  menina: Flower2,
  vestidos: DressIcon,
  menino: Shirt,
  calcados: Footprints,
  acessorios: Handbag,
};

export function getCategoryIcon(slug: string): IconComponent {
  return CATEGORY_ICONS[slug] ?? ShoppingBag;
}
