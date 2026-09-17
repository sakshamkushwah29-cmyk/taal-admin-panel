"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export const useTitle = () => {
  const pathname = usePathname();

  useEffect(() => {
    const path = pathname.replace(/^\//, "");
    const segments = path.split("/").filter(Boolean);

    let title = "Taal Admin";

    if (segments.length > 0) {
      const [mainRoute, subRoute, subSubRoute] = segments;
      
      // Simple mapping
      const routeNames = {
        admin: "Admin",
        pharmacy: "Event Manager", 
        pathology: "Gate Keeper",
      };

      const pageNames = {
        "": "Dashboard",
        "analytics": "Analytics",
        "users": "Manage Users",
        "events": "Manage Events",
        "products-management": "Manage Products",
        "event-management": "Manage Events",
        "banners": "Manage Banners",
        "categories": "Manage Categories",
        "policies": "Manage Policies",
        "settings": "Settings",
      };

      if (mainRoute && routeNames[mainRoute]) {
        if (subRoute && pageNames[subRoute]) {
          if (subSubRoute && pageNames[subSubRoute]) {
            title = `Taal Admin - ${routeNames[mainRoute]} - ${pageNames[subRoute]} - ${pageNames[subSubRoute]}`;
          } else {
            title = `Taal Admin - ${routeNames[mainRoute]} - ${pageNames[subRoute]}`;
          }
        } else {
          title = `Taal Admin - ${routeNames[mainRoute]} - Dashboard`;
        }
      } else {
        title = `Taal Admin - ${mainRoute ? mainRoute.charAt(0).toUpperCase() + mainRoute.slice(1) : "Dashboard"}`;
      }
    } else {
      title = "Taal Admin - Dashboard";
    }

    document.title = title;
  }, [pathname]);
}; 