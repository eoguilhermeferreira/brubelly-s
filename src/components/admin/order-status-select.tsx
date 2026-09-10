"use client";

import * as React from "react";
import { toast } from "sonner";

import { updateOrderStatus } from "@/app/admin/(protected)/pedidos/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ORDER_STATUS_LABELS } from "@/lib/product-constants";
import type { OrderStatus } from "@/types/database.types";

const STATUSES: OrderStatus[] = [
  "aguardando_pagamento",
  "pago",
  "em_separacao",
  "enviado",
  "entregue",
  "cancelado",
];

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: OrderStatus }) {
  const [pending, startTransition] = React.useTransition();

  function handleChange(value: string) {
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, value as OrderStatus);
      if (result.ok) {
        toast.success("Status atualizado");
      } else {
        toast.error("Não foi possível atualizar o status");
      }
    });
  }

  return (
    <Select defaultValue={status} onValueChange={handleChange} disabled={pending}>
      <SelectTrigger className="w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUSES.map((s) => (
          <SelectItem key={s} value={s}>
            {ORDER_STATUS_LABELS[s]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
