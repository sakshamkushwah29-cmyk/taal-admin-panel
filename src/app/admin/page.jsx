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

import { MdSecurity, MdConfirmationNumber, MdLocalActivity } from "react-icons/md";

import { cn } from "@/lib/utils";
import { useAdminMode } from "@/contexts/AdminModeContext";
import AdminModeToggle from "@/components/_ui/admin-mode-toggle";
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
import { MdGavel } from "react-icons/md";
// Sidebar navigation links
// const adminSidebarLinks = [
//   { name: "Dashboard", href: "/admin", icon: <FiHome size={18} /> },
//   // {
//   //   name: "Analytics",
//   //   href: "/admin/analytics",
//   //   icon: <ChartLine size={18} />,
//   // },
//   {
//     name: "Manager Management",
//     href: "/admin/managers",
//     icon: <HiOutlineUserGroup size={18} />,
//   },
//   {
//     name: "GateKeeper Management",
//     href: "/admin/gatekeeper",
//     icon: <MdSecurity size={18} />,
//   },
//   // { name: "Users", href: "/admin/users", icon: <FiUsers size={18} /> },
//   {
//     name: "Event Management",
//     href: "/admin/event-management",
//     icon: <FiGift size={18} />,
//   },
//   {
//     name: "Category Management",
//     href: "/admin/categories",
//     icon: <FiGift size={18} />,
//   },
//   {
//     name: "Product Management",
//     href: "/admin/product-mangement",
//     icon: <FiGift size={18} />,
//   },
//   // {
//   //   name: "Order Management",
//   //   href: "/admin/order-management",
//   //   icon: <FiGift size={18} />,
//   // },
//   {
//     name: "Ticket Bookings",
//     href: "/admin/ticket-bookings",
//     icon: <FiCreditCard size={18} />,
//   },
//   {
//     name: "Generate Tickets",
//     href: "/admin/generate-tickets",
//     icon: <FiCreditCard size={18} />,
//   },
//   {
//     name: "Content & Policies",
//     href: "/admin/policies",
//     icon: <FiGrid size={18} />,
//   },
// ];

// section: "common" (always shown) | "ecommerce" | "events"
const adminSidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: <FiHome size={18} />, section: "common" },
  {
    name: "Manager Management",
    href: "/admin/managers",
    icon: <HiOutlineUserGroup size={18} />,
    section: "events",
  },
  {
    name: "GateKeeper Management",
    href: "/admin/gatekeeper",
    icon: <MdSecurity size={18} />,
    section: "events",
  },
  {
    name: "Event Management",
    href: "/admin/event-management",
    icon: <FiCalendar size={18} />,
    section: "events",
  },
  {
    name: "Order Management",
    href: "/admin/order-management",
    icon: <FiShoppingCart size={18} />,
    section: "ecommerce",
  },
  {
    name: "Category Management",
    href: "/admin/categories",
    icon: <FiPackage size={18} />,
    section: "ecommerce",
  },
  {
    name: "Product Management",
    href: "/admin/product-mangement",
    icon: <FiPackage size={18} />,
    section: "ecommerce",
  },
  {
    name: "Ticket Bookings",
    href: "/admin/ticket-bookings",
    icon: <MdConfirmationNumber size={18} />,
    section: "events",
  },
  {
    name: "Generate Tickets",
    href: "/admin/generate-tickets",
    icon: <MdLocalActivity size={18} />,
    section: "events",
  },
  {
    name: "Dispute Management",
    href: "/admin/dispute-management",
    icon: <MdGavel size={18} />,
    section: "events",
  },
  {
    name: "Content & Policies",
    href: "/admin/policies",
    icon: <FiGrid size={18} />,
    section: "common",
  },
];

export default function AdminDashboardLayout({ children }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { mode } = useAdminMode() || { mode: "ecommerce" };

  const SidebarLinks = ({ useSheetClose = false }) => (
    <nav className="space-y-1">
      {adminSidebarLinks
        .filter((link) => link.section === "common" || link.section === mode)
        .map((link) => {
        const linkElement = (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 px-4 py-2 text-sm rounded-md hover:bg-muted transition",
              pathname === link.href ||
                (link.href !== "/admin" && pathname.startsWith(link.href + "/"))
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
        <h1 className="text-lg font-semibold">Admin Panel</h1>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="p-2 bor border rounded-md cursor-pointer">
              <Menu className="w-5 h-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <div className="flex flex-col h-full p-4 bg-white border-r">
              <DialogTitle asChild>
                <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
              </DialogTitle>
              <AdminModeToggle className="mb-5" />
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
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
        <SidebarLinks />
        {/* <div className="mt-auto text-xs text-muted-foreground px-4 pt-4 border-t">
          © 2025 LabPath Diagnostics
        </div> */}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-y-auto bg-white">
        {/* Stat Cards */}

        {pathname === "/admin" && <AdminDashboardEarning />}

        {/* Rest of the page content */}
        {children}
      </main>
    </div>
  );
}
