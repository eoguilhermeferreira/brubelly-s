"use client";

import * as React from "react";
import { toast } from "sonner";

import { updateTrackingCode } from "@/app/admin/(protected)/pedidos/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function TrackingCodeField({ orderId, trackingCode }: { orderId: string; trackingCode: string | null }) {
  const [value, setValue] = React.useState(trackingCode ?? "");
  const [pending, startTransition] = React.useTransition();

  function handleSave() {
    startTransition(async () => {
      const result = await updateTrackingCode(orderId, value);
      if (result.ok) {
        toast.success("Código de rastreio salvo");
      } else {
        toast.error("Não foi possível salvar o código de rastreio");
      }
    });
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-5">
      <Label htmlFor="tracking_code">Código ou link de rastreio (opcional)</Label>
      <p className="mt-1 text-xs text-muted-foreground">
        Incluído no e-mail de &quot;pedido enviado&quot; quando preenchido.
      </p>
      <div className="mt-2 flex gap-2">
        <Input
          id="tracking_code"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ex: BR123456789BR ou link da transportadora"
        />
        <Button type="button" variant="outline" onClick={handleSave} disabled={pending}>
          Salvar
        </Button>
      </div>
    </div>
  );
}
