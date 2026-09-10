import type { ReactNode } from "react";

import { AdminSidebar } from "@/components/admin/sidebar";

export default function AdminProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-paper-warm">
      <AdminSidebar />
      <div className="flex-1 overflow-x-hidden">
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
