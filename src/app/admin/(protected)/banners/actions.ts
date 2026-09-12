"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export type BannerFormState = { error?: string };

export async function saveBanner(
  bannerId: string | null,
  _prevState: BannerFormState,
  formData: FormData,
): Promise<BannerFormState> {
  const supabase = await createClient();

  const title = String(formData.get("title") ?? "").trim();
  const subtitle = String(formData.get("subtitle") ?? "").trim();
  const imageUrl = String(formData.get("image_url") ?? "").trim();
  const href = String(formData.get("href") ?? "").trim();
  const ctaLabel = String(formData.get("cta_label") ?? "").trim();
  const imagePosition = String(formData.get("image_position") ?? "").trim();
  const position = Number(formData.get("position") ?? 0);
  const active = formData.get("active") === "on";

  if (!title) return { error: "Título é obrigatório." };
  if (!imageUrl) return { error: "URL da imagem é obrigatória." };
  if (!href) return { error: "Link de destino é obrigatório." };

  const payload = {
    title,
    subtitle: subtitle || null,
    image_url: imageUrl,
    href,
    cta_label: ctaLabel || null,
    image_position: imagePosition || "center 30%",
    position: Number.isNaN(position) ? 0 : position,
    active,
  };

  if (bannerId) {
    const { error } = await supabase.from("banners").update(payload).eq("id", bannerId);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("banners").insert(payload);
    if (error) return { error: error.message };
  }

  revalidatePath("/admin/banners");
  revalidatePath("/");
  redirect("/admin/banners");
}

export async function deleteBanner(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("banners").delete().eq("id", id);
  revalidatePath("/admin/banners");
  revalidatePath("/");
  return { ok: !error };
}

export async function toggleBannerActive(id: string, active: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("banners").update({ active }).eq("id", id);
  revalidatePath("/admin/banners");
  revalidatePath("/");
  return { ok: !error };
}
