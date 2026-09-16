import { Badge } from "@/components/ui/badge";
import { PAYMENT_STATUS_LABELS, PAYMENT_STATUS_TONE } from "@/lib/product-constants";
import type { PaymentStatus } from "@/types/database.types";

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return <Badge variant={PAYMENT_STATUS_TONE[status]}>{PAYMENT_STATUS_LABELS[status]}</Badge>;
}
