// "use client";

// import { useState } from "react";
// import {
//   Dialog,
//   DialogTrigger,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";
// import { format } from "date-fns";
// import { Eye } from "lucide-react";
// import useAxios from "@/hooks/useAxios";
// import { showToast } from "@/components/_ui/toast-utils";
// import PharmacyListSkeleton from "@/components/_skeletons/pharmacy-list-skeleton";

// export default function ViewScanHistory({ gatekeeper }) {
//   const [open, setOpen] = useState(false);
//   const {
//     request: getScanHistory,
//     loading: gatekeeperLoading,
//   } = useAxios();
//   const [scans, setScans] = useState([]);

//   const fetchScanHistory = async () => {
//     try {
//       const { data, error } = await getScanHistory({
//         method: "GET",
//         url: `/common-management/get-gatekeeper-scanned-history?gatekeeperId=${gatekeeper._id}`,
//         authRequired: true,
//       });

//       if (error) {
//         showToast("error", error || "Failed to fetch scan history");
//         return;
//       }

//       setScans(data?.data?.scans || []);
//     } catch (err) {
//       showToast("error", "Unexpected error while fetching scan history");
//     }
//   };

//   const handleOpen = (val) => {
//     setOpen(val);
//     if (val) fetchScanHistory();
//   };

//   return (
//     <Dialog open={open} onOpenChange={handleOpen}>
//       {/* Trigger button */}
//       <DialogTrigger asChild>
//         <Button variant="outline" size="sm" className="gap-1">
//           <Eye size={16} /> View History
//         </Button>
//       </DialogTrigger>

//       {/* Content */}
//       <DialogContent className="max-w-6xl">
//         <DialogHeader>
//           <DialogTitle>Scan History</DialogTitle>
//           <DialogDescription>
//             All scanned tickets by{" "}
//             <span className="font-semibold">{gatekeeper?.name}</span>
//           </DialogDescription>
//         </DialogHeader>

//         {gatekeeperLoading ? (
//           <PharmacyListSkeleton />
//         ) : scans.length > 0 ? (
//           <div className="mt-4 border rounded-lg overflow-hidden">
//             {/* Scrollable table */}
//             <div className="max-h-[500px] overflow-y-auto">
//               <Table className="w-full text-sm">
//                 <TableHeader className="sticky top-0 bg-gray-100 dark:bg-gray-800 z-10">
//                   <TableRow>
//                     <TableCell className="font-semibold">Ticket ID</TableCell>
//                     <TableCell className="font-semibold">Event</TableCell>
//                     <TableCell className="font-semibold">Session</TableCell>
//                     <TableCell className="font-semibold">Result</TableCell>
//                     <TableCell className="font-semibold">Notes</TableCell>
//                     <TableCell className="font-semibold">Scanned At</TableCell>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {scans.map((scan) => (
//                     <TableRow
//                       key={scan._id}
//                       className="hover:bg-gray-50 dark:hover:bg-gray-900"
//                     >
//                       <TableCell>{scan.ticketId}</TableCell>
//                       <TableCell>{scan.event?.title || "N/A"}</TableCell>
//                       <TableCell>
//                         {scan.eventSession
//                           ? `${scan.eventSession.specialNameOfDay} (${format(
//                               new Date(scan.eventSession.date),
//                               "dd MMM yyyy"
//                             )})`
//                           : "N/A"}
//                       </TableCell>
//                       <TableCell>
//                         <span
//                           className={`px-2 py-1 rounded text-xs font-medium ${
//                             scan.result === "valid"
//                               ? "bg-green-100 text-green-600"
//                               : scan.result === "invalid" ||
//                                 scan.result === "already_scanned"
//                               ? "bg-yellow-100 text-yellow-600"
//                               : "bg-red-100 text-red-600"
//                           }`}
//                         >
//                           {scan.result}
//                         </span>
//                       </TableCell>
//                       <TableCell>{scan.notes || "N/A"}</TableCell>
//                       <TableCell>
//                         {format(new Date(scan.scannedAt), "dd MMM yyyy, HH:mm")}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           </div>
//         ) : (
//           <p className="text-muted-foreground text-center py-6">
//             No scan history available.
//           </p>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import useAxios from "@/hooks/useAxios";
import { showToast } from "@/components/_ui/toast-utils";
import PharmacyListSkeleton from "@/components/_skeletons/pharmacy-list-skeleton";

