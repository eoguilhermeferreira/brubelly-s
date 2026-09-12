import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ProductForm } from "@/components/admin/product-form";
import { getAllCategories } from "@/lib/queries";

export const metadata = { title: "Novo produto" };

export default async function AdminNewProductPage() {
  const categories = await getAllCategories();

  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin/produtos" className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-pine-900">
        <ArrowLeft className="size-4" /> Voltar para produtos
      </Link>

      <h1 className="font-display text-2xl font-bold text-pine-900">Novo produto</h1>

      <ProductForm product={null} categories={categories} />
    </div>
  );
}
