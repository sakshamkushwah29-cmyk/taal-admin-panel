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

function InsuranceLeadsSkeleton() {
  return (
    <div className="p-6 space-y-4">
      {/* Table Skeleton */}
      <Table>
        <TableHeader>
          <TableRow>
            {[
              "Name",
              "Email",
              "Phone",
              "Type",
              "Age",
              "Gender",
              "Status",
              "Actions",
            ].map((col, index) => (
              <TableHead key={index}>
                <Skeleton className="h-4 w-24" />
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
                <Skeleton className="h-4 w-44" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-28" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-12" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16 rounded-full" />
              </TableCell>
              <TableCell className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      
    </div>
  );
}

export default InsuranceLeadsSkeleton;
