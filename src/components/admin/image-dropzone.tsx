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

/** Área de arrastar-e-soltar/clicar pra fazer upload, controlada por fora (value/onChange). */
export function ImageDropzone({
  value,
  onChange,
  folder,
  boxClassName = "aspect-video w-full max-w-sm",
}: {
  value: string;
  onChange: (url: string) => void;
  folder: string;
  boxClassName?: string;
}) {
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
    onChange(data.publicUrl);
    setUploading(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <>
      {value ? (
        <div className={cn("relative overflow-hidden rounded-xl border border-border bg-mint-50", boxClassName)}>
          <Image src={value} alt="" fill sizes="384px" className="object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Remover imagem"
            className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-pine-900/80 text-white hover:bg-pine-900"
          >
            <X className="size-3.5" />
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
            "flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed p-2 text-center transition-colors",
            boxClassName,
            dragOver ? "border-rose-500 bg-rose-50" : "border-border bg-mint-50/50 hover:bg-mint-50",
          )}
        >
          {uploading ? (
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          ) : (
            <ImagePlus className="size-5 text-muted-foreground" />
          )}
          <p className="text-[11px] leading-tight text-muted-foreground">
            {uploading ? "Enviando..." : "Arraste ou clique"}
          </p>
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
    </>
  );
}
