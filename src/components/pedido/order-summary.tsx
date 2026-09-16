import { DeliveryMethodBadge } from "@/components/pedido/delivery-method-badge";
import { OrderStatusBadge } from "@/components/pedido/order-status-badge";
import { PayOrderButton } from "@/components/pedido/pay-order-button";
import { PaymentStatusBadge } from "@/components/pedido/payment-status-badge";
import { STORE } from "@/config/store";
import { formatDateTime, formatPrice } from "@/lib/format";
import type { Order } from "@/types/database.types";

/**
 * `allowPayment`: mostra o botão "Pagar agora" quando o pagamento ainda está
 * pendente. Só deve ser passado pela página pública "Meus pedidos" (guest,
 * já validada por código + e-mail) — nunca no admin.
 */
export function OrderSummary({ order, allowPayment = false }: { order: Order; allowPayment?: boolean }) {
  const canPay = allowPayment && order.payment_status !== "approved";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-tag text-lg font-semibold text-pine-900">{order.code}</p>
            <p className="text-sm text-muted-foreground">Feito em {formatDateTime(order.created_at)}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <DeliveryMethodBadge method={order.delivery_method} />
            <PaymentStatusBadge status={order.payment_status} />
            <OrderStatusBadge status={order.status} />
          </div>
        </div>
        {canPay && (
          <div className="flex flex-col gap-2 border-t border-border pt-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {order.payment_status === "rejected"
                ? "O pagamento anterior não foi aprovado. Você pode tentar novamente."
                : "Assim que o pagamento for confirmado, começamos a preparar seu pedido."}
            </p>
            <PayOrderButton code={order.code} email={order.customer_email} />
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border bg-white p-5">
        <p className="font-display font-semibold text-pine-900">Itens</p>
        <ul className="mt-3 flex flex-col divide-y divide-border">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center justify-between py-2.5 text-sm">
              <div>
                <p className="font-medium text-pine-900">{item.product_name}</p>
                {item.variation_label && (
                  <p className="text-xs text-muted-foreground">{item.variation_label}</p>
                )}
                <p className="text-xs text-muted-foreground">Qtd. {item.quantity}</p>
              </div>
              <span className="font-semibold text-pine-900">
                {formatPrice(item.unit_price_cents * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex flex-col gap-1 border-t border-border pt-3 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal_cents)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Frete</span>
            <span>{order.shipping_cents === 0 ? "Grátis" : formatPrice(order.shipping_cents)}</span>
          </div>
          <div className="flex justify-between font-display font-bold text-pine-900">
            <span>Total</span>
            <span>{formatPrice(order.total_cents)}</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white p-5">
        <p className="font-display font-semibold text-pine-900">
          {order.delivery_method === "retirada" ? "Retirada na loja" : "Entrega"}
        </p>
        {order.delivery_method === "retirada" ? (
          <>
            <p className="mt-2 text-sm text-pine-900">{order.shipping_address.recipient}</p>
            <p className="text-sm text-muted-foreground">
              {STORE.address.street}, {STORE.address.number} — {STORE.address.city}/{STORE.address.state}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Chame o cliente no WhatsApp pra combinar o dia e horário de retirada.
            </p>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-pine-900">{order.shipping_address.recipient}</p>
            <p className="text-sm text-muted-foreground">
              {order.shipping_address.street}, {order.shipping_address.number}
              {order.shipping_address.complement ? ` — ${order.shipping_address.complement}` : ""}
            </p>
            <p className="text-sm text-muted-foreground">
              {order.shipping_address.neighborhood}, {order.shipping_address.city} - {order.shipping_address.state}
            </p>
            <p className="text-sm text-muted-foreground">CEP {order.shipping_address.cep}</p>
          </>
        )}
      </div>
    </div>
  );
}
