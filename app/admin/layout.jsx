"use client";

import AdminSidebar from "@/components/AdminSidebar";
import AdminAuthGate from "@/components/AdminAuthGate";
import { NotificationsProvider } from "@/lib/notifications";

export default function AdminLayout({ children }) {
  return (
    <AdminAuthGate>
      <NotificationsProvider>
        <div className="flex min-h-screen bg-dragonfly-cream">
          <AdminSidebar />
          <main className="flex-1 p-6 lg:p-8 overflow-auto">{children}</main>
        </div>
      </NotificationsProvider>
    </AdminAuthGate>
  );
}
