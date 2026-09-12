import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { CategoryForm } from "@/components/admin/category-form";
import { getAllCategories } from "@/lib/queries";

export const metadata = { title: "Nova categoria" };

export default async function AdminNewCategoryPage() {
  const categories = await getAllCategories();

  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin/categorias" className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-pine-900">
        <ArrowLeft className="size-4" /> Voltar para categorias
      </Link>

      <h1 className="font-display text-2xl font-bold text-pine-900">Nova categoria</h1>

      <CategoryForm category={null} parentOptions={categories.filter((c) => !c.parent_id)} />
    </div>
  );
}
