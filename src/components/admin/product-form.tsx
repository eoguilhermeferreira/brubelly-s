"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { Loader2, Plus, X } from "lucide-react";

import { saveProduct, type ProductFormState } from "@/app/admin/(protected)/produtos/actions";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { centsToInputValue } from "@/lib/format";
import type { Category, Product } from "@/types/database.types";

const FEATURED_OPTIONS = [
  { value: "none", label: "Nenhum" },
  { value: "novidades", label: "Novidades" },
  { value: "mais-vendidos", label: "Mais vendidos" },
  { value: "promocoes", label: "Promoções" },
] as const;

type ImageRow = { url: string; alt: string };
type VariationRow = { value: string; stock: string };

export function ProductForm({ product, categories }: { product: Product | null; categories: Category[] }) {
  const router = useRouter();
  const boundAction = saveProduct.bind(null, product?.id ?? null);
  const [state, formAction, pending] = useActionState<ProductFormState, FormData>(boundAction, {});

  const [images, setImages] = React.useState<ImageRow[]>(
    product && product.images.length > 0 ? product.images.map((i) => ({ url: i.url, alt: i.alt })) : [{ url: "", alt: "" }],
  );
  const [variations, setVariations] = React.useState<VariationRow[]>(
    product && product.variations.length > 0
      ? product.variations.map((v) => ({ value: v.value, stock: String(v.stock) }))
      : [],
  );

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <fieldset className="grid gap-4 rounded-2xl border border-border bg-white p-5 sm:grid-cols-2">
        <legend className="px-1 font-display font-semibold text-pine-900">Dados do produto</legend>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="name">Nome</Label>
          <Input id="name" name="name" defaultValue={product?.name} required />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="slug">Slug (opcional, gerado do nome se vazio)</Label>
          <Input id="slug" name="slug" defaultValue={product?.slug} placeholder="ex: vestido-jardim-encantado" />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="category_id">Categoria</Label>
          <Select name="category_id" defaultValue={product?.category_id}>
            <SelectTrigger id="category_id">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.parent_id ? `↳ ${c.name}` : c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea id="description" name="description" defaultValue={product?.description} rows={4} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="color">Cor</Label>
          <Input id="color" name="color" defaultValue={product?.color ?? ""} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="featured_section">Destaque</Label>
          <Select name="featured_section" defaultValue={product?.featured_section ?? "none"}>
            <SelectTrigger id="featured_section">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FEATURED_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="price">Preço (R$)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={product ? centsToInputValue(product.price_cents) : undefined}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="compare_price">Preço &quot;de&quot; (opcional, para promoção)</Label>
          <Input
            id="compare_price"
            name="compare_price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={
              product?.compare_at_price_cents ? centsToInputValue(product.compare_at_price_cents) : undefined
            }
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="stock">Estoque</Label>
          <Input id="stock" name="stock" type="number" min="0" defaultValue={product?.stock ?? 0} required />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="weight_grams">Peso (gramas)</Label>
          <Input
            id="weight_grams"
            name="weight_grams"
            type="number"
            min="0"
            defaultValue={product?.weight_grams ?? 0}
            required
          />
        </div>

        <div className="flex items-center gap-2.5 sm:col-span-2">
          <Switch id="active" name="active" defaultChecked={product?.active ?? true} />
          <Label htmlFor="active">Ativo (visível na loja)</Label>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-5">
        <legend className="px-1 font-display font-semibold text-pine-900">Imagens</legend>
        {images.map((img, i) => (
          <div key={i} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
            <Input
              placeholder="URL da imagem"
              value={img.url}
              onChange={(e) => setImages((prev) => prev.map((row, idx) => (idx === i ? { ...row, url: e.target.value } : row)))}
            />
            <Input
              placeholder="Texto alternativo (opcional)"
              value={img.alt}
              onChange={(e) => setImages((prev) => prev.map((row, idx) => (idx === i ? { ...row, alt: e.target.value } : row)))}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
              disabled={images.length === 1}
            >
              <X className="size-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" className="w-fit" onClick={() => setImages((prev) => [...prev, { url: "", alt: "" }])}>
          <Plus className="size-4" /> Adicionar imagem
        </Button>
        <input type="hidden" name="images" value={JSON.stringify(images)} />
      </fieldset>

      <fieldset className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-5">
        <legend className="px-1 font-display font-semibold text-pine-900">Variações (tamanhos)</legend>
        <p className="text-xs text-muted-foreground">Deixe em branco se o produto não tem tamanhos (ex: acessórios).</p>
        {variations.map((v, i) => (
          <div key={i} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
            <Input
              placeholder="Tamanho (ex: P, 2, 24)"
              value={v.value}
              onChange={(e) => setVariations((prev) => prev.map((row, idx) => (idx === i ? { ...row, value: e.target.value } : row)))}
            />
            <Input
              placeholder="Estoque"
              type="number"
              min="0"
              value={v.stock}
              onChange={(e) => setVariations((prev) => prev.map((row, idx) => (idx === i ? { ...row, stock: e.target.value } : row)))}
            />
            <Button type="button" variant="outline" size="icon" onClick={() => setVariations((prev) => prev.filter((_, idx) => idx !== i))}>
              <X className="size-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" className="w-fit" onClick={() => setVariations((prev) => [...prev, { value: "", stock: "0" }])}>
          <Plus className="size-4" /> Adicionar tamanho
        </Button>
        <input type="hidden" name="variations" value={JSON.stringify(variations)} />
      </fieldset>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <div className="flex gap-3">
        <Button type="submit" size="lg" disabled={pending}>
          {pending && <Loader2 className="size-4 animate-spin" />} Salvar produto
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={() => router.push("/admin/produtos")}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
