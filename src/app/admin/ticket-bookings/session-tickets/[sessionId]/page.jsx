// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { debounce } from "lodash";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableHeader,
//   TableRow,
//   TableCell,
//   TableBody,
// } from "@/components/ui/table";
// import { Input } from "@/components/ui/input";
// import { Switch } from "@/components/ui/switch";
// import { RefreshCw, AlertCircle } from "lucide-react";
// import { Alert } from "@/components/ui/alert";
// import useAxios from "@/hooks/useAxios";
// import AdminDashboardLayout from "../../../page";
// import AppBreadcrumb from "@/components/_ui/app-breadcrumb";
// import { useParams, useRouter } from "next/navigation";
// import ViewTicket from "@/components/_dialogs/ViewTicket";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// export default function SessionTicketsPage() {
//   const router = useRouter();
//   const { sessionId } = useParams();
//   const { request } = useAxios();

//   const [tickets, setTickets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [refreshKey, setRefreshKey] = useState(0);

//   const [searchValue, setSearchValue] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [statusFilter, setStatusFilter] = useState("");

//   // Debounced search
//   const debounceSearch = useCallback(
//     debounce((val) => {
//       setSearchQuery(val);
//       setCurrentPage(1);
//     }, 500),
//     []
//   );

//   const handleSearchChange = (e) => {
//     const val = e.target.value;
//     setSearchValue(val);
//     debounceSearch(val);
//   };

//   const handleRefresh = () => setRefreshKey((prev) => prev + 1);

//   // const fetchTickets = async () => {
//   //   if (!sessionId) return;
//   //   setLoading(true);
//   //   try {
//   //     const ITEMS_PER_PAGE = 10;
//   //     const endpoint = searchQuery
//   //       ? `/common-management/get-tickets-by-session-id?sessionId=${sessionId}&search=${searchQuery}&limit=${ITEMS_PER_PAGE}&page=${currentPage}`
//   //       : `/common-management/get-tickets-by-session-id?sessionId=${sessionId}&limit=${ITEMS_PER_PAGE}&page=${currentPage}`;

//   //     const { data, error } = await request({
//   //       url: endpoint,
//   //       method: "GET",
//   //       authRequired: true,
//   //     });

//   //     if (error || !data?.data) {
//   //       setError(data?.message || "Failed to fetch tickets");
//   //       setTickets([]);
//   //     } else {
//   //       setTickets(data.data.data || []);
//   //       setTotalPages(data.data.total || 1);
//   //     }
//   //   } catch (err) {
//   //     setError(err.message || "Unexpected error");
//   //     setTickets([]);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const fetchTickets = async () => {
//     if (!sessionId) return;
//     setLoading(true);
//     try {
//       const ITEMS_PER_PAGE = 10;
//       let endpoint = `/common-management/get-tickets-by-session-id?sessionId=${sessionId}&limit=${ITEMS_PER_PAGE}&page=${currentPage}`;

//       if (searchQuery) endpoint += `&search=${searchQuery}`;
//       if (statusFilter) endpoint += `&ticketStatus=${statusFilter}`; // Pass filter to API

//       const { data, error } = await request({
//         url: endpoint,
//         method: "GET",
//         authRequired: true,
//       });

//       if (error || !data?.data) {
//         setError(data?.message || "Failed to fetch tickets");
//         setTickets([]);
//       } else {
//         setTickets(data.data.data || []);
//         setTotalPages(data.data.total || 1);
//       }
//     } catch (err) {
//       setError(err.message || "Unexpected error");
//       setTickets([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTickets();
//   }, [sessionId, currentPage, searchQuery, refreshKey, statusFilter]);

//   console.log(tickets, "Tickets");

//   return (
//     <AdminDashboardLayout>
//       <AppBreadcrumb />
//       <div className="p-6 space-y-6">
//         <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
//           <h2 className="text-xl font-bold">
//             Bookings for Session{" "}
//             {tickets[0]?.eventSessionDetails?.specialNameOfDay || "-"}
//             {tickets[0]?.eventSessionDetails?.date &&
//               ` (${new Date(
//                 tickets[0]?.eventSessionDetails?.date
//               ).toLocaleDateString()})`}
//           </h2>

//           <div className="flex flex-col md:flex-row gap-2 items-center">
//             <Input
//               placeholder="Search by attendee name or ticket ID..."
//               value={searchValue}
//               onChange={handleSearchChange}
//               className="w-[250px]"
//             />

