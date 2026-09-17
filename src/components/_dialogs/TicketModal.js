"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { parse, format } from "date-fns";

export default function TicketModal({
  modalOpen,
  setModalOpen,
  responseData,
  setResponseData,
  startScanner,
}) {
  if (!responseData) return null; // jab tak data na ho modal mat dikhao
  const rawDate = responseData.data.eventDateTime;

  const datePart = rawDate.split("|")[0].trim();

  const parsedDate = new Date(datePart);

  let formattedDate = "Invalid Date";
  if (!isNaN(parsedDate)) {
    formattedDate = format(parsedDate, "dd MMM yyyy"); // 20 Sep 2025
  }
  console.log("Response Data:", responseData);
  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogContent className="sm:max-w-md w-[90%] rounded-2xl">
        <DialogHeader>
          <DialogTitle
            className={`text-lg sm:text-xl font-semibold ${
              responseData?.success ? "text-green-600" : "text-red-600"
            }`}
          >
            {responseData?.success ? `✅ Ticket Verified` : `❌ Ticket Invalid`}
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            {responseData?.message || "No response message"}
          </DialogDescription>
        </DialogHeader>

        {/* Ticket details */}
        {responseData?.data && (
          <div className="space-y-1 text-sm sm:text-base mt-3">
            {responseData.data.ticketId && (
              <p>
                <b>Ticket ID:</b> {responseData.data.ticketId}
              </p>
            )}
            {responseData.data.attendeeName && (
              <p>
                <b>Attendee:</b> {responseData.data.attendeeName}
              </p>
            )}
            {responseData.data.eventName && (
              <p>
                <b>Event:</b> {responseData.data.eventName}
              </p>
            )}
            {responseData.data.eventDateTime && (
              <p>
                <b>Event Date:</b> {formattedDate}
              </p>
            )}

            {responseData.data.scannedAt && (
              <p>
                <b>Scanned At:</b>{" "}
                {new Date(responseData.data.scannedAt).toLocaleString()}
              </p>
            )}
          </div>
        )}

        <DialogFooter className="flex justify-center sm:justify-end mt-4">
          <Button
            className="w-full sm:w-auto"
            onClick={() => {
              setModalOpen(false);
              setResponseData(null); // reset
              startScanner(); // scanner dobara start hoga
            }}
          >
            {responseData?.success ? "Scan Next Ticket" : "Try Again"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
