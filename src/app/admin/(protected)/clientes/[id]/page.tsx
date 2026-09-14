import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone } from "lucide-react";

import { CustomerWhatsappSender } from "@/components/admin/customer-whatsapp-sender";
import { OrderStatusBadge } from "@/components/pedido/order-status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { STORE } from "@/config/store";
import { formatDate, formatPhone, formatPrice } from "@/lib/format";
import { getCustomerById, getOrdersByCustomerEmail } from "@/lib/queries";

export default async function AdminClienteDetailPage({ params }: PageProps<"/admin/clientes/[id]">) {
  const { id } = await params;
  const customer = await getCustomerById(id);
  if (!customer) notFound();

  const orders = await getOrdersByCustomerEmail(customer.email);
  const firstName = customer.name.trim().split(" ")[0];
  const defaultMessage = `Oi ${firstName}! Aqui é da ${STORE.shortName} 💚 Separei uma novidade que combina com você, dá uma olhada:\n\n`;

  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin/clientes" className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-pine-900">
        <ArrowLeft className="size-4" /> Voltar para clientes
      </Link>

      <div className="rounded-2xl border border-border bg-white p-5">
        <h1 className="font-display text-2xl font-bold text-pine-900">{customer.name}</h1>
        <div className="mt-3 flex flex-col gap-1.5 text-sm text-pine-900">
          <span className="flex items-center gap-2">
            <Mail className="size-4 text-muted-foreground" /> {customer.email}
          </span>
          <span className="flex items-center gap-2">
            <Phone className="size-4 text-muted-foreground" /> {formatPhone(customer.phone)}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-6 border-t border-border pt-4 text-sm">
          <div>
            <p className="text-muted-foreground">Pedidos</p>
            <p className="font-display text-lg font-semibold text-pine-900">{customer.orders_count}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total gasto</p>
            <p className="font-display text-lg font-semibold text-pine-900">
              {formatPrice(customer.total_spent_cents)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Cliente desde</p>
            <p className="font-display text-lg font-semibold text-pine-900">{formatDate(customer.created_at)}</p>
          </div>
        </div>
      </div>

      <CustomerWhatsappSender phone={customer.phone} defaultMessage={defaultMessage} />

      <div className="rounded-2xl border border-border bg-white p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pedido</TableHead>
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
                <TableCell className="text-muted-foreground">{formatDate(order.created_at)}</TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell className="text-right font-medium">{formatPrice(order.total_cents)}</TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="py-6 text-center text-sm text-muted-foreground">
                  Nenhum pedido encontrado pra esse e-mail.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
