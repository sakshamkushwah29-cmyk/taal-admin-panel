"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Users, BadgeIndianRupee, CreditCard, QrCode } from "lucide-react";
import useAxios from "@/hooks/useAxios";
import { format } from "date-fns";

const InfoField = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
      {label}
    </p>
    <p className="text-sm text-gray-900 dark:text-gray-100">{value || "N/A"}</p>
  </div>
);

export default function ViewTicket({ ticketId }) {
  const [open, setOpen] = useState(false);
  const { request } = useAxios();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTicket = async () => {
    if (!ticketId) return;
    setLoading(true);
    try {
      const { data, error } = await request({
        url: `/common-management/get-ticket-by-id?ticketId=${ticketId}`,
        method: "GET",
        authRequired: true,
      });

      if (error) {
        setError(error.message || "Failed to fetch ticket");
      } else {
        setTicket(data.data[0]);
      }
    } catch (err) {
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchTicket();
  }, [open]);

  if (!ticketId) return null;

  console.log(ticket, "Ticket");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="hover:bg-gray-200 dark:hover:bg-gray-800 transition-all"
        >
          <Eye size={18} />
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-lg lg:max-h-[85vh] max-h-[75vh] rounded-2xl shadow-xl bg-white dark:bg-gray-950 flex flex-col overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Ticket Details
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
            Detailed information about the ticket and attendee
          </DialogDescription>
        </DialogHeader>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto bg-gray-50 dark:bg-gray-900 flex-1">
          {loading ? (
            <div className="text-center py-10">Loading...</div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : ticket ? (
            <>
              {/* Section 1: Attendee Info */}
              <section>
                <h3 className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide">
                  <Users
                    className="text-green-600 dark:text-green-400"
                    size={18}
                  />
                  Attendee Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InfoField
                    label="Name"
                    value={ticket.attendeeDetails[0]?.name}
                  />
                  <InfoField
                    label="Phone"
                    value={ticket.attendeeDetails[0]?.phone}
                  />
                  <InfoField label="Email" value={ticket.user?.email} />
                </div>
              </section>

              <hr className="border-t border-gray-200 dark:border-gray-700" />

              {/* Section 2: Ticket Info */}
              <section>
                <h3 className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide">
                  <QrCode
                    className="text-purple-600 dark:text-purple-400"
                    size={18}
                  />
                  Ticket Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InfoField
                    label="Ticket ID"
                    value={ticket.tickets[0]?.ticketId}
                  />
                  <InfoField
                    label="Payment Status"
                    value={ticket.paymentStatus}
                  />
                  <InfoField
                    label="Ticket Status"
                    value={ticket.ticketStatus}
                  />
                  <InfoField
                    label="Total Amount"
                    value={`₹${ticket.totalAmount}`}
                  />
                  <InfoField
                    label="Payment Method"
                    value={ticket.paymentMethod}
                  />
                </div>
              </section>

              <hr className="border-t border-gray-200 dark:border-gray-700" />

              {/* Section 3: QR Code */}
              {ticket.tickets[0]?.qrImage && (
                <section>
                  <h3 className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide">
                    <QrCode
                      className="text-blue-600 dark:text-blue-400"
                      size={18}
                    />
                    QR Code
                  </h3>
                  <div className="flex flex-wrap justify-center gap-2 max-w-full overflow-x-auto">
                    {ticket.tickets?.map((t, idx) => (
                      <img
                        key={idx}
                        src={t.qrImage}
                        alt={`QR ${idx + 1}`}
                        className="w-48 h-48 rounded-lg"
                      />
                    ))}
                  </div>
                </section>
              )}
            </>
          ) : (
            <div className="text-center text-gray-500">No data available.</div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          <Button className="w-full" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
