import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { getBanners } from "@/lib/queries";

export const metadata = { title: "Banners" };

export default async function AdminBannersPage() {
  const banners = await getBanners();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-pine-900">Banners</h1>
        <p className="text-sm text-muted-foreground">Carrossel exibido na home</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {banners.map((banner) => (
          <div key={banner.id} className="overflow-hidden rounded-2xl border border-border bg-white">
            <div className="relative aspect-[16/7]">
              <Image src={banner.image_url} alt={banner.title} fill sizes="400px" className="object-cover" />
            </div>
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="font-display text-sm font-semibold text-pine-900">{banner.title}</p>
                <p className="text-xs text-muted-foreground">{banner.subtitle}</p>
              </div>
              <Badge variant="mint">Ativo</Badge>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Modo demonstração: somente leitura. Upload de novos banners habilitado ao conectar o Supabase.
      </p>
    </div>
  );
}
