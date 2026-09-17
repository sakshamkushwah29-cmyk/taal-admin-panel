// ViewAssignedPrescriptionSkeleton.tsx
"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export default function ViewAssignedPrescriptionSkeleton() {
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-md overflow-x-auto">
      <Table>
        <TableHeader>
          
        </TableHeader>
        <TableBody>
          {[...Array(4)].map((_, rowIdx) => (
            <TableRow key={rowIdx}>
              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell><Skeleton className="h-4 w-28" /></TableCell>
              <TableCell><Skeleton className="h-4 w-20 rounded-full" /></TableCell>
              <TableCell><Skeleton className="h-4 w-32" /></TableCell>
              <TableCell><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
              <TableCell><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
