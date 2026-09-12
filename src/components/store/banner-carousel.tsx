"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Banner } from "@/types/database.types";

const AUTOPLAY_MS = 3000;
const INTERACTION_PAUSE_MS = 6000;
const DRAG_THRESHOLD_PX = 40;

export function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = React.useState(0);
  const prefersReducedMotion = React.useRef(false);
  const pauseUntilRef = React.useRef(0);
  const dragStartXRef = React.useRef<number | null>(null);
  const didDragRef = React.useRef(false);

  React.useEffect(() => {
    prefersReducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  React.useEffect(() => {
    if (banners.length <= 1 || prefersReducedMotion.current) return;
    const id = setInterval(() => {
      if (Date.now() < pauseUntilRef.current) return;
      setIndex((i) => (i + 1) % banners.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [banners.length]);

  const registerInteraction = React.useCallback(() => {
    pauseUntilRef.current = Date.now() + INTERACTION_PAUSE_MS;
  }, []);

  const goToDot = React.useCallback(
    (i: number) => {
      registerInteraction();
      setIndex(i);
    },
    [registerInteraction],
  );

  // Arrasto com o dedo (mobile) ou com o mouse (desktop) — Pointer Events
  // cobrem os dois casos com o mesmo código.
  function handlePointerDown(e: React.PointerEvent) {
    dragStartXRef.current = e.clientX;
  }

  function handlePointerUp(e: React.PointerEvent) {
    registerInteraction();
    const startX = dragStartXRef.current;
    dragStartXRef.current = null;
    if (startX === null) return;
    const deltaX = e.clientX - startX;
    if (Math.abs(deltaX) < DRAG_THRESHOLD_PX) return;
    // Marca que houve arrasto pra suprimir o click do <Link> do slide desktop
    // (senão o mouseup do arrasto navegaria pro href do banner).
    didDragRef.current = true;
    if (deltaX < 0) setIndex((i) => (i + 1) % banners.length);
    else setIndex((i) => (i - 1 + banners.length) % banners.length);
  }

  function handleSlideLinkClick(e: React.MouseEvent) {
    if (didDragRef.current) {
      e.preventDefault();
      didDragRef.current = false;
    }
  }

  if (banners.length === 0) return null;
  const banner = banners[index];

  return (
    <>
      {/* Mobile (<768px): full-bleed hero banner, sob o header */}
      <div
        className="relative left-1/2 right-1/2 -mx-[50vw] w-screen touch-pan-y select-none overflow-hidden md:hidden"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <div className="relative h-[62svh] min-h-[400px] max-h-[560px] w-full">
          <Image
            src={banner.image_url}
            alt={banner.title}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: banner.image_position }}
          />
          <div className="absolute inset-x-0 top-0 h-[140px] bg-gradient-to-b from-black/45 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 px-5 pb-20">
            <p className="font-display text-2xl font-bold text-white">{banner.title}</p>
            {banner.subtitle && <p className="mt-1 text-sm text-white/90">{banner.subtitle}</p>}

            {banners.length > 1 && (
              <div className="mt-4 flex justify-center gap-1.5">
                {banners.map((b, i) => (
                  <button
                    key={b.id}
                    type="button"
                    aria-label={`Ir para banner ${i + 1}`}
                    onClick={() => goToDot(i)}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      i === index ? "w-6 bg-white" : "w-1.5 bg-white/50",
                    )}
                  />
                ))}
              </div>
            )}

            {banner.cta_label && (
              <Link
                href={banner.href}
                onFocus={registerInteraction}
                aria-label={`${banner.cta_label} — ${banner.title}`}
                className="mt-4 inline-flex h-12 w-fit items-center gap-2 rounded-full bg-rose-600 px-7 font-display text-sm font-semibold text-white shadow-[0_2px_12px_rgba(0,0,0,0.25)] transition-colors hover:bg-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {banner.cta_label} <ArrowRight className="size-4" />
              </Link>
            )}
          </div>
        </div>
        <div id="mobile-hero-sentinel" aria-hidden className="h-0" />
      </div>

      {/* Desktop (>=768px): mesmo carrossel, sem as setas, com arrasto pelo mouse */}
      <div
        className="relative touch-pan-y select-none overflow-hidden rounded-2xl md:block hidden"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <Link href={banner.href} className="block" draggable={false} onClick={handleSlideLinkClick}>
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
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {banners.map((b, i) => (
              <button
                key={b.id}
                type="button"
                aria-label={`Ir para banner ${i + 1}`}
                onClick={() => goToDot(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === index ? "w-6 bg-white" : "w-1.5 bg-white/50",
                )}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
