import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";

import { BannerActiveToggle } from "@/components/admin/banner-active-toggle";
import { Button } from "@/components/ui/button";
import { getAllBanners } from "@/lib/queries";

export const metadata = { title: "Banners" };

export default async function AdminBannersPage() {
  const banners = await getAllBanners();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-pine-900">Banners</h1>
          <p className="text-sm text-muted-foreground">Carrossel exibido na home</p>
        </div>
        <Button asChild>
          <Link href="/admin/banners/novo">
            <Plus className="size-4" /> Novo banner
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {banners.map((banner) => (
          <div key={banner.id} className="overflow-hidden rounded-2xl border border-border bg-white">
            <Link href={`/admin/banners/${banner.id}`} className="block">
              <div className="relative aspect-[16/7]">
                <Image src={banner.image_url} alt={banner.title} fill sizes="400px" className="object-cover" />
              </div>
            </Link>
            <div className="flex items-center justify-between p-4">
              <Link href={`/admin/banners/${banner.id}`} className="hover:text-rose-600">
                <p className="font-display text-sm font-semibold text-pine-900">{banner.title}</p>
                <p className="text-xs text-muted-foreground">{banner.subtitle}</p>
              </Link>
              <BannerActiveToggle bannerId={banner.id} active={banner.active} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
