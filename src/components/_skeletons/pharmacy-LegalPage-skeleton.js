import React from "react";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";

export default function LegalPageSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Heading */}
      <Skeleton className="h-8 w-1/2" />

      {/* Tabs */}
      <div className="flex gap-4">
        <Skeleton className="h-10 w-32 rounded-md" />
        <Skeleton className="h-10 w-40 rounded-md" />
      </div>

      {/* Content Loading Blocks */}
      <div className="space-y-4 mt-4">
        {[...Array(8)].map((_, idx) => (
          <Skeleton key={idx} className="h-4 w-full" />
        ))}
      </div>
    </div>
  );
}
