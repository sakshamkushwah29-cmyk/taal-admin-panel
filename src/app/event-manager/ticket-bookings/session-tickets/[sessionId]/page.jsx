"use client";

import { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { RefreshCw, AlertCircle } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import useAxios from "@/hooks/useAxios";
import AdminDashboardLayout from "../../../page";
import AppBreadcrumb from "@/components/_ui/app-breadcrumb";
import { useParams, useRouter } from "next/navigation";
import ViewTicket from "@/components/_dialogs/ViewTicket";

export default function SessionTicketsPage() {
  const router = useRouter();
  const { sessionId } = useParams();
  const { request } = useAxios();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [searchValue, setSearchValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
      const endpoint = searchQuery
        ? `/common-management/get-tickets-by-session-id?sessionId=${sessionId}&search=${searchQuery}&limit=${ITEMS_PER_PAGE}&page=${currentPage}`
        : `/common-management/get-tickets-by-session-id?sessionId=${sessionId}&limit=${ITEMS_PER_PAGE}&page=${currentPage}`;

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
  }, [sessionId, currentPage, searchQuery, refreshKey]);

  return (
    <AdminDashboardLayout>
      <AppBreadcrumb />
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
          <h2 className="text-xl font-bold">
            Bookings for Session {sessionId}
          </h2>

          <div className="flex flex-col md:flex-row gap-2 items-center">
            <Input
              placeholder="Search by attendee name or ticket ID..."
              value={searchValue}
              onChange={handleSearchChange}
              className="w-[250px]"
            />

            <Button
              variant="outline"
              onClick={handleRefresh}
              className="flex items-center gap-1"
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

        {loading ? (
          <div className="text-center text-gray-500">Loading tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="text-center text-muted-foreground">
            No Bookings found.
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>Ticket ID</TableCell>
                  <TableCell>Attendee</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Payment</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>QR</TableCell>
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
                    <TableCell>
                      {ticket.tickets[0]?.qrImage ? (
                        <img
                          src={ticket.tickets[0].qrImage}
                          alt="QR"
                          className="w-12 h-12"
                        />
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="flex justify-center">
                      <ViewTicket ticketId={ticket._id} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-4">
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
          </>
        )}
      </div>
    </AdminDashboardLayout>
  );
}
