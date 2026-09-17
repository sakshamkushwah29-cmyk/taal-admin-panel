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

export default function DeleteStock({ stock, onSuccess }) {
  const [open, setOpen] = useState(false);
  const { request: deleteStock, loading } = useAxios();

  const handleDelete = async () => {
    const stockId = stock._id;
    if (!stockId) return;

    const { data, error } = await deleteStock({
      method: "DELETE",
      url: "/pharmacy/delete-stock",
      authRequired: true,
      params: { stockId },
    });

    if (error) {
      showToast("error", error || "Failed to delete stock");
    } else {
      showToast("success", data.message || "Stock deleted successfully");
      onSuccess(stockId); // correct stock identifier
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

      <DialogContent className="w-full max-w-md rounded-lg shadow-lg bg-white dark:bg-gray-950">
        {/* ✅ Header */}
        <DialogHeader className="p-5 border-b border-gray-200 dark:border-gray-800">
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Confirm Stock Deletion
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
            Are you sure you want to delete this stock item? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {/* ✅ Stock Info */}
        <div className="px-6 py-4 rounded-lg bg-gray-100 dark:bg-gray-950">
          <p className="text-gray-800 dark:text-gray-200">
            <span className="font-semibold">Pharmacy:</span> {stock?.pharmacyId?.pharmacyName || "N/A"}
          </p>
          <p className="text-gray-800 dark:text-gray-200">
            <span className="font-semibold">Medicine:</span> 
            {Array.isArray(stock?.medicineId?.name)
              ? stock.medicineId.map((med) => med?.name).join(", ")
              : stock?.medicineId?.name || "N/A"}
          </p>
          <p className="text-gray-800 dark:text-gray-200">
            <span className="font-semibold">Quantity:</span> {stock?.quantity}
          </p>
          <p className="text-gray-800 dark:text-gray-200">
            <span className="font-semibold">Price:</span> ₹{stock?.price}
          </p>
        </div>

        {/* ✅ Actions */}
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
