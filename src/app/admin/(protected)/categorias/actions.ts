"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { slugify } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

export type CategoryFormState = { error?: string };

export async function saveCategory(
  categoryId: string | null,
  _prevState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  const supabase = await createClient();

  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const slug = slugify(slugInput || name);
  const parentIdRaw = String(formData.get("parent_id") ?? "");
  const parentId = parentIdRaw && parentIdRaw !== "none" ? parentIdRaw : null;
  const imageUrl = String(formData.get("image_url") ?? "").trim();
  const position = Number(formData.get("position") ?? 0);

  if (!name) return { error: "Nome é obrigatório." };
  if (parentId === categoryId) return { error: "Uma categoria não pode ser subcategoria dela mesma." };

  const payload = {
    name,
    slug,
    parent_id: parentId,
    image_url: imageUrl || null,
    position: Number.isNaN(position) ? 0 : position,
  };

  if (categoryId) {
    const { error } = await supabase.from("categories").update(payload).eq("id", categoryId);
    if (error) return { error: error.code === "23505" ? "Já existe uma categoria com esse slug." : error.message };
  } else {
    const { error } = await supabase.from("categories").insert(payload);
    if (error) return { error: error.code === "23505" ? "Já existe uma categoria com esse slug." : error.message };
  }

  revalidatePath("/admin/categorias");
  revalidatePath("/");
  redirect("/admin/categorias");
}
