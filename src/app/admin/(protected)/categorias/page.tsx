import { Fragment } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllCategories } from "@/lib/queries";

export const metadata = { title: "Categorias" };

export default async function AdminCategoriasPage() {
  const categories = await getAllCategories();
  const parents = categories.filter((c) => !c.parent_id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-pine-900">Categorias</h1>
          <p className="text-sm text-muted-foreground">{categories.length} categorias cadastradas</p>
        </div>
        <Button asChild>
          <Link href="/admin/categorias/nova">
            <Plus className="size-4" /> Nova categoria
          </Link>
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-white p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Tipo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parents.map((parent) => (
              <Fragment key={parent.id}>
                <TableRow>
                  <TableCell>
                    <Link href={`/admin/categorias/${parent.id}`} className="font-medium text-pine-900 hover:text-rose-600">
                      {parent.name}
                    </Link>
                  </TableCell>
                  <TableCell className="font-tag text-xs text-muted-foreground">/{parent.slug}</TableCell>
                  <TableCell>
                    <Badge variant="mint">Principal</Badge>
                  </TableCell>
                </TableRow>
                {categories
                  .filter((c) => c.parent_id === parent.id)
                  .map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell className="pl-8">
                        <Link href={`/admin/categorias/${sub.id}`} className="text-pine-900/80 hover:text-rose-600">
                          ↳ {sub.name}
                        </Link>
                      </TableCell>
                      <TableCell className="font-tag text-xs text-muted-foreground">/{sub.slug}</TableCell>
                      <TableCell>
                        <Badge variant="outline">Subcategoria</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
