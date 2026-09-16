"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import type { Banner } from "@/types/database.types";

const AUTOPLAY_MS = 3000;

export function PromoBannerCarousel({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (banners.length <= 1) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % banners.length), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [banners.length]);

  if (banners.length === 0) return null;
  const banner = banners[index];

  return (
    <section className="relative left-1/2 right-1/2 -mx-[50vw] mt-4 w-screen">
      <Link href={banner.href} className="relative block h-72 w-full sm:h-[420px] lg:h-[520px]">
        <Image
          src={banner.image_url}
          alt={banner.title}
          fill
          priority={false}
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: banner.image_position }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-pine-900/70 via-pine-900/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-2 p-6 sm:p-10">
          <span className="w-fit rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-pine-900">
            Novidade
          </span>
          <h2 className="max-w-sm font-display text-2xl font-bold leading-tight text-white sm:text-4xl">
            {banner.title}
          </h2>
          {banner.subtitle && (
            <p className="max-w-xs text-sm text-white/90 sm:text-base">{banner.subtitle}</p>
          )}
          {banner.cta_label && (
            <span className="mt-2 inline-flex h-11 w-fit items-center rounded-full bg-rose-600 px-6 font-display text-sm font-semibold text-white shadow-[0_2px_12px_rgba(0,0,0,0.25)]">
              {banner.cta_label}
            </span>
          )}
        </div>

        {banners.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {banners.map((b, i) => (
              <span
                key={b.id}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === index ? "w-6 bg-white" : "w-1.5 bg-white/50",
                )}
              />
            ))}
          </div>
        )}
      </Link>
    </section>
  );
}
