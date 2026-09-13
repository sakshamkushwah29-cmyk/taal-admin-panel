import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ResponseAlertModal({ open, onClose, type = "success", message }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === "success" ? (
              <CheckCircle2 className="text-green-600" size={24} />
            ) : (
              <AlertCircle className="text-red-600" size={24} />
            )}
            {type === "success" ? "Success" : "Error"}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-gray-700">{message}</p>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
