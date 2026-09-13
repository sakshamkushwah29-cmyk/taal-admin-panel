// "use client";

// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableHeader,
//   TableRow,
//   TableCell,
//   TableBody,
// } from "@/components/ui/table";
// import {
//   RefreshCw,
//   AlertCircle,
//   X,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import { showToast } from "@/components/_ui/toast-utils";
// import useAxios from "@/hooks/useAxios";
// import { Alert } from "@/components/ui/alert";
// import AdminDashboardLayout from "../page";
// import AppBreadcrumb from "@/components/_ui/app-breadcrumb";
// import CreateTicketDialog from "../../../components/_dialogs/CreateTicket";

// export default function GenerateTicketsPage() {
//   const [events, setEvents] = useState([]);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [sessions, setSessions] = useState([]);
//   const [selectedSession, setSelectedSession] = useState(null);
//   const [tickets, setTickets] = useState([]);
//   const [loadingTickets, setLoadingTickets] = useState(false);
//   const [ticketType, setTicketType] = useState(""); // vip / allDay / ""
//   const [refreshKey, setRefreshKey] = useState(0);

//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     pageSize: 10,
//   });

//   const { request: apiRequest, error } = useAxios();

//   // Fetch all events on page load
//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const { data, error } = await apiRequest({
//           method: "GET",
//           url: "/common-management/get-all-events",
//           authRequired: true,
//         });

//         if (!error && data?.data?.length > 0) {
//           setEvents(data.data);

//           // Select first event
//           const firstEvent = data.data[0];
//           setSelectedEvent(firstEvent._id);
//           setSessions(firstEvent.sessions || []);
//           setSelectedSession(null); // initial load -> no session selected

//           // Fetch tickets for first event only
//           fetchTickets(firstEvent._id, null, "", 1);
//         }
//       } catch (err) {
//         console.error(err);
//         showToast("error", "Failed to fetch events.");
//       }
//     };

//     fetchEvents();
//   }, [refreshKey]);

//   // Fetch tickets function
//   const fetchTickets = async (
//     eventId,
//     sessionId = null,
//     type = "",
//     page = 1
//   ) => {
//     setLoadingTickets(true);
//     try {
//       let url = `/superadmin/get-generated-tickets?eventId=${eventId}&page=${page}`;

//       if (sessionId) url += `&sessionId=${sessionId}`;
//       if (type === "vip") url += "&isVip=true";
//       if (type === "validForAllDays") url += "&validForAllDays=true";

//       const { data, error } = await apiRequest({
//         method: "GET",
//         url,
//         authRequired: true,
//       });

//       if (!error && data?.data?.tickets) {
//         setTickets(data.data.tickets);
//         setPagination({
//           currentPage: data.data.currentPage || 1,
//           totalPages: data.data.totalPages || 1,
//           pageSize: data.data.pageSize || 10,
//         });
//       } else {
//         setTickets([]);
//         setPagination({ currentPage: 1, totalPages: 1, pageSize: 10 });
//       }
//     } catch (err) {
//       console.error(err);
//       showToast("error", "Failed to fetch tickets.");
//     } finally {
//       setLoadingTickets(false);
//     }
//   };
//   // Event change handler
//   const handleEventChange = (e) => {
//     const eventId = e.target.value;
//     setSelectedEvent(eventId);

//     const eventObj = events.find((ev) => ev._id === eventId);
//     setSessions(eventObj?.sessions || []);
//     setSelectedSession(null); // reset session on event change
//     setTicketType(""); // reset type filter

//     fetchTickets(eventId, null, "", 1);
//   };

//   // Session change handler
//   const handleSessionChange = (e) => {
//     const sessionId = e.target.value;
//     setSelectedSession(sessionId);
//     fetchTickets(selectedEvent, sessionId, ticketType, 1);
//   };

//   // VIP / All-day tickets
//   const handleVIPTickets = () => {
//     setTicketType("vip");
//     fetchTickets(selectedEvent, selectedSession, "vip", 1);
//   };
//   const handleAllDayTickets = () => {
//     setTicketType("validForAllDays");
//     fetchTickets(selectedEvent, selectedSession, "validForAllDays", 1);
//   };

//   // Clear filter
//   const handleClearFilter = () => {
//     setSelectedSession(null);
//     setTicketType("");
//     fetchTickets(selectedEvent, null, "", 1);
//   };

