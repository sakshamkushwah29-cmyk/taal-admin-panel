"use client";

import PathologyStatus from "@/components/_ui/PathologyStatus";
import PharmacyStatus from "@/components/_ui/PharmacyStatus";
import AppNavbar from "@/components/common/AppNavbar";
import ROUTE_PATH from "@/libs/route-path";
import { useParams } from "next/navigation";
 

export default function RoleLayout({ children }) {
  const params = useParams();
  const role = params.role;
  const notificationPath = `/${role}/notifications`;
  const logoHref = ROUTE_PATH[role?.toUpperCase()]?.DASHBOARD || "/";


  let StatusComponent = null;
  if(role === 'pharmacy'){
    StatusComponent = PharmacyStatus;
  }
  else  if (role === 'pathology'){
    StatusComponent = PathologyStatus;
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted text-foreground">
      <AppNavbar
        logoHref={logoHref}
        notificationPath={notificationPath}
        StatusComponent={StatusComponent}
        statusProps={{ initialStatus: "available"}}
      />
 <main className="flex-1 flex flex-col overflow-hidden p-2">
        <div className="flex-1 overflow-auto px-5 lg:p-5 shadow-lg custom-scrollbar">
          <div className="relative overflow-x-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}
