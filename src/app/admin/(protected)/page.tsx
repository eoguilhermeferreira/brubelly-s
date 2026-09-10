import { Clock, DollarSign, Package, ShoppingCart, Users } from "lucide-react";

import { RecentOrdersTable } from "@/components/admin/recent-orders-table";
import { StatCard } from "@/components/admin/stat-card";
import { formatPrice } from "@/lib/format";
import { getDashboardStats } from "@/lib/queries";

export const metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-pine-900">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral da loja — dados de demonstração.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Faturamento" value={formatPrice(stats.revenueCents)} icon={DollarSign} tone="rose" />
        <StatCard label="Pedidos" value={String(stats.totalOrders)} icon={ShoppingCart} tone="mint" />
        <StatCard label="Aguardando pagamento" value={String(stats.pendingOrders)} icon={Clock} tone="gold" />
        <StatCard label="Produtos ativos" value={String(stats.totalProducts)} icon={Package} tone="mint" />
      </div>

      <div className="rounded-2xl border border-border bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-semibold text-pine-900">Pedidos recentes</h2>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="size-3.5" /> {stats.totalCustomers} clientes
          </span>
        </div>
        <div className="mt-4">
          <RecentOrdersTable orders={stats.recentOrders} />
        </div>
      </div>
    </div>
  );
}