//   // Pagination controls
//   const goToPage = (page) => {
//     if (page < 1 || page > pagination.totalPages) return;
//     fetchTickets(selectedEvent, selectedSession, ticketType, page);
//   };

//   // Refresh
//   const handleRefresh = () => setRefreshKey((prev) => prev + 1);

//   return (
//     <AdminDashboardLayout>
//       <AppBreadcrumb />
//       <div className="p-6 space-y-6">
//         {/* Header & Filters */}
//         <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
//           <h2 className="text-xl font-bold">Generate Tickets</h2>
//           <div className="flex flex-col md:flex-row gap-2 items-center">
//             {/* Event Dropdown */}
//             <select
//               className="border rounded p-2"
//               value={selectedEvent || ""}
//               onChange={handleEventChange}
//             >
//               {events.map((event) => (
//                 <option key={event._id} value={event._id}>
//                   {event.title}
//                 </option>
//               ))}
//             </select>

//             {/* Session Dropdown */}
//             <select
//               className="border rounded p-2"
//               value={selectedSession || ""}
//               onChange={handleSessionChange}
//             >
//               <option value="">All Sessions</option>
//               {sessions.map((session) => (
//                 <option key={session._id} value={session._id}>
//                   {session.specialNameOfDay} (
//                   {new Date(session.date).toLocaleDateString()})
//                 </option>
//               ))}
//             </select>

//             {/* Buttons */}
//             <div className="flex gap-2">
//               <Button variant="outline" onClick={handleVIPTickets}>
//                 VIP Tickets
//               </Button>
//               <Button variant="outline" onClick={handleAllDayTickets}>
//                 All Day Tickets
//               </Button>
//               <Button
//                 variant="destructive"
//                 onClick={handleClearFilter}
//                 className="flex items-center gap-1"
//               >
//                 <X className="w-4 h-4" /> Clear Filter
//               </Button>
//               <Button
//                 variant="outline"
//                 onClick={handleRefresh}
//                 disabled={loadingTickets}
//               >
//                 <RefreshCw className="w-5 h-5 mr-1" /> Refresh
//               </Button>
//               <CreateTicketDialog
//                 events={events}
//                 onSuccess={() => fetchTickets(selectedEvent, selectedSession)}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Error */}
//         {error && (
//           <Alert variant="destructive">
//             <AlertCircle className="w-5 h-5" />
//             <span>Error: {error || "Failed to fetch tickets."}</span>
//           </Alert>
//         )}

//         {/* Tickets Table */}
//         {loadingTickets ? (
//           <div className="text-center py-10">Loading tickets...</div>
//         ) : tickets.length > 0 ? (
//           <>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableCell>Ticket ID</TableCell>
//                   <TableCell>Attendee Name</TableCell>
//                   <TableCell>VIP</TableCell>
//                   <TableCell>All Day</TableCell>
//                   <TableCell>Status</TableCell>
//                   <TableCell>Created At</TableCell>
//                   <TableCell>QR</TableCell>
//                   <TableCell>PDF</TableCell>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {tickets.map((ticket) => (
//                   <TableRow key={ticket.ticketId}>
//                     <TableCell>{ticket.ticketId}</TableCell>
//                     <TableCell>{ticket.attendeeName}</TableCell>
//                     <TableCell>{ticket.isVipTicket ? "Yes" : "No"}</TableCell>
//                     <TableCell>
//                       {ticket.validForAllDays ? "Yes" : "No"}
//                     </TableCell>
//                     <TableCell>{ticket.status}</TableCell>
//                     <TableCell>
//                       {ticket.createdAt
//                         ? new Date(ticket.createdAt).toLocaleString("en-IN", {
//                             timeZone: "Asia/Kolkata",
//                             day: "2-digit",
//                             month: "short",
//                             year: "numeric",
//                           })
//                         : "N/A"}
//                     </TableCell>
//                     <TableCell>
//                       {ticket.qrImage ? (
//                         <img
//                           src={ticket.qrImage}
//                           alt="QR Code"
//                           className="w-12 h-12"
//                         />
//                       ) : (
//                         "N/A"
//                       )}
//                     </TableCell>
//                     <TableCell>
//                       {ticket.pdfPath ? (
//                         <div className="flex gap-2">
//                           {/* View PDF */}
//                           <a
//                             href={`${process.env.NEXT_PUBLIC_API_BASE_URL}${ticket.pdfPath}`}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-blue-500 underline"
//                           >
//                             View
//                           </a>

