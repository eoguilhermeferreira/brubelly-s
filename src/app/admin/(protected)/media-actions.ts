"use server";

import { getAdminProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

/**
 * Gera uma signed upload URL pro Supabase Storage — o navegador sobe o
 * arquivo direto pro bucket "media" (sem passar pelos bytes por essa server
 * action), evitando o limite de 1MB de payload de Server Action.
 */
export type MediaUploadUrlResult = { path: string; token: string } | { error: string };

const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

export async function createMediaUploadUrl(
  folder: string,
  fileName: string,
): Promise<MediaUploadUrlResult> {
  const admin = await getAdminProfile();
  if (!admin) return { error: "Não autorizado." };

  const extension = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return { error: "Formato de arquivo não suportado. Use JPG, PNG ou WEBP." };
  }

  const path = `${folder}/${crypto.randomUUID()}.${extension}`;

  const supabase = await createClient();
  const { data, error } = await supabase.storage.from("media").createSignedUploadUrl(path);
  if (error || !data) return { error: "Não foi possível preparar o upload. Tente novamente." };

  return { path: data.path, token: data.token };
}
