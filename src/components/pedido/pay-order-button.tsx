"use client";

import * as React from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { payOrderAgain } from "@/app/(store)/pedido/actions";
import { Button } from "@/components/ui/button";

export function PayOrderButton({ code, email }: { code: string; email: string }) {
  const [loading, setLoading] = React.useState(false);

  async function handleClick() {
    setLoading(true);
    const result = await payOrderAgain(code, email);
    if (result.ok) {
      window.location.href = result.url;
      return;
    }
    setLoading(false);
    toast.error(result.error);
  }

  return (
    <Button type="button" onClick={handleClick} disabled={loading} className="w-full sm:w-auto">
      {loading ? <Loader2 className="size-4 animate-spin" /> : <CreditCard className="size-4" />}
      Pagar agora
    </Button>
  );
}
