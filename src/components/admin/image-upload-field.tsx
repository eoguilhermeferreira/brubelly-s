"use client";

import * as React from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";

import { createMediaUploadUrl } from "@/app/admin/(protected)/media-actions";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function ImageUploadField({
  name,
  label,
  folder,
  defaultValue,
  required,
}: {
  name: string;
  label: string;
  folder: string;
  defaultValue?: string;
  required?: boolean;
}) {
  const [value, setValue] = React.useState(defaultValue ?? "");
  const [uploading, setUploading] = React.useState(false);
  const [dragOver, setDragOver] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Formato não suportado. Use JPG, PNG ou WEBP.");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      toast.error("Imagem muito grande — máximo de 5MB.");
      return;
    }

    setUploading(true);
    const result = await createMediaUploadUrl(folder, file.name);
    if ("error" in result) {
      toast.error(result.error);
      setUploading(false);
      return;
    }

    const supabase = createClient();
    const { error: uploadError } = await supabase.storage
      .from("media")
      .uploadToSignedUrl(result.path, result.token, file);

    if (uploadError) {
      toast.error("Falha no upload da imagem. Tente novamente.");
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("media").getPublicUrl(result.path);
    setValue(data.publicUrl);
    setUploading(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-pine-900">{label}</span>
      <input type="hidden" name={name} value={value} required={required} />

      {value ? (
        <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-xl border border-border bg-mint-50">
          <Image src={value} alt="" fill sizes="384px" className="object-cover" />
          <button
            type="button"
            onClick={() => setValue("")}
            aria-label="Remover imagem"
            className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-pine-900/80 text-white hover:bg-pine-900"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex aspect-video w-full max-w-sm cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-center transition-colors",
            dragOver ? "border-rose-500 bg-rose-50" : "border-border bg-mint-50/50 hover:bg-mint-50",
          )}
        >
          {uploading ? (
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          ) : (
            <ImagePlus className="size-6 text-muted-foreground" />
          )}
          <p className="px-4 text-xs text-muted-foreground">
            {uploading ? "Enviando..." : "Arraste uma imagem aqui ou clique pra escolher"}
          </p>
          <p className="text-[11px] text-muted-foreground/70">JPG, PNG ou WEBP — até 5MB</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
