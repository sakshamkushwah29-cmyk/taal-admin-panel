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

function PrescriptionListSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {[
            "Prescription No.",
            "Patient Name",
            "Status",
            "Created At",
            "View",
            "Invoice",
          ].map((_, idx) => (
            <TableHead key={idx}>
              <Skeleton className="h-4 w-28" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {[...Array(6)].map((_, rowIdx) => (
          <TableRow key={rowIdx}>
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-20 rounded" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-40" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8 w-8 rounded-md" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8 w-24 rounded-md" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default PrescriptionListSkeleton;