export default function ViewScanHistory({ gatekeeper }) {
  const [open, setOpen] = useState(false);
  const { request: getScanHistory, loading: gatekeeperLoading } = useAxios();
  const [scans, setScans] = useState([]);

  const [totalPages, setTotalPages] = useState(1);
  // ✅ Pagination states
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchScanHistory = async (page) => {
    try {
      const { data, error } = await getScanHistory({
        method: "GET",
        url: `/common-management/get-gatekeeper-scanned-history?gatekeeperId=${gatekeeper._id}&page=${page}`,
        authRequired: true,
      });

      if (error) {
        showToast("error", error || "Failed to fetch scan history");
        return;
      }

      setScans(data?.data?.scans || []);
      setTotalPages(data?.data?.totalPages || 1);
      setItemsPerPage(data?.data?.limit || 10);
      setPage(1); // reset page jab naya data aaye
    } catch (err) {
      showToast("error", "Unexpected error while fetching scan history");
    }
  };

  // useEffect(() => {
  //   if(open){
  //     fetchScanHistory(page);
  //   }
  // },[page, open]);

  const handleOpen = (val) => {
    setOpen(val);
    if (val) fetchScanHistory();
  };

  // ✅ Pagination logic
  // const totalPages = Math.ceil(scans.length / itemsPerPage);

  const paginatedData = scans.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      {/* Trigger button */}
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Eye size={16} /> View History
        </Button>
      </DialogTrigger>

      {/* Content */}
      <DialogContent className="w-screen max-w-screen flex flex-col">
        <DialogHeader>
          <DialogTitle>Scan History</DialogTitle>
          <DialogDescription>
            All scanned tickets by{" "}
            <span className="font-semibold">{gatekeeper?.name}</span>
          </DialogDescription>
        </DialogHeader>

        {gatekeeperLoading ? (
          <PharmacyListSkeleton />
        ) : scans.length > 0 ? (
          <div className="mt-2 border rounded-lg flex-1 flex flex-col overflow-hidden">
            {/* Scrollable table */}
            <div className="flex-1 overflow-y-auto">
              <Table className="w-full text-sm">
                <TableHeader className="sticky top-0 bg-gray-100 dark:bg-gray-800 z-10">
                  <TableRow>
                    <TableCell className="font-semibold">Ticket ID</TableCell>
                    <TableCell className="font-semibold">Event</TableCell>
                    <TableCell className="font-semibold">Session</TableCell>
                    <TableCell className="font-semibold">Result</TableCell>
                    <TableCell className="font-semibold">Notes</TableCell>
                    <TableCell className="font-semibold">Scanned At</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((scan) => (
                    <TableRow
                      key={scan._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-900"
                    >
                      <TableCell>{scan.ticketId}</TableCell>
                      <TableCell>{scan.event?.title || "N/A"}</TableCell>
                      <TableCell>
                        {scan.eventSession
                          ? `${scan.eventSession.specialNameOfDay} (${format(
                              new Date(scan.eventSession.date),
                              "dd MMM yyyy"
                            )})`
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            scan.result === "valid"
                              ? "bg-green-100 text-green-600"
                              : scan.result === "invalid" ||
                                scan.result === "already_scanned"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {scan.result}
                        </span>
                      </TableCell>
                      <TableCell>{scan.notes || "N/A"}</TableCell>
                      <TableCell>
                        {format(new Date(scan.scannedAt), "dd MMM yyyy, HH:mm")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* ✅ Pagination Controls (always visible at bottom) */}
            <div className="flex justify-between items-center p-3 border-t bg-white dark:bg-gray-900">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>

              <span className="text-sm">
                Page {page} of {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-6">
            No scan history available.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
