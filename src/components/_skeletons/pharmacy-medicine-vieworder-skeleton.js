import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const InfoSkeleton = () => (
  <div className="space-y-0.5">
    <Skeleton className="h-3 w-24" />
    <Skeleton className="h-4 w-36" />
  </div>
);

const SectionSkeleton = ({ title }) => (
  <div className="bg-transparent border border-gray-200 shadow-sm rounded-md p-4 space-y-4">
    <Skeleton className="h-4 w-28" />
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[...Array(4)].map((_, i) => (
        <InfoSkeleton key={i} />
      ))}
    </div>
  </div>
);

export default function Medicine_ViewOrderSkeleton() {
  return (
    <DialogContent className="w-full max-w-3xl max-h-[90vh] rounded-2xl bg-background shadow-2xl p-0 flex flex-col">
      <DialogHeader className="px-6 pt-6 pb-3 border-b">
        <Skeleton className="h-5 w-36 mb-2" />
        <Skeleton className="h-4 w-56" />
      </DialogHeader>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 text-sm">
        <SectionSkeleton title="🛒 Order Info" />
        <SectionSkeleton title="👤 Customer Info" />
        <SectionSkeleton title="🏪 Pharmacy Info" />
      </div>

      <div className="px-6 py-4 border-t bg-muted/50">
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </DialogContent>
  );
}