//                           {/* Download PDF */}
//                           {/* <a
//                             href={`${process.env.NEXT_PUBLIC_API_BASE_URL}${ticket.pdfPath}`}
//                             download={`ticket-${ticket.ticketId}.pdf`}
//                             className="text-green-500 underline"
//                           >
//                             Download
//                           </a> */}
//                         </div>
//                       ) : (
//                         "N/A"
//                       )}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>

//             {/* Pagination */}
//             <div className="flex justify-center items-center gap-2 mt-4">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => goToPage(pagination.currentPage - 1)}
//                 disabled={pagination.currentPage === 1}
//               >
//                 <ChevronLeft className="w-4 h-4" /> Prev
//               </Button>
//               <span>
//                 Page {pagination.currentPage} of {pagination.totalPages}
//               </span>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => goToPage(pagination.currentPage + 1)}
//                 disabled={pagination.currentPage === pagination.totalPages}
//               >
//                 Next <ChevronRight className="w-4 h-4" />
//               </Button>
//             </div>
//           </>
//         ) : (
//           <div className="text-center text-muted-foreground">
//             No tickets found.
//           </div>
//         )}
//       </div>
//     </AdminDashboardLayout>
//   );
// }

"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { debounce } from "lodash";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import {
  RefreshCw,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { showToast } from "@/components/_ui/toast-utils";
