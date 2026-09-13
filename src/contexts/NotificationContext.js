"use client";
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import useAxios from "@/hooks/useAxios";
import { useAuthUser } from "@/contexts/AuthContext";

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const { request: fetchNotificationsApi } = useAxios();
  const { request: updateStatusApi } = useAxios();
  const { authUser } = useAuthUser();
  const role = authUser?.role;

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!role) return;
    setLoading(true);
    const { data, error } = await fetchNotificationsApi({
      method: "GET",
      url: "/admin/get-notification-by-recipientId",
      authRequired: true,
    });
    if (!error && data?.data) setNotifications(data.data || []);
    setLoading(false);
  }, [role]);

  // Mark notification as read
  const markAsRead = useCallback(async (id) => {
    const note = notifications.find((n) => n._id === id);
    if (!note || note.status === "read") return;
    const { error } = await updateStatusApi({
      method: "PUT",
      url: "/admin/update-notification-status",
      authRequired: true,
      payload: { notificationId: id },
    });
    if (!error) {
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, status: "read" } : n))
      );
    }
    return !error;
  }, [notifications, updateStatusApi]);

   const addNotification = (notification) => {
    setNotifications(prev => {
       if (prev.some(n => n._id === notification._id)) return prev;
      return [notification, ...prev];
    });
  };

  const getUnreadCount = () => {
    return notifications.filter(n => n.status === "unread").length;
  }

  // useEffect(() => {
  //   if (!role) return;
  //   fetchNotifications();

  //   const handleFocus = () => {
  //     fetchNotifications();
  //   };
  //   window.addEventListener("focus", handleFocus);

  //   return () => {
  //     window.removeEventListener("focus", handleFocus);
  //   };
  // }, [role, fetchNotifications]);

  // useEffect(()=>{
  //   if(!authUser){
  //     setNotifications([]);
  //   }
  // },[authUser]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        setNotifications,
        loading,
        fetchNotifications,
        markAsRead,
        addNotification, 
        getUnreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};