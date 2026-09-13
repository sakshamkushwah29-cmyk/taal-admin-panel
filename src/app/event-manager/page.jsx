"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Menu, ChartLine } from "lucide-react";
import {
  FiActivity,
  FiPackage,
  FiSettings,
  FiHome,
  FiFileText,
  FiUsers,
  FiCalendar,
  FiShield,
  FiUserCheck,
  FiTag,
  FiGift,
  FiGrid,
  FiImage,
  FiShoppingCart,
  FiCreditCard,
  FiDollarSign,
  FiMapPin,
  FiTruck,
  FiBell,
  FiEdit,
  FiClipboard,
  FiList,
  FiCheckSquare,
} from "react-icons/fi";
import { HiOutlineUserGroup } from "react-icons/hi";
import { MdSecurity } from "react-icons/md";

import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { MdLocalHospital, MdLocalOffer } from "react-icons/md";
import { BsCapsule } from "react-icons/bs";
import { DialogTitle } from "@/components/ui/dialog";
import { FaCar } from "react-icons/fa";
import AdminDashboardEarning from "@/components/_dialogs/AdminDashboardEarning";
import GarbaDance from "@/components/common/GarbaDance";

// Sidebar navigation links
const adminSidebarLinks = [
  { name: "Dashboard", href: "/event-manager", icon: <FiHome size={18} /> },
  {
    name: "GateKeeper Management",
    href: "/event-manager/gatekeeper",
    icon: <MdSecurity size={18} />,
  },
  {
    name: "Event Management",
    href: "/event-manager/event-management",
    icon: <FiGift size={18} />,
  },
  {
    name: "Ticket Bookings",
    href: "/admin/ticket-bookings",
    icon: <FiGift size={18} />,
  },
//   {
//     name: "Content & Policies",
//     href: "/admin/policies",
//     icon: <FiGrid size={18} />,
//   },
//   {
//     name: "Payment Management",
//     href: "/admin/payment-management",
//     icon: <FiCreditCard size={18} />,
//   },
];

export default function EventManagerDashBoardLayout({ children }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const SidebarLinks = ({ useSheetClose = false }) => (
    <nav className="space-y-1">
      {adminSidebarLinks.map((link) => {
        const linkElement = (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 px-4 py-2 text-sm rounded-md hover:bg-muted transition",
              pathname === link.href ||
                (link.href !== "/event-manager" && pathname.startsWith(link.href + "/"))
                ? "bg-muted font-medium text-primary"
                : "text-muted-foreground"
            )}
          >
            {link.icon}
            {link.name}
          </Link>
        );

        return useSheetClose ? (
          <SheetClose asChild key={link.href}>
            {linkElement}
          </SheetClose>
        ) : (
          linkElement
        );
      })}
    </nav>
  );



  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-muted/40">
      {/* Mobile Header */}
      <header className="flex items-center justify-between md:hidden p-4 bg-white border-b">
        <h1 className="text-lg font-semibold">Event Manager Panel</h1>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="p-2 bor border rounded-md cursor-pointer">
              <Menu className="w-5 h-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <div className="flex flex-col h-full p-4 bg-white border-r">
              <DialogTitle asChild>
                <h2 className="text-xl font-bold mb-6">Event Manager Panel</h2>
              </DialogTitle>
              <SidebarLinks useSheetClose />
              {/* <div className="mt-auto text-xs text-muted-foreground px-4 pt-4 border-t">
                © 2025 LabPath Diagnostics
              </div> */}
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col bg-white border-r p-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <SidebarLinks />
        {/* <div className="mt-auto text-xs text-muted-foreground px-4 pt-4 border-t">
          © 2025 LabPath Diagnostics
        </div> */}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-y-auto bg-white">
        {/* Stat Cards */}

        {pathname === "/event-manager" && <AdminDashboardEarning />}

        {/* Rest of the page content */}
        {children}
      </main>
    </div>
  );
}
