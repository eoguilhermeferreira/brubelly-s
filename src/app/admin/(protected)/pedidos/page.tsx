import Link from "next/link";

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
import { getOrders } from "@/lib/queries";

export const metadata = { title: "Pedidos" };

export default async function AdminPedidosPage() {
  const orders = await getOrders();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-pine-900">Pedidos</h1>
        <p className="text-sm text-muted-foreground">{orders.length} pedidos</p>
      </div>

      <div className="rounded-2xl border border-border bg-white p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pedido</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Pagamento</TableHead>
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
                <TableCell className="text-muted-foreground">{formatDate(order.created_at)}</TableCell>
                <TableCell className="text-muted-foreground capitalize">{order.payment_status}</TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell className="text-right font-medium">{formatPrice(order.total_cents)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
