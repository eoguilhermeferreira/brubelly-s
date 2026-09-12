import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { OrderSummary } from "@/components/pedido/order-summary";
import { getOrderById } from "@/lib/queries";

export default async function AdminPedidoDetailPage({ params }: PageProps<"/admin/pedidos/[id]">) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/admin/pedidos" className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-pine-900">
          <ArrowLeft className="size-4" /> Voltar para pedidos
        </Link>
        <OrderStatusSelect orderId={order.id} status={order.status} deliveryMethod={order.delivery_method} />
      </div>

      <div className="rounded-2xl border border-border bg-white p-5">
        <p className="font-display font-semibold text-pine-900">Cliente</p>
        <p className="mt-1 text-sm text-pine-900">{order.customer_name}</p>
        <p className="text-sm text-muted-foreground">{order.customer_email} · {order.customer_phone}</p>
      </div>

      <OrderSummary order={order} />
    </div>
  );
}
