"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { parsePriceInput, slugify } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

export type ProductFormState = { error?: string };

export async function saveProduct(
  productId: string | null,
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const supabase = await createClient();

  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const slug = slugify(slugInput || name);
  const description = String(formData.get("description") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "");
  const color = String(formData.get("color") ?? "").trim();
  const priceCents = parsePriceInput(String(formData.get("price") ?? ""));
  const compareInput = String(formData.get("compare_price") ?? "").trim();
  const compareCents = compareInput ? parsePriceInput(compareInput) : null;
  const stock = Number(formData.get("stock") ?? 0);
  const weightGrams = Number(formData.get("weight_grams") ?? 0);
  const featuredSectionInput = String(formData.get("featured_section") ?? "");
  const active = formData.get("active") === "on";

  if (!name) return { error: "Nome é obrigatório." };
  if (!categoryId) return { error: "Selecione uma categoria." };
  if (priceCents === null || priceCents <= 0) return { error: "Preço inválido." };
  if (Number.isNaN(stock) || stock < 0) return { error: "Estoque inválido." };

  const productPayload = {
    name,
    slug,
    description,
    category_id: categoryId,
    color: color || null,
    price_cents: priceCents,
    compare_at_price_cents: compareCents && compareCents > 0 ? compareCents : null,
    stock,
    weight_grams: Number.isNaN(weightGrams) ? 0 : weightGrams,
    active,
    featured_section: featuredSectionInput || null,
  };

  let id = productId;
  if (id) {
    const { error } = await supabase.from("products").update(productPayload).eq("id", id);
    if (error) return { error: error.code === "23505" ? "Já existe um produto com esse slug." : error.message };
  } else {
    const { data, error } = await supabase.from("products").insert(productPayload).select("id").single();
    if (error) return { error: error.code === "23505" ? "Já existe um produto com esse slug." : error.message };
    id = data.id;
  }

  let images: { url: string; alt: string }[] = [];
  try {
    images = JSON.parse(String(formData.get("images") ?? "[]"));
  } catch {
    images = [];
  }
  images = images.filter((img) => img.url?.trim());

  await supabase.from("product_images").delete().eq("product_id", id);
  if (images.length > 0) {
    await supabase.from("product_images").insert(
      images.map((img, i) => ({
        product_id: id,
        url: img.url.trim(),
        alt: img.alt?.trim() || name,
        position: i + 1,
      })),
    );
  }

  let variations: { value: string; stock: number }[] = [];
  try {
    variations = JSON.parse(String(formData.get("variations") ?? "[]"));
  } catch {
    variations = [];
  }
  variations = variations.filter((v) => v.value?.trim());

  await supabase.from("product_variations").delete().eq("product_id", id);
  if (variations.length > 0) {
    await supabase.from("product_variations").insert(
      variations.map((v) => ({
        product_id: id,
        label: "Tamanho",
        value: v.value.trim(),
        stock: Number(v.stock) || 0,
      })),
    );
  }

  revalidatePath("/admin/produtos");
  revalidatePath(`/admin/produtos/${id}`);
  revalidatePath("/produtos");
  redirect("/admin/produtos");
}

export async function toggleProductActive(id: string, active: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").update({ active }).eq("id", id);
  revalidatePath("/admin/produtos");
  revalidatePath("/produtos");
  return { ok: !error };
}
