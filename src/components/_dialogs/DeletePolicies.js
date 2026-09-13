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
import { AlertTriangle, Trash2 } from "lucide-react";
import { showToast } from "@/components/_ui/toast-utils";
import useAxios from "@/hooks/useAxios";

export default function DeletePolicies({ policy , onSuccess }) {
  const [open, setOpen] = useState(false);
  const { request: deletePolicy, loading } = useAxios();

  // ✅ Delete Handler
  const handleDelete = async () => {
    const policyId = policy._id;
    if (!policyId) return;

    const { data, error } = await deletePolicy({
      method: "DELETE",
      url: `/admin/delete-policy`,
      authRequired: true,
      params: { policyId }, 
    });

    if (error) {
      showToast("error", error || "Failed to delete policy");
    } else {
      showToast("success", data.message);
      onSuccess(policyId); 
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

      <DialogContent className="w-full max-w-md rounded-xl shadow-2xl bg-white dark:bg-gray-950 border border-red-100 animate-fade-in">
        {/* Header with warning icon */}
        <DialogHeader className="flex flex-col items-center justify-center p-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          <div className="flex items-center justify-center mb-2">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600">
              <AlertTriangle size={32} />
            </span>
          </div>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            Confirm Deletion
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600 dark:text-gray-400 text-center">
            Are you sure you want to delete this{" "}
            <span className="font-bold text-red-500 dark:bg-red-300 px-2 py-1 rounded-md border border-red-200 dark:border-red-800">
              {policy?.type?.charAt(0).toUpperCase() + policy?.type?.slice(1).toLowerCase()}
            </span>{" "}
            for{" "}
            <span className="font-bold text-blue-500 dark:bg-blue-300 px-2 py-1 rounded-md border border-blue-200 dark:border-blue-800">
              {policy?.userType?.charAt(0).toUpperCase() + policy?.userType?.slice(1).toLowerCase()}
            </span>{" "} ? 
            <br />
            <span className="text-sm text-red-500 font-medium mt-2 block">⚠️ This action cannot be undone.</span>
          </DialogDescription>
        </DialogHeader>

        {/* Actions with soft background */}
        <div className="px-6 py-5 flex flex-col sm:flex-row justify-end gap-3 bg-red-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 rounded-b-xl">
          <Button variant="ghost" onClick={() => setOpen(false)} className="border border-gray-300 dark:border-gray-700">
            Cancel
          </Button>
          <Button
            variant="destructive"
            loading={loading}
            loadingText="Deleting..."
            onClick={handleDelete}
            className="shadow-sm hover:bg-red-700 transition-colors"
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
