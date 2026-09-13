"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { FiHome, FiTrendingUp, FiStar } from "react-icons/fi";
import { Card, CardContent } from "@/components/ui/card";
import AdminDashboardLayout from "../page";
import AppBreadcrumb from "@/components/_ui/app-breadcrumb";

function Offers() {
  const pathname = usePathname();
  const router = useRouter();

  const stats = [
    {
      title: "Create Events",
      icon: <FiHome size={22} />,
      subtitle: "Manage Events ",
      route: "/admin/event-management/event",
      bg: "bg-white hover:bg-gradient-to-br from-rose-100 via-rose-50 to-white",
      iconBg: "group-hover:bg-rose-200 group-hover:text-rose-500",
    },
    {
      title: "Create Event Sessions",
      icon: <FiTrendingUp size={22} />,
      subtitle: "Manage Event Sessions",
      route: "/admin/event-management/event-sessions",
      bg: "bg-white hover:bg-gradient-to-br from-amber-100 via-amber-50 to-white",
      iconBg: "group-hover:bg-amber-200 group-hover:text-amber-500",
    },
    // {
    //   title: "Featured Products",
    //   icon: <FiStar size={22} />,
    //   subtitle: "Highlight featured products",
    //   route: "/admin/offers/featured-products",
    //   bg: "bg-white hover:bg-gradient-to-br from-sky-100 via-sky-50 to-white",
    //   iconBg: "group-hover:bg-sky-200 group-hover:text-sky-500",
    // },
  ];

  return (
    <AdminDashboardLayout>
      <AppBreadcrumb />

      {pathname === "/event-manager/event-management" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {stats.map((stat) => (
            <Card
              key={stat.title}
              onClick={() => router.push(stat.route)}
              className={`group cursor-pointer border border-transparent rounded-2xl bg-white hover:bg-gradient-to-br from-gray-50 to-white transition-all duration-300${stat.bg}`}
            >
              <CardContent className="flex items-center gap-6 p-6">
                <div
                  className={`rounded-xl p-3 shadow-inner bg-gray-200 text-black transition-all duration-300 ${stat.iconBg}`}
                >
                  {React.cloneElement(stat.icon, {
                    className: `w-6 h-6 transition-colors duration-300`,
                  })}
                </div>
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold">
                    {stat.title}
                  </h3>
                  <p className="text-sm text-gray-900">{stat.subtitle}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminDashboardLayout>
  );
}

export default Offers;
