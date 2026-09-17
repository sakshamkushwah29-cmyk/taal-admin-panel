import React from "react";
import { useNotifications } from "@/contexts/NotificationContext";

export default function NotificationBadge() {
  const { notifications, loading } = useNotifications();

  const unreadCount = notifications.filter(n => n.status === "unread").length;

  if (loading) return null; 

  return (
    unreadCount > 0 && (
      <span
        style={{
          background: "red",
          color: "white",
          borderRadius: "50%",
          padding: "2px 8px",
          fontSize: "12px",
          marginLeft: "4px"
        }}
      >
        {unreadCount}
      </span>
    )
  );
}