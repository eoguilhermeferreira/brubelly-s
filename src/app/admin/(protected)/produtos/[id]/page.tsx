import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { ProductForm } from "@/components/admin/product-form";
import { getAllCategories, getProductById } from "@/lib/queries";

export default async function AdminProductDetailPage({ params }: PageProps<"/admin/produtos/[id]">) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getProductById(id), getAllCategories()]);
  if (!product) notFound();

  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin/produtos" className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-pine-900">
        <ArrowLeft className="size-4" /> Voltar para produtos
      </Link>

      <h1 className="font-display text-2xl font-bold text-pine-900">Editar produto</h1>

      <ProductForm product={product} categories={categories} />
    </div>
  );
}
