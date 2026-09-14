"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteOrder } from "@/app/admin/(protected)/pedidos/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

/** `redirectTo`: navega pra lá após excluir (usado na página de detalhe do pedido,
 * que deixa de existir). Sem isso, só atualiza a lista (usado na tabela de pedidos). */
export function DeleteOrderButton({
  orderId,
  orderCode,
  redirectTo,
}: {
  orderId: string;
  orderCode: string;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [pending, startTransition] = React.useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteOrder(orderId);
      if (result.ok) {
        toast.success(`Pedido ${orderCode} excluído`);
        setOpen(false);
        if (redirectTo) router.push(redirectTo);
        else router.refresh();
      } else {
        toast.error("Não foi possível excluir o pedido");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={`Excluir pedido ${orderCode}`}
          onClick={(e) => e.stopPropagation()}
          className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive focus-visible:outline-2 focus-visible:outline-mint-600"
        >
          <Trash2 className="size-4" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir pedido {orderCode}?</DialogTitle>
          <DialogDescription>
            Essa ação não pode ser desfeita. O pedido e seus itens serão apagados permanentemente.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={pending}>
            Cancelar
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={pending}>
            {pending && <Loader2 className="size-4 animate-spin" />} Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
