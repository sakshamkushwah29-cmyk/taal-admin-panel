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

function AssignedOrderSkeleton() {
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-md overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {[
              "Date",
              "Medicines",
              "Status",
              "Payment",
              "Amount",
              "Delivery Address",
              "Action",
            ].map((_, idx) => (
              <TableHead key={idx}>
                <Skeleton className="h-4 w-24" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(4)].map((_, rowIdx) => (
            <TableRow key={rowIdx}>
              {/* Date */}
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>

              {/* Medicines */}
              <TableCell>
                <div className="space-y-1">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-3 w-16 mt-1" />
              </TableCell>

              {/* Status */}
              <TableCell>
                <Skeleton className="h-4 w-36 rounded-full" />
              </TableCell>

              {/* Payment */}
              <TableCell>
                <Skeleton className="h-4 w-28" />
              </TableCell>

              {/* Amount */}
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>

              {/* Delivery Address */}
              <TableCell>
                <div className="space-y-1">
                  <Skeleton className="h-3 w-40" />
                  <Skeleton className="h-3 w-36" />
                </div>
              </TableCell>

              {/* Action */}
              <TableCell className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded-md" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default AssignedOrderSkeleton;


// import React from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../ui/table";
// import { Skeleton } from "../ui/skeleton";

// function AssignedOrderSkeleton() {
//   return (
//     <Table>
//       <TableHeader>
//         <TableRow>
//           {[
//             "Date",
//             "Items",
//             "Order Status",
//             "Payment Status",
//             "Total Amount",
//             "Delivery Address",
//             "Actions",
//           ].map((heading, idx) => (
//             <TableHead key={idx}>
//               <Skeleton className="h-4 w-24" />
//             </TableHead>
//           ))}
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {[...Array(4)].map((_, rowIdx) => (
//           <TableRow key={rowIdx}>
//             {/* Date */}
//             <TableCell>
//               <Skeleton className="h-4 w-20" />
//             </TableCell>

//             {/* Items */}
//             <TableCell>
//               <div className="space-y-1">
//                 <Skeleton className="h-3 w-32" />
//                 <Skeleton className="h-3 w-28" />
//                 <Skeleton className="h-3 w-20" />
//               </div>
//               <Skeleton className="h-3 w-16 mt-1" />
//             </TableCell>

//             {/* Order Status */}
//             <TableCell>
//               <Skeleton className="h-4 w-36 rounded-full" />
//             </TableCell>

//             {/* Payment Status */}
//             <TableCell>
//               <Skeleton className="h-4 w-28" />
//             </TableCell>

//             {/* Total Amount */}
//             <TableCell>
//               <Skeleton className="h-4 w-16" />
//             </TableCell>

//             {/* Delivery Address */}
//             <TableCell>
//               <div className="space-y-1">
//                 <Skeleton className="h-3 w-40" />
//                 <Skeleton className="h-3 w-36" />
//               </div>
//             </TableCell>

//             {/* Actions */}
//             <TableCell className="flex gap-2">
//               <Skeleton className="h-8 w-8 rounded-md" />
//             </TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   );
// }

// export default AssignedOrderSkeleton;
