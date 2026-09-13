



"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Menu } from "lucide-react";
import { FiHome, FiClock } from "react-icons/fi";

import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

import { DialogTitle } from "@/components/ui/dialog";

import ScanTicket from "./scan-ticket/page";

// Sidebar navigation links
const adminSidebarLinks = [
  { name: "Scan Ticket", href: "/gatekeeper", icon: <FiHome size={18} /> },
  { name: "Scan History", href: "/gatekeeper/scan-history", icon: <FiClock size={18} /> },
];

export default function AdminDashboardLayout({ children }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const SidebarLinks = ({ useSheetClose = false }) => (
    <nav className="space-y-1">
      {adminSidebarLinks.map((link) => {
        const linkElement = (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)} // ✅ close sidebar when link clicked
            className={cn(
              "flex items-center gap-3 px-4 py-2 text-sm rounded-md hover:bg-muted transition",
              pathname === link.href ||
                (link.href !== "/gatekeeper" && pathname.startsWith(link.href + "/"))
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
        <h1 className="text-lg font-semibold">Gatekeeper Panel</h1>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="Open sidebar"
              className="p-2 border rounded-md cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-80 bg-white border-r">
            <div className="flex flex-col h-full p-4">
              <DialogTitle asChild>
                <h2 className="text-xl font-bold mb-6">Gatekeeper Panel</h2>
              </DialogTitle>
              <SidebarLinks useSheetClose />
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col bg-white border-r p-4">
        <h2 className="text-xl font-bold mb-6">Gatekeeper Panel</h2>
        <SidebarLinks />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-y-auto bg-white">
        {pathname === "/gatekeeper" && <ScanTicket />}
        {children}
      </main>
    </div>
  );
}
