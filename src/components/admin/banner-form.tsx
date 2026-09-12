"use client";

import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";

import { saveBanner, type BannerFormState } from "@/app/admin/(protected)/banners/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { Banner } from "@/types/database.types";

export function BannerForm({ banner }: { banner: Banner | null }) {
  const router = useRouter();
  const boundAction = saveBanner.bind(null, banner?.id ?? null);
  const [state, formAction, pending] = useActionState<BannerFormState, FormData>(boundAction, {});

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <fieldset className="grid gap-4 rounded-2xl border border-border bg-white p-5 sm:grid-cols-2">
        <legend className="px-1 font-display font-semibold text-pine-900">Banner</legend>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="title">Título</Label>
          <Input id="title" name="title" defaultValue={banner?.title} required />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="subtitle">Subtítulo (opcional)</Label>
          <Input id="subtitle" name="subtitle" defaultValue={banner?.subtitle ?? ""} />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="image_url">URL da imagem</Label>
          <Input id="image_url" name="image_url" defaultValue={banner?.image_url} required />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="href">Link de destino</Label>
          <Input id="href" name="href" defaultValue={banner?.href} placeholder="/produtos?destaque=novidades" required />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="position">Posição (ordem no carrossel)</Label>
          <Input id="position" name="position" type="number" defaultValue={banner?.position ?? 0} />
        </div>

        <div className="flex items-center gap-2.5 sm:col-span-2">
          <Switch id="active" name="active" defaultChecked={banner?.active ?? true} />
          <Label htmlFor="active">Ativo (exibido no carrossel da home)</Label>
        </div>
      </fieldset>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <div className="flex gap-3">
        <Button type="submit" size="lg" disabled={pending}>
          {pending && <Loader2 className="size-4 animate-spin" />} Salvar banner
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={() => router.push("/admin/banners")}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
