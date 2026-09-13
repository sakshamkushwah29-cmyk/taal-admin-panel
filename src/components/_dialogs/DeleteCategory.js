"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { showToast } from "@/components/_ui/toast-utils";
import useAxios from "@/hooks/useAxios";

export default function DeleteCategory({ categoryId, onSuccess }) {
  const [open, setOpen] = useState(false);
  const { request: deleteCategory, loading } = useAxios();

  const handleDelete = async () => {
    const { data: resData, error } = await deleteCategory({
      method: "PUT",
      url: `/superadmin/delete-category`,
      payload: { categoryId },
      authRequired: true,
    });

    if (error) return showToast("error", error);
    showToast("success", resData?.message || "Category deleted successfully!");
    onSuccess?.(categoryId);
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="destructive"
        className="cursor-pointer flex items-center gap-2"
        onClick={() => setOpen(true)}
      >
        <Trash size={16} /> Delete
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full max-w-md rounded-2xl border bg-white dark:bg-gray-950 p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-red-600 flex items-center gap-2">
              <Trash size={20} /> Delete Category
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              loading={loading}
              loadingText="Deleting..."
              className="cursor-pointer"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
