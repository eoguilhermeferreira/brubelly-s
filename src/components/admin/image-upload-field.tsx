"use client";

import * as React from "react";

import { ImageDropzone } from "@/components/admin/image-dropzone";

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

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-pine-900">{label}</span>
      <input type="hidden" name={name} value={value} required={required} />
      <ImageDropzone value={value} onChange={setValue} folder={folder} />
      {!value && (
        <p className="text-[11px] text-muted-foreground/70">JPG, PNG ou WEBP — até 5MB</p>
      )}
    </div>
  );
}
