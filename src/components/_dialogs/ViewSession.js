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
import { Eye, Tag, PackageCheck, BadgeIndianRupee, CalendarDays } from "lucide-react";

const InfoField = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
      {label}
    </p>
    <p className="text-sm text-gray-900 dark:text-gray-100">{value || "N/A"}</p>
  </div>
);

export default function ViewSession({ offer }) {
  const [open, setOpen] = useState(false);

  const {
    product,
    originalPrice,
    offerPrice,
    offerPercentage,
    validTill,
    isActive,
  } = offer || {};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="hover:bg-gray-200 dark:hover:bg-gray-800 transition-all"
        >
          <Eye size={18} />
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-sm lg:max-h-[85vh]  max-h-[65vh] rounded-2xl shadow-xl bg-white dark:bg-gray-950 flex flex-col overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
            <div className="flex items-center gap-2">
              <Tag className="text-pink-600 dark:text-pink-400" size={20} />
              Special Offer Details
            </div>
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
            A detailed breakdown of this limited-time product offer.
          </DialogDescription>
        </DialogHeader>

        {/* Body */}
        <div className="p-6 space-y-8 overflow-y-auto bg-gray-50 dark:bg-gray-900 flex-1">

          {/* Section 1: Product Information */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide">
              <PackageCheck className="text-blue-600 dark:text-blue-400" size={18} />
              Product Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InfoField label="Name" value={product?.name} />
              <InfoField label="Manufacturer" value={product?.manufacturer} />
              <InfoField label="Type" value={product?.type} />
              <InfoField
                label="Prescription"
                value={
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    product?.isPrescriptionRequired
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                      : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  }`}>
                    {product?.isPrescriptionRequired ? "Required" : "Not Required"}
                  </span>
                }
              />
              <InfoField label="Pack Size" value={product?.packSizeLabel} />
              <InfoField label="Composition" value={product?.short_composition1} />
            </div>
          </section>

          <hr className="border-t border-gray-200 dark:border-gray-700" />

          {/* Section 2: Pricing Details */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide">
              <BadgeIndianRupee className="text-green-600 dark:text-green-400" size={18} />
              Pricing Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InfoField
                label="Original Price"
                value={
                  <span className="line-through text-gray-500 dark:text-gray-400">
                    ₹{originalPrice?.toFixed(2)}
                  </span>
                }
              />
              <InfoField
                label="Offer Price"
                value={
                  <span className="text-green-600 dark:text-green-400 font-semibold">
                    ₹{offerPrice?.toFixed(2)}
                  </span>
                }
              />
              <div className="sm:col-span-2">
                <InfoField
                  label="Discount"
                  value={
                    <span className="inline-block bg-yellow-100 text-yellow-600 dark:bg-yellow-700 dark:text-yellow-100 px-3 py-1 rounded-full text-xs font-semibold">
                      {offerPercentage}% OFF
                    </span>
                  }
                />
              </div>
            </div>
          </section>

          <hr className="border-t border-gray-200 dark:border-gray-700" />

          {/* Section 3: Offer Status */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide">
              <CalendarDays className="text-purple-600 dark:text-purple-400" size={18} />
              Offer Status
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InfoField label="Valid Till" value={validTill} />
              <InfoField
                label="Status"
                value={
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    isActive
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                  }`}>
                    {isActive ? "Active" : "Inactive"}
                  </span>
                }
              />
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          <Button className="w-full" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
