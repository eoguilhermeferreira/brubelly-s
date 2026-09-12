"use client";

import * as React from "react";
import { toast } from "sonner";

import { toggleBannerActive } from "@/app/admin/(protected)/banners/actions";
import { Switch } from "@/components/ui/switch";

export function BannerActiveToggle({ bannerId, active }: { bannerId: string; active: boolean }) {
  const [pending, startTransition] = React.useTransition();
  const [checked, setChecked] = React.useState(active);

  function handleChange(value: boolean) {
    setChecked(value);
    startTransition(async () => {
      const result = await toggleBannerActive(bannerId, value);
      if (!result.ok) {
        setChecked(!value);
        toast.error("Não foi possível atualizar o banner");
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Switch checked={checked} onCheckedChange={handleChange} disabled={pending} />
      <span className="text-xs text-muted-foreground">{checked ? "Ativo" : "Inativo"}</span>
    </div>
  );
}
