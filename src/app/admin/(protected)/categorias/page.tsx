import { Fragment } from "react";

import { Badge } from "@/components/ui/badge";
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
      <div>
        <h1 className="font-display text-2xl font-bold text-pine-900">Categorias</h1>
        <p className="text-sm text-muted-foreground">{categories.length} categorias cadastradas</p>
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
                  <TableCell className="font-medium text-pine-900">{parent.name}</TableCell>
                  <TableCell className="font-tag text-xs text-muted-foreground">/{parent.slug}</TableCell>
                  <TableCell>
                    <Badge variant="mint">Principal</Badge>
                  </TableCell>
                </TableRow>
                {categories
                  .filter((c) => c.parent_id === parent.id)
                  .map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell className="pl-8 text-pine-900/80">↳ {sub.name}</TableCell>
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

      <p className="text-xs text-muted-foreground">
        Modo demonstração: somente leitura. Edição habilitada ao conectar o Supabase.
      </p>
    </div>
  );
}
