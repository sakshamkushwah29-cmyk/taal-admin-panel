"use client";

import AppNavbar from "@/components/common/AppNavbar";
import ROUTE_PATH from "@/libs/route-path";

export default function AdminLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-muted text-foreground">
      <AppNavbar
        logoHref={ROUTE_PATH.GATEKEEPER.DASHBOARD}
        notificationPath="/gatekeeper/notifications"
      />
     <main className="flex-1 flex flex-col overflow-hidden p-2">
        <div className="flex-1 overflow-auto px-5 lg:p-5 shadow-lg custom-scrollbar">
          <div className="relative overflow-x-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}
