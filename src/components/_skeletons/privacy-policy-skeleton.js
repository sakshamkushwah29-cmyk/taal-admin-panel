"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const PrivacyPolicySectionSkeleton = () => {
  return (
    <div className="space-y-10">
      {/* Privacy Policy Section */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />  
        <Skeleton className="h-4 w-4/6" />
      </div>

      {/* Divider */}
      <div className="my-4">
        <Skeleton className="h-[2px] w-full" />
      </div>

      {/* Terms of Use Section */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />  
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  );
};

export default PrivacyPolicySectionSkeleton;
