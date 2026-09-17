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

export default function DeleteManagers({ managers, onSuccess }) {
  const [open, setOpen] = useState(false);
  const { request: deleteManager, loading } = useAxios();

  console.log(managers, "Manager to be deleted");
  // ✅ Delete Handler
  const handleDelete = async () => {
    const managerId = managers._id;

    console.log(managerId, "Manager ID to be deleted");
    if (!managerId) return;

    const { data, error } = await deleteManager({
      method: "PUT",
      url: `/superadmin/delete-event-manager`,
      authRequired: true,
      payload: { managerId },
    });

    if (error) {
      showToast("error", error || "Failed to delete Manager");
    } else {
      showToast("success", data.message);
      onSuccess(managerId);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="icon" className="hover:bg-red-600 cursor-pointer">
          <Trash2 size={18} />
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-md rounded-lg shadow-lg bg-white dark:bg-gray-950">
        {/* ✅ Header */}
        <DialogHeader className="p-5 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Confirm Deletion
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
            Are you sure you want to delete this manager? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        {/* ✅ Pharmacy Info */}
        <div className="px-6 py-4 rounded-lg bg-gray-100 dark:bg-gray-950">
          <p className="text-gray-800 dark:text-gray-200">
            <span className="font-semibold">Name:</span> {managers?.name}
          </p>
          <p className="text-gray-800 dark:text-gray-200">
            <span className="font-semibold">Email:</span> {managers?.email}
          </p>
        </div>

        {/* ✅ Actions */}
        <div className="px-6 py-4 flex justify-end space-x-3 bg-white dark:bg-gray-950">
          <Button className="cursor-pointer" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="cursor-pointer"
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
