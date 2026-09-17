import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "../ui/table";
import { Skeleton } from "../ui/skeleton";

export default function SpecialOffersListSkeleton() {
  const columnsCount = 7; // Product Name, Original, Offer Price, Offer %, Valid Till, Status, Actions
  const rowsCount = 5;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {Array.from({ length: columnsCount }).map((_, idx) => (
            <TableCell key={idx}>
              <Skeleton className="h-4 w-20 md:w-24" />
            </TableCell>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rowsCount }).map((_, rowIdx) => (
          <TableRow key={rowIdx}>
            {/* Product Name */}
            <TableCell><Skeleton className="h-4 w-40" /></TableCell>
            {/* Original Price */}
            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
            {/* Offer Price */}
            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
            {/* Offer Percentage */}
            <TableCell><Skeleton className="h-4 w-12" /></TableCell>
            {/* Valid Till */}
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            {/* Status (switch) */}
            <TableCell><Skeleton className="h-6 w-12 rounded-full" /></TableCell>
            {/* Actions (edit/view/delete icons) */}
            <TableCell className="flex gap-2">
              
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
