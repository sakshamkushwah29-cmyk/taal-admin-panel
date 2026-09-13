"use client";

import { useState, useCallback, useEffect } from "react";
import { debounce } from "lodash";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import useAxios from "@/hooks/useAxios";
import { Input } from "@/components/ui/input";
import AdminDashboardLayout from "../page";
import AppBreadcrumb from "@/components/_ui/app-breadcrumb";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import ResponseAlertModal from "@/components/_dialogs/ResponseAlterModal";

export default function DisputeManagementPage() {
  const [searchValue, setSearchValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ center spinner

  const { request: searchBooking } = useAxios();
  const { request: getPaymentStatus } = useAxios();
  const { request: updatePaymentStatus } = useAxios();

  const [responseModal, setResponseModal] = useState({
    open: false,
    type: "success",
    message: "",
  });

  const debounceSearch = useCallback(debounce((val) => setSearchQuery(val), 500), []);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    debounceSearch(e.target.value);
  };

  const fetchResults = async (query) => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await searchBooking({
        method: "GET",
        url: `/superadmin/search-booking?q=${query}`,
        authRequired: true,
      });

      if (!error && data?.data) {
        const arr = Array.isArray(data.data) ? data.data : [data.data];
        // smooth transition: fade out old results then fade in new
        setResults([]);
        setTimeout(() => {
          setResults(arr);
          setLoading(false);
        }, 200);
      } else {
        setResults([]);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setResults([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults(searchQuery);
  }, [searchQuery]);

  const handleViewDetails = async (booking) => {
    setSelectedBooking(booking);
    try {
      const { data, error } = await getPaymentStatus({
        method: "GET",
        url: `/superadmin/check-payment-status?bookingId=${booking._id}`,
        authRequired: true,
      });
      if (!error && data?.data) setPaymentDetails(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedBooking) return;
    try {
      setUpdating(true);
      const { data, error } = await updatePaymentStatus({
        method: "PUT",
        url: `/superadmin/update-payment-status`,
        authRequired: true,
        payload: { bookingId: selectedBooking._id },
      });

      setUpdating(false);

      if (error) {
        setResponseModal({ open: true, type: "error", message: data?.message || "Something went wrong" });
      } else {
        setResponseModal({ open: true, type: "success", message: "Payment status updated successfully" });
        setSelectedBooking(null);
        setPaymentDetails(null);
      }
    } catch (err) {
      setUpdating(false);
      setResponseModal({ open: true, type: "error", message: err.message });
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    setResults([]);
    setSearchValue("");
    setSearchQuery("");
    setSelectedBooking(null);
    setPaymentDetails(null);
    setTimeout(() => setLoading(false), 300); // smooth fade
  };

  return (
    <AdminDashboardLayout>
      <AppBreadcrumb />

      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
          <h2 className="text-xl font-bold">Dispute Management</h2>
          <Input placeholder="Search by user/booking..." value={searchValue} onChange={handleSearchChange} className="w-[300px]" />
          <Button variant="outline" onClick={handleRefresh}>Refresh</Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-[200px]">
            <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
          </div>
        ) : results.length > 0 ? (
          <Table className="transition-opacity duration-300 ease-in-out opacity-100">
            <TableHeader>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Booking Id</TableCell>
                <TableCell>Event Day</TableCell>
                <TableCell>Tickets</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Payment Status</TableCell>
                <TableCell>Ticket Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((booking) => (
                <TableRow key={booking._id} className="transition-opacity duration-300 ease-in-out">
                  <TableCell>{booking?.user?.name || "N/A"}</TableCell>
                  <TableCell>{booking?.user?.phone || "N/A"}</TableCell>
                  <TableCell>{booking?._id}</TableCell>
                  <TableCell>{booking?.eventSession?.specialNameOfDay || "N/A"}</TableCell>
                  <TableCell>{booking?.quantity}</TableCell>
                  <TableCell>{booking?.totalAmount} {booking?.currency}</TableCell>
                  <TableCell className={booking?.paymentStatus === "paid" ? "text-green-600" : "text-red-600"}>{booking?.paymentStatus}</TableCell>
                  <TableCell>{booking?.ticketStatus}</TableCell>
                  <TableCell><Button variant="outline" onClick={() => handleViewDetails(booking)}>View</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center text-muted-foreground transition-opacity duration-300 ease-in-out">
            No results found.
          </div>
        )}
      </div>

      <ResponseAlertModal
        open={responseModal.open}
        onClose={() => {
          setResponseModal({ open: false, type: "", message: "" });
          handleRefresh(); // modal close hote hi data reset
        }}
        type={responseModal.type}
        message={responseModal.message}
      />

      {/* Payment modal */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-3">
              <p><b>User:</b> {selectedBooking?.user?.name} ({selectedBooking?.user?.email})</p>
              <p><b>Phone:</b> {selectedBooking?.user?.phone}</p>
              <p><b>Booking ID:</b> {selectedBooking?._id}</p>
              <p><b>Event:</b> {selectedBooking?.eventSession?.specialNameOfDay} - {new Date(selectedBooking?.eventSession?.date).toLocaleDateString()}</p>
              <p><b>Tickets:</b> {selectedBooking?.quantity}</p>
              <p><b>Total Amount:</b> {selectedBooking?.totalAmount} {selectedBooking?.currency}</p>
              <p><b>Payment Method:</b> {selectedBooking?.paymentMethod}</p>
              <p><b>Payment Status:</b> {selectedBooking?.paymentStatus}</p>
              <p><b>Ticket Status:</b> {selectedBooking?.ticketStatus}</p>
              <p><b>Razorpay OrderId:</b> {selectedBooking?.razorpayOrderId}</p>
              {paymentDetails && <p><b>API Payment Status:</b> {paymentDetails?.status}</p>}

              <Button onClick={handleUpdateStatus} className="mt-4" disabled={updating}>
                {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Change Payment Status
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminDashboardLayout>
  );
}
