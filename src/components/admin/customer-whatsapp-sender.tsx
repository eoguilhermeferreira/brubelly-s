"use client";

import * as React from "react";

import { WhatsappIcon } from "@/components/icons/whatsapp-icon";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { buildWhatsappUrl } from "@/lib/format";

export function CustomerWhatsappSender({ phone, defaultMessage }: { phone: string; defaultMessage: string }) {
  const [message, setMessage] = React.useState(defaultMessage);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-5">
      <p className="font-display font-semibold text-pine-900">Mandar mensagem no WhatsApp</p>
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        className="resize-none"
      />
      <Button asChild size="lg" className="w-fit bg-[#25D366] text-white hover:bg-[#1ea952]">
        <a href={buildWhatsappUrl(phone, message)} target="_blank" rel="noopener noreferrer">
          <WhatsappIcon className="size-4" /> Abrir no WhatsApp
        </a>
      </Button>
    </div>
  );
}
