"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { showToast } from "@/components/_ui/toast-utils";
import useAxios from "@/hooks/useAxios";

export default function PharmacyStatus({ initialStatus = "unavailable" }) {
  const [isAvailable, setIsAvailable] = useState(initialStatus === "available");
  const [isLoading, setIsLoading] = useState(false);
  const { request } = useAxios();

  const toggleAvailability = async () => {
    const newStatus = isAvailable ? "unavailable" : "available";

    setIsLoading(true);
    const { data, error } = await request({
      method: "PUT",
       url: "/pharmacy/change-availability-status",

      authRequired: true,
      payload: { availabilityStatus: newStatus },
    });

    if (error) {
      showToast("error", error || "Failed to change status");
    } else {
      setIsAvailable(newStatus === "available");
      showToast("success", data.message || "Status updated successfully");
    }

    setIsLoading(false);
  };

  return (
    <div className="flex items-center gap-2">
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
      ) : (
        <span className="text-sm font-medium">
          {isAvailable ? "Available" : "Unavailable"}
        </span>
       )}
      <Switch
        checked={isAvailable}
        onCheckedChange={toggleAvailability}
        disabled={isLoading}
        className="w-10 h-6"
      />
    </div>
  );
}
