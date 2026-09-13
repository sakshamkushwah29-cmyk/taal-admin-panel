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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

const InfoField = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
      {label}
    </p>
    <div className="text-sm text-gray-900 dark:text-gray-100">
      {value || "N/A"}
    </div>
  </div>
);

export default function ViewUsers({ customer }) {
  const [open, setOpen] = useState(false);

  const {
    fullName,
    phoneNumber,
    email,
    isVerified,
    isBlocked,
    subscriptionPlan,
    createdAt,
    updatedAt,
  } = customer;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer transition-all"
        >
          <Eye size={18} />
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-sm max-h-[90vh] rounded-lg shadow-lg bg-white dark:bg-gray-950 flex flex-col">
        <DialogHeader className="p-5 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            User Details
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
            Here are the details of the selected User.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-gray-100 dark:bg-gray-950 rounded-lg p-6 space-y-4 overflow-y-auto flex-1">
          <InfoField label="Full Name" value={fullName} />
          <InfoField label="Phone" value={phoneNumber} />
          <InfoField label="Email" value={email} />

          <InfoField
            label="Verification Status"
            value={
              <Badge
                className={
                  isVerified === true
                    ? "bg-green-200 text-green-800"
                    : isVerified === false
                    ? "bg-red-200 text-red-800"
                    : "bg-blue-200 text-blue-800"
                }
              >
                {isVerified === true
                  ? "Verified"
                  : isVerified === false
                  ? "Not Verified"
                  : "N/A"}
              </Badge>
            }
          />

          <InfoField
            label="Blocked status"
            value={
              <Badge
                className={
                  isBlocked === true
                    ? "bg-red-200 text-red-800"
                    : isBlocked === false
                    ? "bg-green-200 text-green-800"
                    : "bg-gray-200 text-gray-800"
                }
              >
                {isBlocked === true
                  ? "Blocked"
                  : isBlocked === false
                  ? "Active"
                  : "N/A"}
              </Badge>
            }
          />

          <InfoField label="Subscription Plan" value={subscriptionPlan} />
        </div>

        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          <Button
            className="w-full cursor-pointer"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
