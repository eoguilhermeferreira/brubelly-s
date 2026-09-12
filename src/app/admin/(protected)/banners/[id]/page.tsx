import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { BannerForm } from "@/components/admin/banner-form";
import { getBannerById } from "@/lib/queries";

export default async function AdminBannerDetailPage({ params }: PageProps<"/admin/banners/[id]">) {
  const { id } = await params;
  const banner = await getBannerById(id);
  if (!banner) notFound();

  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin/banners" className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-pine-900">
        <ArrowLeft className="size-4" /> Voltar para banners
      </Link>

      <h1 className="font-display text-2xl font-bold text-pine-900">Editar banner</h1>

      <BannerForm banner={banner} />
    </div>
  );
}
