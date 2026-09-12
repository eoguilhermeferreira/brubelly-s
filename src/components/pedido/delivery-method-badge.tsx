import { Store, Truck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { DeliveryMethod } from "@/types/database.types";

export function DeliveryMethodBadge({ method }: { method: DeliveryMethod }) {
  if (method === "retirada") {
    return (
      <Badge variant="mint" className="gap-1">
        <Store className="size-3" /> Retirada na loja
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="gap-1">
      <Truck className="size-3" /> Entrega
    </Badge>
  );
}