import useAxios from "@/hooks/useAxios";
import { Alert } from "@/components/ui/alert";
import AdminDashboardLayout from "../page";
import AppBreadcrumb from "@/components/_ui/app-breadcrumb";
import CreateTicketDialog from "../../../components/_dialogs/CreateTicket";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function GenerateTicketsPage() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [ticketType, setTicketType] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [ticketStatus, setTicketStatus] = useState("");
  const [qrOpen, setQrOpen] = useState(false);
  const [selectedQR, setSelectedQR] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
  });

  const { request: apiRequest, error } = useAxios();

  // Fetch all events on page load
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await apiRequest({
          method: "GET",
          url: "/common-management/get-all-events",
          authRequired: true,
        });

        if (!error && data?.data?.length > 0) {
          setEvents(data.data);

          const firstEvent = data.data[0];
          setSelectedEvent(firstEvent._id);
          setSessions(firstEvent.sessions || []);
          setSelectedSession(null);

          fetchTickets(firstEvent._id, null, "", 1);
        }
      } catch (err) {
        console.error(err);
        showToast("error", "Failed to fetch events.");
      }
    };

    fetchEvents();
  }, [refreshKey]);

  const fetchTickets = async (
    eventId,
    sessionId = null,
    type = "",
    page = 1,
    status = "",
    search = ""
  ) => {
    setLoadingTickets(true);
    try {
      let url = `/superadmin/get-generated-tickets?eventId=${eventId}&page=${page}`;

      if (sessionId) url += `&sessionId=${sessionId}`;
      if (type === "vip") url += "&isVip=true";
      if (type === "validForAllDays") url += "&validForAllDays=true";
      if (status) url += `&ticketStatus=${status}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      const { data, error } = await apiRequest({
        method: "GET",
        url,
        authRequired: true,
      });

      if (!error && data?.data?.tickets) {
        console.log(data.data.tickets, "1111111111111");
        // 🔹 Flatten structure
        const normalized = data.data.tickets.flatMap((booking) =>
          (booking.tickets || []).map((t, idx) => ({
            ticketId: t.ticketId,
            qrImage: t.qrImage,
            qrData: t.qrData,
            pdfPath: t.pdfPath || null,

            attendeeName:
              t.attendeeName ||
              booking.attendeeDetails?.[idx]?.name ||
              booking.attendeeDetails?.[0]?.name ||
              "N/A",
            eventName: booking.event?.title || "N/A",
            session: booking.eventSession || null,
            sessionDetails: booking.session || null,

            isVipTicket: booking.isVipTicket || false,
            validForAllDays: booking.validForAllDays || false,

            status: booking.ticketStatus,
            paymentStatus: booking.paymentStatus,
            createdAt: booking.createdAt || booking.updatedAt || null,
          }))
        );

        setTickets(normalized);
        setPagination({
          currentPage: data.data.currentPage || 1,
          totalPages: data.data.totalPages || 1,
          pageSize: data.data.pageSize || 10,
        });
      } else {
        setTickets([]);
        setPagination({ currentPage: 1, totalPages: 1, pageSize: 10 });
      }
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to fetch tickets.");
    } finally {
      setLoadingTickets(false);
    }
  };

  const debounceSearch = useCallback(
    debounce((val) => {
      fetchTickets(
        selectedEvent,
        selectedSession,
        ticketType,
        1,
        ticketStatus,
        val
      );
    }, 500),
    [selectedEvent, selectedSession, ticketType, ticketStatus] // dependencies add kar
  );

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchValue(val);
    debounceSearch(val);
  };

  const handleStatusChange = (e) => {
    const status = e.target.value;
    setTicketStatus(status);
    fetchTickets(selectedEvent, selectedSession, ticketType, 1, status);
  };

  const handleEventChange = (e) => {
    const eventId = e.target.value;
    setSelectedEvent(eventId);

    const eventObj = events.find((ev) => ev._id === eventId);
    setSessions(eventObj?.sessions || []);
    setSelectedSession(null);
    setTicketType("");

    fetchTickets(eventId, null, "", 1);
  };

  const handleSessionChange = (e) => {
    const sessionId = e.target.value;
    setSelectedSession(sessionId);
    fetchTickets(selectedEvent, sessionId, ticketType, 1);
  };

  const handleVIPTickets = () => {
    setTicketType("vip");
    fetchTickets(selectedEvent, selectedSession, "vip", 1);
  };
  const handleAllDayTickets = () => {
    setTicketType("validForAllDays");
    fetchTickets(selectedEvent, selectedSession, "validForAllDays", 1);
  };
  const handleClearFilter = () => {
    setSelectedSession(null);
    setTicketType("");
    setTicketStatus("");
    setSearchValue("");
    fetchTickets(selectedEvent, null, "", 1);
  };

  const goToPage = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    fetchTickets(
      selectedEvent,
      selectedSession,
      ticketType,
      page,
      ticketStatus
    );
  };

  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  return (
    <AdminDashboardLayout>
      <AppBreadcrumb />
      <div className="p-4 md:p-6 space-y-6">
        {/* Header & Filters */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg md:text-xl font-bold">Generate Tickets</h2>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row flex-wrap items-center gap-2 w-full lg:w-auto">
              {/* Event Dropdown */}
              <Select
                value={selectedEvent || "__placeholder__"}
                onValueChange={(val) => {
                  const eventId = val === "__placeholder__" ? null : val;
                  setSelectedEvent(eventId);
                  const eventObj = events.find((ev) => ev._id === eventId);
                  setSessions(eventObj?.sessions || []);
                  setSelectedSession(null);
                  setTicketType("");
                  fetchTickets(eventId, null, "", 1);
                }}
              >
                <SelectTrigger className="min-w-[160px] w-full sm:w-auto">
                  <SelectValue placeholder="Select Event" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__placeholder__">Select Event</SelectItem>
                  {events.map((event) => (
                    <SelectItem key={event._id} value={event._id}>
                      {event.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Session Dropdown */}
              <Select
                value={selectedSession || "__placeholder__"}
                onValueChange={(val) => {
                  const sessionId = val === "__placeholder__" ? null : val;
                  setSelectedSession(sessionId);
                  fetchTickets(selectedEvent, sessionId, ticketType, 1);
                }}
              >
                <SelectTrigger className="min-w-[160px] w-full sm:w-auto">
                  <SelectValue placeholder="All Sessions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__placeholder__">All Sessions</SelectItem>
                  {sessions.map((session) => (
                    <SelectItem key={session._id} value={session._id}>
                      {session.specialNameOfDay} (
                      {new Date(session.date).toLocaleDateString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Dropdown */}
              <Select
                value={ticketStatus || "__placeholder__"}
                onValueChange={(val) => {
                  const status = val === "__placeholder__" ? "" : val;
                  setTicketStatus(status);
                  fetchTickets(
                    selectedEvent,
                    selectedSession,
                    ticketType,
                    1,
                    status
                  );
                }}
              >
                <SelectTrigger
                  className={`min-w-[140px] w-full sm:w-auto ${
                    ticketStatus === "confirmed"
                      ? "bg-green-400"
                      : ticketStatus === "pending"
                      ? "bg-yellow-400"
                      : ticketStatus === "failed"
                      ? "bg-red-400"
                      : "bg-white"
                  }`}
                >
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__placeholder__">All Status</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              {/* Search Input */}
              <Input
                placeholder="Search by name or ticket ID..."
                value={searchValue}
                onChange={handleSearchChange}
                className="w-full sm:w-[220px]"
              />
            </div>

            {/* Buttons Section */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={ticketType === "vip" ? "default" : "outline"}
                onClick={handleVIPTickets}
                size="sm"
              >
                VIP
              </Button>
              <Button
                variant={
                  ticketType === "validForAllDays" ? "default" : "outline"
                }
                onClick={handleAllDayTickets}
                size="sm"
              >
                All Day
              </Button>
              <Button
                variant="destructive"
                onClick={handleClearFilter}
                className="flex items-center gap-1"
                size="sm"
              >
                <X className="w-4 h-4" /> Clear
              </Button>
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={loadingTickets}
                size="sm"
              >
                <RefreshCw className="w-5 h-5 mr-1" /> Refresh
              </Button>
              <CreateTicketDialog
                events={events}
                onSuccess={() => fetchTickets(selectedEvent, selectedSession)}
              />
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <Alert variant="destructive" className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>Error: {error || "Failed to fetch tickets."}</span>
          </Alert>
        )}

        {/* Tickets Table */}
        {loadingTickets ? (
          <div className="text-center py-10">Loading tickets...</div>
        ) : tickets.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <Table className="min-w-[700px]">
                <TableHeader>
                  <TableRow>
                    <TableCell>Ticket ID</TableCell>
                    <TableCell>Attendee</TableCell>
                    <TableCell>VIP</TableCell>
                    <TableCell>All Day</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell>Valid For</TableCell>
                    <TableCell>QR</TableCell>
                    <TableCell>PDF</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {console.log(tickets, "Tickets")}
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.ticketId}>
                      <TableCell>{ticket.ticketId}</TableCell>
                      <TableCell>{ticket.attendeeName}</TableCell>
                      <TableCell>{ticket.isVipTicket ? "Yes" : "No"}</TableCell>
                      <TableCell>
                        {ticket.validForAllDays ? "Yes" : "No"}
                      </TableCell>
                      <TableCell>{ticket.status}</TableCell>
                      <TableCell>
                        {ticket.createdAt
                          ? new Date(ticket.createdAt).toLocaleString("en-IN", {
                              timeZone: "Asia/Kolkata",
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {ticket?.validForAllDays || ticket?.isVipTicket
                          ? "All Days"
                          : ticket.sessionDetails
                          ? `${
                              ticket?.sessionDetails?.specialNameOfDay
                            } (${new Date(
                              ticket?.sessionDetails?.date.split("T")[0]
                            ).toLocaleDateString()})`
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {ticket.qrImage ? (
                          <img
                            src={ticket.qrImage}
                            alt="QR Code"
                            className="w-12 h-12 cursor-pointer"
                            onClick={() => {
                              setSelectedQR(ticket.qrImage);
                              setQrOpen(true);
                            }}
                          />
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>
                        {ticket.pdfPath ? (
                          <a
                            href={`${process.env.NEXT_PUBLIC_API_BASE_URL}${ticket.pdfPath}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                          >
                            View
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex flex-wrap justify-center items-center gap-2 mt-4 text-sm">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </Button>
              <span>
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
              >
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            {qrOpen && (
              <Dialog open={qrOpen} onOpenChange={setQrOpen}>
                <DialogContent className="flex items-center justify-center p-4">
                  <DialogHeader></DialogHeader>
                  {selectedQR && (
                    <img
                      src={selectedQR}
                      alt="QR Large"
                      className="max-w-full max-h-[80vh] rounded-lg"
                    />
                  )}
                </DialogContent>
              </Dialog>
            )}
          </>
        ) : (
          <div className="text-center text-muted-foreground">
            No tickets found.
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}
