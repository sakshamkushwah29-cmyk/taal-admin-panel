"use client";

import AppNavbar from "@/components/common/AppNavbar";
import ROUTE_PATH from "@/libs/route-path";
import { AdminModeProvider } from "@/contexts/AdminModeContext";
import AdminModeToggle from "@/components/_ui/admin-mode-toggle";

export default function AdminLayout({ children }) {
  return (
    <AdminModeProvider>
      <div className="flex flex-col min-h-screen bg-muted text-foreground">
        <AppNavbar
          logoHref={ROUTE_PATH.ADMIN.DASHBOARD}
          notificationPath="/admin/notifications"
        >
          <AdminModeToggle className="hidden sm:grid" />
        </AppNavbar>
        <main className="flex-1 flex flex-col overflow-hidden p-2">
          <div className="flex-1 overflow-auto px-5 lg:p-5 shadow-lg custom-scrollbar">
            <div className="relative overflow-x-auto">{children}</div>
          </div>
        </main>
      </div>
    </AdminModeProvider>
  );
}
