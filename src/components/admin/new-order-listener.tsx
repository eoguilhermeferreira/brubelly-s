"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { formatPrice } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";

let audioContext: AudioContext | null = null;

/** Som curto de duas notas — sintetizado na hora, sem depender de arquivo de áudio. */
function playNewOrderChime() {
  try {
    audioContext ??= new AudioContext();
    if (audioContext.state === "suspended") void audioContext.resume();

    const ctx = audioContext;
    const now = ctx.currentTime;
    [660, 880].forEach((frequency, i) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + i * 0.14;

      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.3, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.35);
    });
  } catch {
    // navegador sem suporte a Web Audio (ou contexto bloqueado) — o toast e o
    // refresh automático da lista já avisam visualmente, o som é só bônus.
  }
}

/**
 * Escuta pedidos novos em tempo real (Supabase Realtime) em todo o painel
 * admin — toca um aviso sonoro, mostra um toast e atualiza a página atual
 * automaticamente, sem precisar de F5.
 */
export function NewOrderListener() {
  const router = useRouter();

  React.useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("admin-new-orders")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          const order = payload.new as { code: string; customer_name: string; total_cents: number };
          playNewOrderChime();
          toast.success(`Novo pedido! ${order.code}`, {
            description: `${order.customer_name} — ${formatPrice(order.total_cents)}`,
          });
          router.refresh();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
