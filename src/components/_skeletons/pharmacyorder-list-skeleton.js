import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Skeleton } from "../ui/skeleton";

function PharmacyOrderSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {[
            "Order Date",
            "Customer Name",
            "Items Count",
            "Payment Status",
            "Payment Method",
            "Total Amount",
            "Actions",
          ].map((_, idx) => (
            <TableHead key={idx}>
              <Skeleton className="h-4 w-28" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(4)].map((_, rowIdx) => (
          <TableRow key={rowIdx}>
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-16" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-20" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-20" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-20" />
            </TableCell>
            <TableCell className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded-md" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default PharmacyOrderSkeleton;
