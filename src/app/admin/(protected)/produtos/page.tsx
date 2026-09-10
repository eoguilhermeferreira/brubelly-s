import Image from "next/image";
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
import { formatPrice } from "@/lib/format";
import { getAllCategories, getAllProductsAdmin } from "@/lib/queries";

export const metadata = { title: "Produtos" };

export default async function AdminProdutosPage() {
  const [products, categories] = await Promise.all([getAllProductsAdmin(), getAllCategories()]);
  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? "—";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-pine-900">Produtos</h1>
          <p className="text-sm text-muted-foreground">{products.length} produtos no catálogo</p>
        </div>
        <Button disabled title="Disponível ao conectar o Supabase">
          <Plus className="size-4" /> Novo produto
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-white p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {product.images[0] && (
                      <div className="relative size-10 overflow-hidden rounded-lg bg-mint-50">
                        <Image src={product.images[0].url} alt="" fill sizes="40px" className="object-cover" />
                      </div>
                    )}
                    <span className="font-medium text-pine-900">{product.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{categoryName(product.category_id)}</TableCell>
                <TableCell>{formatPrice(product.price_cents)}</TableCell>
                <TableCell className={product.stock <= 5 ? "text-gold-600 font-medium" : undefined}>
                  {product.stock}
                </TableCell>
                <TableCell>
                  <Badge variant={product.active ? "mint" : "outline"}>
                    {product.active ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-muted-foreground">
        Modo demonstração: catálogo somente leitura. Criar/editar produtos fica disponível assim que o
        Supabase estiver configurado (ver README).
      </p>
    </div>
  );
}
