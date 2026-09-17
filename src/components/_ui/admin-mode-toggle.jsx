"use client";

import { cn } from "@/lib/utils";
import { useAdminMode } from "@/contexts/AdminModeContext";

export default function AdminModeToggle({ className }) {
  const ctx = useAdminMode();
  if (!ctx) return null;
  const { mode, changeMode } = ctx;

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-1 p-1 rounded-lg bg-muted",
        className
      )}
    >
      <button
        type="button"
        onClick={() => changeMode("ecommerce")}
        className={cn(
          "px-3 py-1.5 text-xs font-medium rounded-md transition cursor-pointer whitespace-nowrap",
          mode === "ecommerce"
            ? "bg-white shadow-sm text-primary"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Taal Ecommerce
      </button>
      <button
        type="button"
        onClick={() => changeMode("events")}
        className={cn(
          "px-3 py-1.5 text-xs font-medium rounded-md transition cursor-pointer whitespace-nowrap",
          mode === "events"
            ? "bg-white shadow-sm text-primary"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Events
      </button>
    </div>
  );
}
