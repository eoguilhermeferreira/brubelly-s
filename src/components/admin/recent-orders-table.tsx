import Link from "next/link";

import { DeliveryMethodBadge } from "@/components/pedido/delivery-method-badge";
import { OrderStatusBadge } from "@/components/pedido/order-status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatPrice } from "@/lib/format";
import type { Order } from "@/types/database.types";

export function RecentOrdersTable({ orders }: { orders: Order[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Pedido</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Entrega</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>
              <Link href={`/admin/pedidos/${order.id}`} className="font-tag text-sm font-semibold text-rose-600 hover:underline">
                {order.code}
              </Link>
            </TableCell>
            <TableCell>{order.customer_name}</TableCell>
            <TableCell>
              <DeliveryMethodBadge method={order.delivery_method} />
            </TableCell>
            <TableCell className="text-muted-foreground">{formatDate(order.created_at)}</TableCell>
            <TableCell>
              <OrderStatusBadge status={order.status} />
            </TableCell>
            <TableCell className="text-right font-medium">{formatPrice(order.total_cents)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
