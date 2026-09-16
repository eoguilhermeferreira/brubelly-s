import { ClickableTableRow } from "@/components/admin/clickable-table-row";
import { DeleteOrderButton } from "@/components/admin/delete-order-button";
import { DeliveryMethodBadge } from "@/components/pedido/delivery-method-badge";
import { OrderStatusBadge } from "@/components/pedido/order-status-badge";
import { PaymentStatusBadge } from "@/components/pedido/payment-status-badge";
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
              <TableHead>Entrega</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Pagamento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <ClickableTableRow key={order.id} href={`/admin/pedidos/${order.id}`}>
                <TableCell>
                  <span className="font-tag text-sm font-semibold text-rose-600">{order.code}</span>
                </TableCell>
                <TableCell>{order.customer_name}</TableCell>
                <TableCell>
                  <DeliveryMethodBadge method={order.delivery_method} />
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDate(order.created_at)}</TableCell>
                <TableCell>
                  <PaymentStatusBadge status={order.payment_status} />
                </TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell className="text-right font-medium">{formatPrice(order.total_cents)}</TableCell>
                <TableCell>
                  <DeleteOrderButton orderId={order.id} orderCode={order.code} />
                </TableCell>
              </ClickableTableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
