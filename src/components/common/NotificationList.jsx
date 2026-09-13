"use client";


import React, { useEffect, useState, useRef } from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import { useAuthUser } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { BellIcon, CheckCircle2, CircleAlert, Inbox, Loader2, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

export default function NotificationList() {
  const router = useRouter();
  const { notifications, loading, markAsRead } = useNotifications();
  // const { authUser } = useAuthUser();
  // const role = authUser?.role;
  const [visibleCount, setVisibleCount] = useState(5);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);

   const listRef = useRef();

   useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [notifications.length]); 

  
  const handleNotificationClick= async(note) =>{
      if(note.status === "unread"){
        await markAsRead(note._id);
      }
      if(note.NotificationPath){
        router.push(note.NotificationPath);
      }
  }

  const formatDate = (dateString) => format(new Date(dateString), "MMM dd, yyyy 'at' hh:mm a");
  const renderStatusBadge = (status) => {
    const color = status === "unread" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700";
    const Icon = status === "unread" ? CircleAlert : CheckCircle2;
    return (
      <Badge className={`rounded-full ${color} px-2 py-1 text-xs`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const renderCard = (note, index, array) => (
    <div key={note._id}>
      <div
        className={`px-5 py-4 transition-colors cursor-pointer ${note.status === "unread" ? "bg-gray-100 hover:bg-gray-200 cursor-pointer" : ""}`}
        onClick={() => handleNotificationClick(note)}
      >
        <div className="flex gap-4 relative">
          <div className="flex-1 space-y-1">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base text-foreground">{note.title}</h3>
                {note.status === "unread" && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
              </div>
              <p className="text-xs text-muted-foreground italic">{formatDate(note.sentAt)}</p>
            </div>
            <div>{renderStatusBadge(note.status)}</div>
            <p className="text-muted-foreground text-sm">{note.message}</p>
          </div>
        </div>
      </div>
      {index !== array.length - 1 && <Separator className="my-3" />}
    </div>
  );

  const allSortedNotifications = [...notifications].sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));
  const visibleNotifications = allSortedNotifications.slice(0, visibleCount);

  return (
    <div>
      <div className="flex gap-2 items-center mb-4">
        <BellIcon className="w-7 h-7 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
      </div>
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center text-muted-foreground py-20">
          <Inbox className="w-10 h-10 mx-auto mb-3" />
          No notifications yet.
        </div>
      ) : (
        <Card className="shadow-md border rounded-lg">
          <CardContent className="space-y-6 p-6">
            {/* Notification list with auto-scroll-to-top */}
            <div
              ref={listRef}
              style={{ maxHeight: 400, overflowY: "auto" }}
              className="space-y-4"
            >
              {visibleNotifications.map((note, idx, arr) => renderCard(note, idx, arr))}
            </div>
            <div className="text-center pt-2 flex items-center justify-center gap-2">
              {notifications.length > visibleCount && (
                <>
                  <Button
                    variant="ghost"
                    disabled={loadMoreLoading}
                    onClick={async () => {
                      setLoadMoreLoading(true);
                      await new Promise((res) => setTimeout(res, 500));
                      setVisibleCount((prev) => prev + 5);
                      setLoadMoreLoading(false);
                    }}
                  >
                    {loadMoreLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Load More"
                    )}
                  </Button>
                  {visibleCount > 5 && (
                    <Button
                      variant="ghost"
                      className="p-2"
                      aria-label="Scroll to top"
                      onClick={() => {
                        if (listRef.current) {
                          listRef.current.scrollTo({ top: 0, behavior: "smooth" });
                        }
                      }}
                    >
                      <ArrowUp className="w-5 h-5" />
                    </Button>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}