import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { DeleteOrderButton } from "@/components/admin/delete-order-button";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { TrackingCodeField } from "@/components/admin/tracking-code-field";
import { WhatsappIcon } from "@/components/icons/whatsapp-icon";
import { OrderSummary } from "@/components/pedido/order-summary";
import { Button } from "@/components/ui/button";
import { STORE } from "@/config/store";
import { buildWhatsappUrl } from "@/lib/format";
import { getOrderById } from "@/lib/queries";

export default async function AdminPedidoDetailPage({ params }: PageProps<"/admin/pedidos/[id]">) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  const firstName = order.customer_name.trim().split(" ")[0];
  const whatsappMessage = `Oi ${firstName}! Aqui é da ${STORE.shortName} 💚 Sobre o seu pedido ${order.code}...`;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/admin/pedidos" className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-pine-900">
          <ArrowLeft className="size-4" /> Voltar para pedidos
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="bg-[#25D366] text-white hover:bg-[#1ea952]">
            <a href={buildWhatsappUrl(order.customer_phone, whatsappMessage)} target="_blank" rel="noopener noreferrer">
              <WhatsappIcon className="size-4" /> WhatsApp
            </a>
          </Button>
          <OrderStatusSelect
            orderId={order.id}
            status={order.status}
            deliveryMethod={order.delivery_method}
            trackingCode={order.tracking_code}
          />
          <DeleteOrderButton orderId={order.id} orderCode={order.code} redirectTo="/admin/pedidos" />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-white p-5">
        <p className="font-display font-semibold text-pine-900">Cliente</p>
        <p className="mt-1 text-sm text-pine-900">{order.customer_name}</p>
        <p className="text-sm text-muted-foreground">{order.customer_email} · {order.customer_phone}</p>
      </div>

      {order.delivery_method === "entrega" && (order.status === "enviado" || order.status === "entregue") && (
        <TrackingCodeField orderId={order.id} trackingCode={order.tracking_code} />
      )}

      <OrderSummary order={order} />
    </div>
  );
}
