"use client";

import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";

import { saveCategory, type CategoryFormState } from "@/app/admin/(protected)/categorias/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category } from "@/types/database.types";

export function CategoryForm({ category, parentOptions }: { category: Category | null; parentOptions: Category[] }) {
  const router = useRouter();
  const boundAction = saveCategory.bind(null, category?.id ?? null);
  const [state, formAction, pending] = useActionState<CategoryFormState, FormData>(boundAction, {});

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <fieldset className="grid gap-4 rounded-2xl border border-border bg-white p-5 sm:grid-cols-2">
        <legend className="px-1 font-display font-semibold text-pine-900">Categoria</legend>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Nome</Label>
          <Input id="name" name="name" defaultValue={category?.name} required />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="slug">Slug (opcional, gerado do nome se vazio)</Label>
          <Input id="slug" name="slug" defaultValue={category?.slug} placeholder="ex: menina-vestidos" />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="parent_id">Categoria principal (deixe &quot;Nenhuma&quot; para categoria de topo)</Label>
          <Select name="parent_id" defaultValue={category?.parent_id ?? "none"}>
            <SelectTrigger id="parent_id">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhuma (categoria principal)</SelectItem>
              {parentOptions
                .filter((c) => c.id !== category?.id)
                .map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="position">Posição (ordem de exibição)</Label>
          <Input id="position" name="position" type="number" defaultValue={category?.position ?? 0} />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="image_url">URL da imagem (opcional, usada em categorias principais)</Label>
          <Input id="image_url" name="image_url" defaultValue={category?.image_url ?? ""} />
        </div>
      </fieldset>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <div className="flex gap-3">
        <Button type="submit" size="lg" disabled={pending}>
          {pending && <Loader2 className="size-4 animate-spin" />} Salvar categoria
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={() => router.push("/admin/categorias")}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
