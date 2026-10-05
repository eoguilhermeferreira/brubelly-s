"use client";

import * as React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import type { Product } from "@/types/database.types";

const DRAG_THRESHOLD_PX = 40;

export function ProductGallery({
  images,
  productName,
}: {
  images: Product["images"];
  productName: string;
}) {
  const [index, setIndex] = React.useState(0);
  const dragStartXRef = React.useRef<number | null>(null);

  if (images.length === 0) {
    return (
      <div className="tag-shape relative aspect-square overflow-hidden bg-mint-50">
        <span className="tag-hole z-10" aria-hidden />
      </div>
    );
  }

  const active = images[index];

  function handlePointerDown(e: React.PointerEvent) {
    dragStartXRef.current = e.clientX;
  }

  function handlePointerUp(e: React.PointerEvent) {
    const startX = dragStartXRef.current;
    dragStartXRef.current = null;
    if (startX === null) return;
    const deltaX = e.clientX - startX;
    if (Math.abs(deltaX) < DRAG_THRESHOLD_PX) return;
    if (deltaX < 0) setIndex((i) => (i + 1) % images.length);
    else setIndex((i) => (i - 1 + images.length) % images.length);
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className="tag-shape relative aspect-square touch-pan-y select-none overflow-hidden bg-mint-50"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <span className="tag-hole z-10" aria-hidden />
        <Image
          key={active.url}
          src={active.url}
          alt={active.alt || productName}
          fill
          priority={index === 0}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          draggable={false}
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.url + i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ver foto ${i + 1} de ${productName}`}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-xl border-2 transition-colors sm:size-20",
                i === index ? "border-rose-500" : "border-border hover:border-rose-300",
              )}
            >
              <Image src={img.url} alt={img.alt || productName} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
