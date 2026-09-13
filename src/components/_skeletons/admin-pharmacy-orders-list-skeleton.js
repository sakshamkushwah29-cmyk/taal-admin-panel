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

function AdminPharmacyOrdersListSkeleton() {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            {["Name", "Email","Order Number", "Phone", "Status","Order", "Actions" ].map((_, index) => (
              <TableHead key={index}>
                <Skeleton className="h-4 w-24" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(9)].map((_, rowIdx) => (
            <TableRow key={rowIdx}>
              <TableCell>
                <Skeleton className="h-4 w-28" />
              </TableCell>
               <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
               <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-25" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-28" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-12 rounded-full" />
              </TableCell>
               
              <TableCell className="flex gap-2">
                <Skeleton className="h-8 w-18 rounded-md" />
                
               
              </TableCell>
            

              
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

export default AdminPharmacyOrdersListSkeleton;