//             <Select
//               value={statusFilter}
//               onValueChange={(val) => {
//                 setStatusFilter(val);
//                 setCurrentPage(1); // reset page on filter change
//               }}
//             >
//               <SelectTrigger className="w-[150px]">
//                 <SelectValue placeholder="Filter by status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="">All</SelectItem>
//                 <SelectItem value="confirmed">Confirmed</SelectItem>
//                 <SelectItem value="pending">Pending</SelectItem>
//                 <SelectItem value="failed">Failed</SelectItem>
//               </SelectContent>
//             </Select>
//             <Button
//               variant="outline"
//               onClick={handleRefresh}
//               className="flex items-center gap-1"
//             >
//               <RefreshCw className="w-5 h-5" /> Refresh
//             </Button>
//           </div>
//         </div>

//         {error && (
//           <Alert variant="destructive">
//             <AlertCircle className="w-5 h-5" />
//             <span>{error}</span>
//           </Alert>
//         )}

//         {loading ? (
//           <div className="text-center text-gray-500">Loading tickets...</div>
//         ) : tickets.length === 0 ? (
//           <div className="text-center text-muted-foreground">
//             No Bookings found.
//           </div>
//         ) : (
//           <>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableCell>Ticket ID</TableCell>
//                   <TableCell>Attendee</TableCell>
//                   <TableCell>Phone</TableCell>
//                   <TableCell>Payment</TableCell>
//                   <TableCell>Status</TableCell>
//                   <TableCell>Valid For</TableCell>
//                   <TableCell>Tickets</TableCell>
//                   <TableCell className="text-center">Actions</TableCell>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {tickets.map((ticket) => (
//                   <TableRow key={ticket._id}>
//                     <TableCell>{ticket.tickets[0]?.ticketId || "-"}</TableCell>
//                     <TableCell>
//                       {ticket.attendeeDetails[0]?.name || "-"}
//                     </TableCell>
//                     <TableCell>
//                       {ticket.attendeeDetails[0]?.phone || "-"}
//                     </TableCell>
//                     <TableCell>
//                       ₹{ticket.totalAmount} ({ticket.paymentStatus})
//                     </TableCell>
//                     <TableCell>{ticket.ticketStatus}</TableCell>
//                     <TableCell className="text-center font-semibold align-middle">
//                       {ticket.eventSessionDetails?.specialNameOfDay || "-"}{" "}
//                       <br />
//                       {ticket.eventSessionDetails?.date
//                         ? new Date(
//                             ticket.eventSessionDetails.date
//                           ).toLocaleDateString("en-IN")
//                         : "-"}
//                     </TableCell>
//                     <TableCell className="text-center font-semibold align-right">
//                       {ticket.tickets?.length || 0} Ticket
//                       {ticket.tickets?.length > 1 ? "s" : ""}
//                     </TableCell>
//                     <TableCell className="flex justify-center">
//                       <ViewTicket ticketId={ticket._id} />
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>

//             {/* Pagination */}
//             <div className="flex justify-center gap-2 mt-4">
//               <Button
//                 size="sm"
//                 disabled={currentPage === 1}
//                 onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//               >
//                 Previous
//               </Button>
//               <span className="px-2 py-1 border rounded">{currentPage}</span>
//               <Button
//                 size="sm"
//                 disabled={currentPage === totalPages}
//                 onClick={() => setCurrentPage((prev) => prev + 1)}
//               >
//                 Next
//               </Button>
//             </div>
//           </>
//         )}
//       </div>
//     </AdminDashboardLayout>
//   );
// }

"use client";

import { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import { Button } from "@/components/ui/button";
import { Ticket, IndianRupee } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { RefreshCw, AlertCircle } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import useAxios from "@/hooks/useAxios";
import AdminDashboardLayout from "../../../page";
import AppBreadcrumb from "@/components/_ui/app-breadcrumb";
import { useParams, useRouter } from "next/navigation";
import ViewTicket from "@/components/_dialogs/ViewTicket";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SessionTicketsPage() {
  const router = useRouter();
  const { sessionId } = useParams();
  const { request } = useAxios();
  const { request: fetchTicketSummary } = useAxios();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [searchValue, setSearchValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [ticketCount, setTicketCount] = useState({});

  // Debounced search
  const debounceSearch = useCallback(
    debounce((val) => {
      setSearchQuery(val);
      setCurrentPage(1);
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchValue(val);
    debounceSearch(val);
  };

  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  const fetchTickets = async () => {
    if (!sessionId) return;
    setLoading(true);
    try {
      const ITEMS_PER_PAGE = 10;
      let endpoint = `/common-management/get-tickets-by-session-id?sessionId=${sessionId}&limit=${ITEMS_PER_PAGE}&page=${currentPage}`;

      if (searchQuery) endpoint += `&search=${searchQuery}`;
      if (statusFilter !== "all") endpoint += `&ticketStatus=${statusFilter}`;

      const { data, error } = await request({
        url: endpoint,
        method: "GET",
        authRequired: true,
      });

      if (error || !data?.data) {
        setError(data?.message || "Failed to fetch tickets");
        setTickets([]);
      } else {
        setTickets(data.data.data || []);
        setTotalPages(data.data.total || 1);
      }
    } catch (err) {
      setError(err.message || "Unexpected error");
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [sessionId, currentPage, searchQuery, refreshKey, statusFilter]);

  const fetchTicketsSummary = async () => {
    try {
      let { data, error } = await fetchTicketSummary({
        method: "GET",
        url: "/superadmin/overall-tickets-from-users?sessionId=" + sessionId,
        authRequired: true,
      });

      console.log(data, "0000000000000000000000");
      if (!error && data) {
        setTicketCount(data.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchTicketsSummary();
  }, []);

  return (
    <AdminDashboardLayout>
      <AppBreadcrumb />
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
          <h2 className="text-xl font-bold">
            Bookings for Session{" "}
            {tickets[0]?.eventSessionDetails?.specialNameOfDay || "-"}
            {tickets[0]?.eventSessionDetails?.date &&
              ` (${new Date(
                tickets[0]?.eventSessionDetails?.date
              ).toLocaleDateString()})`}
          </h2>

          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full sm:w-auto">
            <Input
              placeholder="Search by attendee name or ticket ID..."
              value={searchValue}
              onChange={handleSearchChange}
              className="w-full sm:w-[250px]"
            />

            <Select
              value={statusFilter}
              onValueChange={(val) => {
                setStatusFilter(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={handleRefresh}
              className="flex items-center gap-1 w-full sm:w-auto"
            >
              <RefreshCw className="w-5 h-5" /> Refresh
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </Alert>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="flex flex-col items-start justify-center p-4 border rounded-lg bg-muted">
            <div className="flex items-center gap-2">
              <Ticket className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-muted-foreground">
                Tickets Count
              </span>
            </div>
            <span className="text-lg font-bold text-foreground mt-1">
              {ticketCount?.totalTickets || 0}
            </span>
          </div>

          <div className="flex flex-col items-start justify-center p-4 border rounded-lg bg-muted">
            <div className="flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-muted-foreground">
                Ticket Earnings
              </span>
            </div>
            <span className="text-lg font-bold text-foreground mt-1">
              ₹{(ticketCount?.totalAmount || 0).toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Loading tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="text-center text-muted-foreground">
            No Bookings found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-[800px]">
              <TableHeader>
                <TableRow>
                  <TableCell>Ticket ID</TableCell>
                  <TableCell>Attendee</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Payment</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Valid For</TableCell>
                  <TableCell>Tickets</TableCell>
                  <TableCell className="text-center">Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket._id}>
                    <TableCell>{ticket.tickets[0]?.ticketId || "-"}</TableCell>
                    <TableCell>
                      {ticket.attendeeDetails[0]?.name || "-"}
                    </TableCell>
                    <TableCell>
                      {ticket.attendeeDetails[0]?.phone || "-"}
                    </TableCell>
                    <TableCell>
                      ₹{ticket.totalAmount} ({ticket.paymentStatus})
                    </TableCell>
                    <TableCell>{ticket.ticketStatus}</TableCell>
                    <TableCell className="text-center font-semibold align-middle">
                      {ticket.eventSessionDetails?.specialNameOfDay || "-"}{" "}
                      <br />
                      {ticket.eventSessionDetails?.date
                        ? new Date(
                            ticket.eventSessionDetails.date
                          ).toLocaleDateString("en-IN")
                        : "-"}
                    </TableCell>
                    <TableCell className="text-center font-semibold align-right">
                      {ticket.tickets?.length || 0} Ticket
                      {ticket.tickets?.length > 1 ? "s" : ""}
                    </TableCell>
                    <TableCell className="flex justify-center">
                      <ViewTicket ticketId={ticket._id} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-4 flex-wrap">
              <Button
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                Previous
              </Button>
              <span className="px-2 py-1 border rounded">{currentPage}</span>
              <Button
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}
