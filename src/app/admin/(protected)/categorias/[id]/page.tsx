import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { CategoryForm } from "@/components/admin/category-form";
import { getAllCategories, getCategoryById } from "@/lib/queries";

export default async function AdminCategoryDetailPage({ params }: PageProps<"/admin/categorias/[id]">) {
  const { id } = await params;
  const [category, categories] = await Promise.all([getCategoryById(id), getAllCategories()]);
  if (!category) notFound();

  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin/categorias" className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-pine-900">
        <ArrowLeft className="size-4" /> Voltar para categorias
      </Link>

      <h1 className="font-display text-2xl font-bold text-pine-900">Editar categoria</h1>

      <CategoryForm category={category} parentOptions={categories.filter((c) => !c.parent_id)} />
    </div>
  );
}
