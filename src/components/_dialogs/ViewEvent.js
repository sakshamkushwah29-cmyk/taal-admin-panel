"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Eye,
  MapPin,
  CalendarDays,
  Image as ImageIcon,
  Users,
  BadgeIndianRupee,
} from "lucide-react";
import { format } from "date-fns";

const InfoField = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
      {label}
    </p>
    <p className="text-sm text-gray-900 dark:text-gray-100">{value || "N/A"}</p>
  </div>
);

export default function ViewEvent({ event }) {
  const [open, setOpen] = useState(false);

  if (!event) return null;

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
             {event.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
            {event.description}
          </DialogDescription>
        </DialogHeader>

        {/* Body */}
        <div className="p-6 space-y-8 overflow-y-auto bg-gray-50 dark:bg-gray-900 flex-1">
          {/* Banner */}
          {event.banner && (
            <div className="rounded-lg overflow-hidden">
              <img
                src={event.banner}
                alt={event.title}
                crossOrigin="anonymous"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Section 1: Event Info */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide">
              <CalendarDays className="text-purple-600 dark:text-purple-400" size={18} />
              Event Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InfoField
                label="Start Date"
                value={event.startDate ? format(new Date(event.startDate), "do MMM yyyy, h:mm a") : ""}
              />
              <InfoField
                label="End Date"
                value={event.endDate ? format(new Date(event.endDate), "do MMM yyyy, h:mm a") : ""}
              />
              <InfoField label="Venue" value={event.venueName} />
              <InfoField label="City" value={event.address?.city} />
              <InfoField label="State" value={event.address?.state} />
              <InfoField label="Pincode" value={event.address?.pincode} />
            </div>
          </section>

          <hr className="border-t border-gray-200 dark:border-gray-700" />

          {/* Section 2: Address */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide">
              <MapPin className="text-red-600 dark:text-red-400" size={18} />
              Address
            </h3>
            <div className="space-y-2">
              <p className="text-sm">{event.address?.address}</p>
              {event.address?.landmark && (
                <p className="text-xs text-gray-500">Landmark: {event.address.landmark}</p>
              )}
              {event.address?.maplink && (
                <a
                  href={event.address.maplink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm underline"
                >
                  View on Map
                </a>
              )}
            </div>
          </section>

          <hr className="border-t border-gray-200 dark:border-gray-700" />

          {/* Section 3: Sessions */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide">
              <Users className="text-green-600 dark:text-green-400" size={18} />
              Sessions
            </h3>
            <div className="space-y-3">
              {event.sessions && event.sessions.length > 0 ? (
                event.sessions.map((s) => (
                  <div
                    key={s._id}
                    className="p-3 rounded-lg border bg-white dark:bg-gray-800 shadow-sm"
                  >
                    <p className="font-medium">{s.specialNameOfDay}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(s.date), "do MMM yyyy")} | {s.startTime} - {s.endTime}
                    </p>
                    <p className="text-sm">
                      <BadgeIndianRupee className="inline w-4 h-4 mr-1" />
                      {s.pricePerTicket} {s.currency}
                    </p>
                    <p className="text-xs text-gray-600">
                      Capacity: {s.remainingCapacity}/{s.totalCapacity}
                    </p>
                    <p
                      className={`text-xs font-semibold mt-1 ${
                        s.status === "scheduled"
                          ? "text-green-600"
                          : s.status === "completed"
                          ? "text-blue-600"
                          : "text-red-600"
                      }`}
                    >
                      {s.status}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No sessions available.</p>
              )}
            </div>
          </section>
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
