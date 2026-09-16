import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { BannerForm } from "@/components/admin/banner-form";
import { getAllCategories } from "@/lib/queries";

export const metadata = { title: "Novo banner" };

export default async function AdminNewBannerPage() {
  const categories = await getAllCategories();

  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin/banners" className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-pine-900">
        <ArrowLeft className="size-4" /> Voltar para banners
      </Link>

      <h1 className="font-display text-2xl font-bold text-pine-900">Novo banner</h1>

      <BannerForm banner={null} categories={categories} />
    </div>
  );
}
