import { Badge } from "@/components/ui/badge";
import { ORDER_STATUS_LABELS, ORDER_STATUS_TONE } from "@/lib/product-constants";
import type { OrderStatus } from "@/types/database.types";

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge variant={ORDER_STATUS_TONE[status]}>{ORDER_STATUS_LABELS[status]}</Badge>;
}
