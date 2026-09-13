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
  PackageSearch,
  BadgeCheck,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const SectionCard = ({ icon: Icon, iconColor, title, children }) => (
  <div className="rounded-2xl border border-muted bg-muted/40 dark:bg-muted/10 p-5 space-y-4 shadow-sm">
    <div className="flex items-center gap-2">
      <Icon className={`w-5 h-5 ${iconColor}`} />
      <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100 uppercase">{title}</h4>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
  </div>
);

const InfoField = ({ label, value }) => (
  <div>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{value || "N/A"}</p>
  </div>
);

const StatusBadge = ({ condition, trueLabel, falseLabel, trueColor, falseColor }) => (
  <Badge className={`text-xs ${condition ? trueColor : falseColor}`}>
    {condition ? trueLabel : falseLabel}
  </Badge>
);

export default function ViewBestSellingModal({ offer }) {
  const [open, setOpen] = useState(false);
  const { product, soldCount, isActive, isCreatedByAdmin } = offer;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Eye size={18} />
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-gray-950 p-0 shadow-xl">
        <DialogHeader className="p-6 border-b border-border">
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Info className="w-5 h-5 text-purple-500" />
          Best Selling Product Details
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            A summary of best selling product information
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Product Info */}
          <SectionCard icon={PackageSearch} iconColor="text-emerald-500" title="Product Info">
            <InfoField label="Product Name" value={product?.name} />
            <InfoField label="Manufacturer" value={product?.manufacturer} />
            <InfoField label="Type" value={product?.type} />
            <InfoField label="Pack Size" value={product?.packSizeLabel} />
            <InfoField label="Price" value={`₹${product?.price}`} />
            <div>
              <p className="text-xs text-muted-foreground">Prescription Required</p>
              <StatusBadge
                condition={product?.isPrescriptionRequired}
                trueLabel="Yes"
                falseLabel="No"
                trueColor="bg-green-100 text-green-800"
                falseColor="bg-gray-100 text-gray-800"
              />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Discontinued</p>
              <StatusBadge
                condition={product?.Is_discontinued === "TRUE"}
                trueLabel="Yes"
                falseLabel="No"
                trueColor="bg-red-100 text-red-700"
                falseColor="bg-gray-100 text-gray-800"
              />
            </div>
            <InfoField label="Composition" value={product?.short_composition1} />
          </SectionCard>

          {/* Status Info */}
          <SectionCard icon={BadgeCheck} iconColor="text-indigo-500" title="Status Info">
            <InfoField label="Sold Count" value={soldCount} />
            <div>
              <p className="text-xs text-muted-foreground">Active Status</p>
              <StatusBadge
                condition={isActive}
                trueLabel="Active"
                falseLabel="Inactive"
                trueColor="bg-green-100 text-green-800"
                falseColor="bg-yellow-100 text-yellow-800"
              />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Created by Admin</p>
              <StatusBadge
                condition={isCreatedByAdmin}
                trueLabel="Yes"
                falseLabel="No"
                trueColor="bg-blue-100 text-blue-800"
                falseColor="bg-gray-100 text-gray-800"
              />
            </div>
          </SectionCard>
        </div>

        <div className="p-6 border-t border-border">
          <Button className="w-full" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
