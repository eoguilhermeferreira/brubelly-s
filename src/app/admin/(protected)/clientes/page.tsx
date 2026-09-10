import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatPrice } from "@/lib/format";
import { getCustomers } from "@/lib/queries";

export const metadata = { title: "Clientes" };

export default async function AdminClientesPage() {
  const customers = await getCustomers();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-pine-900">Clientes</h1>
        <p className="text-sm text-muted-foreground">{customers.length} clientes com pedidos</p>
      </div>

      <div className="rounded-2xl border border-border bg-white p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Pedidos</TableHead>
              <TableHead>Total gasto</TableHead>
              <TableHead>Desde</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-pine-900">{customer.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{customer.email}</TableCell>
                <TableCell>{customer.orders_count}</TableCell>
                <TableCell>{formatPrice(customer.total_spent_cents)}</TableCell>
                <TableCell className="text-muted-foreground">{formatDate(customer.created_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
