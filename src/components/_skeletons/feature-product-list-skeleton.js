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

// function FeaturedProductListSkeleton() {
//   return (
//     <>
//       <Table>
//         <TableHeader>
//           <TableRow>
//             {["Name", "Email", "Phone", "Status", "Actions"].map((_, index) => (
//               <TableHead key={index}>
//                 <Skeleton className="h-4 w-24" />
//               </TableHead>
//             ))}
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {[...Array(4)].map((_, rowIdx) => (
//             <TableRow key={rowIdx}>
//               <TableCell>
//                 <Skeleton className="h-4 w-32" />
//               </TableCell>
//               <TableCell>
//                 <Skeleton className="h-4 w-40" />
//               </TableCell>
//               <TableCell>
//                 <Skeleton className="h-4 w-28" />
//               </TableCell>
//               <TableCell>
//                 <Skeleton className="h-6 w-12 rounded-full" />
//               </TableCell>
//               <TableCell className="flex gap-2">
//                 <Skeleton className="h-8 w-8 rounded-md" />
//                 <Skeleton className="h-8 w-8 rounded-md" />
//                 <Skeleton className="h-8 w-8 rounded-md" />
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </>
//   );
// }

// export default FeaturedProductListSkeleton;


import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "../ui/table";
import { Skeleton } from "../ui/skeleton";

export default function FeaturedProductListSkeleton() {
  const columnsCount = 7; // Product Name, Manufacturer, Type, Pack Size, Price, Status, Actions
  const rowsCount = 5;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {Array.from({ length: columnsCount }).map((_, idx) => (
            <TableCell key={idx}>
              <Skeleton className="h-4 w-24 md:w-28" />
            </TableCell>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rowsCount }).map((_, rowIdx) => (
          <TableRow key={rowIdx}>
            {/* Product Name */}
            <TableCell><Skeleton className="h-4 w-36" /></TableCell>
            {/* Manufacturer */}
            <TableCell><Skeleton className="h-4 w-28" /></TableCell>
            {/* Type */}
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            {/* Pack Size */}
            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
            {/* Price */}
            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
            {/* Status (switch placeholder) */}
            <TableCell><Skeleton className="h-6 w-12 rounded-full" /></TableCell>
            {/* Actions (view/delete icons) */}
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

