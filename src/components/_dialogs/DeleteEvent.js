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
import { Trash2 } from "lucide-react";
import { showToast } from "@/components/_ui/toast-utils";
import useAxios from "@/hooks/useAxios";
import { format } from "date-fns";

export default function DeleteEvent({ events, onSuccess }) {
  const [open, setOpen] = useState(false);
  const { request: deleteEventRequest, loading } = useAxios();

  const { _id, title, venueName, price, startDate, endDate } = events || {};

  const handleDelete = async () => {
    if (!_id) return;

    const { data, error } = await deleteEventRequest({
      method: "PUT",
      url: `/common-management/delete-event`, 
      payload: { eventId: _id },
      authRequired: true,
    });

    if (error) {
      showToast("error", error || "Failed to delete event");
    } else {
      showToast("success", data.message || "Event deleted successfully");
      onSuccess(_id);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="icon" className="hover:bg-red-600">
          <Trash2 size={18} />
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-sm rounded-lg shadow-lg bg-white dark:bg-gray-950">
        <DialogHeader className="p-5 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Confirm Deletion
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
            Are you sure you want to delete this event? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4 space-y-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p><span className="font-semibold">Title:</span> {title || "N/A"}</p>
          <p><span className="font-semibold">Venue:</span> {venueName || "N/A"}</p>
          <p><span className="font-semibold">Price:</span> ₹{price?.toFixed(2) || "N/A"}</p>
          <p><span className="font-semibold">Dates:</span>{" "}
            {startDate ? format(new Date(startDate), "do MMM yyyy") : "N/A"} -{" "}
            {endDate ? format(new Date(endDate), "do MMM yyyy") : "N/A"}
          </p>
        </div>

        <div className="px-6 py-4 flex justify-end space-x-3 bg-white dark:bg-gray-950">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={loading}
            onClick={handleDelete}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
