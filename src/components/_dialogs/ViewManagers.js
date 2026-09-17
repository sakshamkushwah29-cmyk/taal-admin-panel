"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Building2,
  User,
  Mail,
  Phone,
  Percent,
  MapPin,
  FileText,
  BadgeCheck,
  XCircle,
  ShieldCheck,
  UserCog,
} from "lucide-react";
import Image from "next/image";
import is from "zod/v4/locales/is.cjs";

// InfoField component with optional icon
const InfoField = ({ label, value, icon }) => (
  <div className="space-y-1">
    <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
      {icon && <span className="text-gray-400 dark:text-gray-600">{icon}</span>}
      {label}
    </p>
    <p className="text-sm text-gray-900 dark:text-gray-100">{value || "N/A"}</p>
  </div>
);

export default function ViewManagers({ managers }) {
  const [open, setOpen] = useState(false);

const {
    name,
    email,
    isBlocked,
    phone,
    role,
    address

}  = managers || {}

console.log(managers, "Managers");

//   const {
//     pharmacyName,
//     ownerName,
//     email,
//     phone,
//     commissionRate,
//     status,
//     address,
//     documents,
//     adminId,
//   } = pharmacy || {};

  const renderVerificationBadge = (status) => {
    switch (status) {
      case "Verified":
        return (
          <div className="inline-flex items-center gap-2 text-green-600 dark:text-green-400">
            <BadgeCheck size={18} /> <span className="font-medium">Verified</span>
          </div>
        );
      case "Rejected":
        return (
          <div className="inline-flex items-center gap-2 text-red-500 dark:text-red-400">
            <XCircle size={18} /> <span className="font-medium">Rejected</span>
          </div>
        );
      default:
        return (
          <div className="text-gray-500 dark:text-gray-400 font-medium">
            {status || "Pending"}
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-all cursor-pointer">
          <Eye size={18} />
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-sm max-h-[70vh] lg:max-h-[85vh] rounded-2xl shadow-2xl bg-white dark:bg-gray-950 overflow-hidden flex flex-col border border-gray-200 dark:border-gray-800">
        {/* Header */}
        <DialogHeader className="p-6 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Building2 className="text-indigo-600 dark:text-indigo-400" size={22} />
            Managers Details
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
            Complete profile and verification info
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="p-6 space-y-10 overflow-y-auto bg-gray-50 dark:bg-gray-900 flex-1">
          {/* General Info */}
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              <User className="text-blue-600 dark:text-blue-400" size={18} />
              General Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoField label="Name" value={name} icon={<Building2 size={14} />} />
              <InfoField label="Email" value={email} icon={<Mail size={14} />} />
              <InfoField label="Phone" value={phone} icon={<Phone size={14} />} />
              <InfoField label="Status" value={isBlocked} icon={<ShieldCheck size={14} />} />
            </div>
          </section>

          {/* Address Info */}
          {/* <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              <MapPin className="text-emerald-600 dark:text-emerald-400" size={18} />
              Address Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoField label="Street" value={address?.street} />
              <InfoField label="City" value={address?.city} />
              <InfoField label="State" value={address?.state} />
              <InfoField label="Pincode" value={address?.pincode} />
            </div>
          </section> */}
        </div>
        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          <Button className="w-full flex items-center gap-2 cursor-pointer" onClick={() => setOpen(false)}>
            <XCircle size={18} />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
