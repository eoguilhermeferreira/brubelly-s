"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Banner } from "@/types/database.types";

export function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = React.useState(0);
  const prefersReducedMotion = React.useRef(false);

  React.useEffect(() => {
    prefersReducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  React.useEffect(() => {
    if (banners.length <= 1 || prefersReducedMotion.current) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % banners.length), 6000);
    return () => clearInterval(id);
  }, [banners.length]);

  if (banners.length === 0) return null;
  const banner = banners[index];

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <Link href={banner.href} className="block">
        <div className="relative aspect-[16/9] sm:aspect-[21/9]">
          <Image
            src={banner.image_url}
            alt={banner.title}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pine-900/70 via-pine-900/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
            <p className="font-display text-xl font-bold text-white sm:text-3xl">{banner.title}</p>
            {banner.subtitle && (
              <p className="mt-1 text-sm text-white/85 sm:text-base">{banner.subtitle}</p>
            )}
          </div>
        </div>
      </Link>

      {banners.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Banner anterior"
            onClick={() => setIndex((i) => (i - 1 + banners.length) % banners.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-pine-900 shadow-sm hover:bg-white focus-visible:outline-2 focus-visible:outline-mint-600"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Próximo banner"
            onClick={() => setIndex((i) => (i + 1) % banners.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-pine-900 shadow-sm hover:bg-white focus-visible:outline-2 focus-visible:outline-mint-600"
          >
            <ChevronRight className="size-4" />
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {banners.map((b, i) => (
              <button
                key={b.id}
                type="button"
                aria-label={`Ir para banner ${i + 1}`}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === index ? "w-6 bg-white" : "w-1.5 bg-white/50",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
