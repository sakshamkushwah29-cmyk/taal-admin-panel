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

export default function PharmacyUpdateRequestsTableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {[
            "Pharmacy Name",
            "Email",
            "Phone",
            "Total Requests",
            "Latest Status",
            "Last Requested At",
            "Action",
          ].map((_, idx) => (
            <TableHead key={idx}>
              <Skeleton className="h-4 w-28" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, rowIdx) => (
          <TableRow key={rowIdx}>
            <TableCell>
              <Skeleton className="h-4 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-40" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-28" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-16" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell className="flex gap-2">
              <Skeleton className="h-8 w-20 rounded-md" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 