"use client";

import * as React from "react";
import { toast } from "sonner";

import { markOrderShipped, updateOrderStatus } from "@/app/admin/(protected)/pedidos/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ORDER_STATUS_LABELS } from "@/lib/product-constants";
import type { DeliveryMethod, OrderStatus } from "@/types/database.types";

const ENTREGA_STATUSES: OrderStatus[] = [
  "pedido_recebido",
  "em_separacao",
  "enviado",
  "entregue",
  "cancelado",
];

const RETIRADA_STATUSES: OrderStatus[] = [
  "pedido_recebido",
  "em_separacao",
  "pronto_para_retirar",
  "cancelado",
];

export function OrderStatusSelect({
  orderId,
  status,
  deliveryMethod,
  trackingCode,
}: {
  orderId: string;
  status: OrderStatus;
  deliveryMethod: DeliveryMethod;
  trackingCode: string | null;
}) {
  const [value, setValue] = React.useState<OrderStatus>(status);
  const [pending, startTransition] = React.useTransition();
  const [shippingDialogOpen, setShippingDialogOpen] = React.useState(false);
  const [trackingInput, setTrackingInput] = React.useState(trackingCode ?? "");
  const statuses = deliveryMethod === "retirada" ? RETIRADA_STATUSES : ENTREGA_STATUSES;

  function handleChange(next: string) {
    const nextStatus = next as OrderStatus;

    // "Enviado" precisa do código de rastreio antes de confirmar — o campo
    // só aparece nesse momento, não fica exposto o tempo todo.
    if (nextStatus === "enviado" && value !== "enviado") {
      setShippingDialogOpen(true);
      return;
    }

    setValue(nextStatus);
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, nextStatus);
      if (result.ok) {
        toast.success("Status atualizado");
      } else {
        toast.error("Não foi possível atualizar o status");
        setValue(status);
      }
    });
  }

  function handleConfirmShipping() {
    startTransition(async () => {
      const result = await markOrderShipped(orderId, trackingInput);
      if (result.ok) {
        setValue("enviado");
        setShippingDialogOpen(false);
        toast.success("Pedido marcado como enviado");
      } else {
        toast.error("Não foi possível atualizar o status");
      }
    });
  }

  return (
    <>
      <Select value={value} onValueChange={handleChange} disabled={pending}>
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {statuses.map((s) => (
            <SelectItem key={s} value={s}>
              {ORDER_STATUS_LABELS[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={shippingDialogOpen} onOpenChange={setShippingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Marcar pedido como enviado</DialogTitle>
            <DialogDescription>
              O código de rastreio é opcional, mas quando preenchido é incluído no e-mail avisando o cliente.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="shipping-tracking-code">Código ou link de rastreio</Label>
            <Input
              id="shipping-tracking-code"
              value={trackingInput}
              onChange={(e) => setTrackingInput(e.target.value)}
              placeholder="Ex: BR123456789BR ou link da transportadora"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShippingDialogOpen(false)} disabled={pending}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleConfirmShipping} disabled={pending}>
              Confirmar envio
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
