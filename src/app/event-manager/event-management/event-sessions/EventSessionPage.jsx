"use client";

import { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { showToast } from "@/components/_ui/toast-utils";
import useAxios from "@/hooks/useAxios";
import { Alert } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import AdminDashboardLayout from "../../page";
import { format } from "date-fns";
import AddSession from "@/components/_dialogs/AddSession";
import ViewSession from "@/components/_dialogs/ViewSession";
import DeleteSession from "@/components/_dialogs/DeleteSession";
// import EditSession from "@/components/_dialogs/EditSession";
import AppBreadcrumb from "@/components/_ui/app-breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import EditSession from "@/components/_dialogs/EditSession";

import { Pencil } from "lucide-react";

export default function EventSessionsPage({ eventId: initialEventId = null }) {
  console.log(initialEventId, "EventId--------");

  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(initialEventId || "");
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [editingStatusId, setEditingStatusId] = useState(null);

  const {
    request: getAllEvents,
    loading: eventLoading,
    error: eventError,
  } = useAxios();

  const { request: updateStatus } = useAxios();

  const { request: updateBlockStatus } = useAxios();

  // debounce search
  const debounceSearch = useCallback(
    debounce((val) => {
      setSearchQuery(val);
      setCurrentPage(1);
    }, 500),
    []
  );

  const handleStatusChange = async (session, newStatus) => {
    try {
      const { data, error } = await updateStatus({
        method: "PUT",
        url: "/common-management/update-event-session-status",
        payload: { sessionId: session._id, status: newStatus },
        authRequired: true,
      });

      if (!error && data?.success) {
        showToast("success", "Status updated successfully");
        setSessions((prev) =>
          prev.map((ss) =>
            ss._id === session._id ? { ...ss, status: newStatus } : ss
          )
        );
        setEditingStatusId(null);
      } else {
        showToast("error", data?.message || "Failed to update status");
      }
    } catch (err) {
      showToast("error", err.message || "Unexpected error");
    }
  };

  const getStatusColor = (status) => {
    if (status === "cancelled") return "bg-red-500";
    return "bg-green-500";
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchValue(val);
    debounceSearch(val);
  };

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  // ✅ dropdown change handler
  const handleEventChange = (val) => {
    setSelectedEventId(val);
    // clean URL without re-render
    window.history.replaceState(
      null,
      "",
      "/admin/event-management/event-sessions"
    );
  };

  // fetch all events
  useEffect(() => {
    const fetchEvents = async () => {
      const ITEMS_PER_PAGE = 10;
      const endpoint = searchQuery
        ? `/admin/search-special-offer?query=${searchQuery}&limit=${ITEMS_PER_PAGE}`
        : `/common-management/get-all-events?page=${currentPage}&limit=${ITEMS_PER_PAGE}`;

      try {
        const { data, error } = await getAllEvents({
          method: "GET",
          url: endpoint,
          authRequired: true,
        });

        if (!error && data?.data) {
          setEvents(data?.data || []);
          setTotalPages(data.data.totalPages || 1);

          // Agar koi event selected nahi hai → default index[0] set karo
          if (!selectedEventId && data?.data?.length > 0) {
            setSelectedEventId(data.data[0]._id);
          }
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };

    fetchEvents();
  }, [searchQuery, currentPage, refreshKey]);

  // fetch sessions by event id
  const fetchEventBySession = async (eventId) => {
    if (!eventId) return;
    setLoadingSessions(true);

    try {
      const { data, error } = await getAllEvents({
        method: "GET",
        url: `/common-management/get-event?eventId=${eventId}`,
        authRequired: true,
      });

      if (!error && data?.data) {
        setSessions(data?.data[0]?.sessions || []);
      } else {
        setSessions([]);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoadingSessions(false);
    }
  };

  // whenever selectedEventId changes, fetch sessions
  useEffect(() => {
    if (selectedEventId) {
      fetchEventBySession(selectedEventId);
    }
  }, [selectedEventId]);

  const hoverGradients = [
    "hover:bg-gradient-to-r hover:from-pink-200 hover:via-pink-300 hover:to-rose-200 hover:text-gray-800",
    "hover:bg-gradient-to-r hover:from-green-200 hover:via-teal-200 hover:to-blue-200 hover:text-gray-800",
    "hover:bg-gradient-to-r hover:from-indigo-200 hover:via-purple-200 hover:to-pink-200 hover:text-gray-800",
    "hover:bg-gradient-to-r hover:from-yellow-200 hover:via-orange-200 hover:to-amber-200 hover:text-gray-800",
    "hover:bg-gradient-to-r hover:from-teal-200 hover:via-cyan-200 hover:to-sky-200 hover:text-gray-800",
    "hover:bg-gradient-to-r hover:from-purple-200 hover:via-fuchsia-200 hover:to-rose-200 hover:text-gray-800",
    "hover:bg-gradient-to-r hover:from-blue-200 hover:via-sky-200 hover:to-indigo-200 hover:text-gray-800",
    "hover:bg-gradient-to-r hover:from-orange-200 hover:via-amber-200 hover:to-yellow-200 hover:text-gray-800",
    "hover:bg-gradient-to-r hover:from-emerald-200 hover:via-green-200 hover:to-lime-200 hover:text-gray-800",
  ];

  return (
    <AdminDashboardLayout>
      <AppBreadcrumb />
      <div className="p-3 space-y-6">
        {/* header with search + refresh + dropdown */}
        <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
          <h2 className="text-xl font-bold">Event Session Management</h2>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <Input
              placeholder="Search by event title..."
              value={searchValue}
              onChange={handleSearchChange}
              className="w-full sm:w-[250px]"
            />
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={eventLoading}
                className="w-full sm:w-auto"
              >
                <RefreshCw className="w-5 h-5 mr-1" /> Refresh
              </Button>

              <Select value={selectedEventId} onValueChange={handleEventChange}>
                <SelectTrigger className="w-full sm:w-[200px] rounded-full">
                  <SelectValue placeholder="Select Event" />
                </SelectTrigger>
                <SelectContent>
                  {events.map((ev) => (
                    <SelectItem key={ev._id} value={ev._id}>
                      {ev.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <AddSession
                onSuccess={() => {
                  fetchEventBySession(selectedEventId);
                }}
              />
            </div>
          </div>
        </div>

        {eventError && (
          <Alert variant="destructive">
            <AlertCircle className="w-5 h-5" />
            <span>Error: {eventError || "Failed to fetch events."}</span>
          </Alert>
        )}

        <div>
          <h3 className="text-lg font-semibold mb-3">Sessions</h3>
          {loadingSessions ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="animate-spin h-6 w-6 text-blue-500" />
            </div>
          ) : sessions.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {sessions.map((s, index) => (
                <Card
                  key={s._id}
                  className={`relative rounded-2xl border shadow-sm hover:shadow-md transition flex flex-col justify-between ${
                    hoverGradients[index % hoverGradients.length]
                  }`}
                >
                  {/* Top-right badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    {editingStatusId === s._id ? (
                      <Select
                        value={s.status}
                        onValueChange={(val) => handleStatusChange(s, val)}
                      >
                        <SelectTrigger className="w-[130px] bg-white h-7 text-xs rounded-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className="bg-white shadow-md rounded-md z-50">
                          <SelectItem
                            value="scheduled"
                            className="hover:bg-gray-100"
                          >
                            Scheduled
                          </SelectItem>
                          <SelectItem
                            value="cancelled"
                            className="hover:bg-gray-100"
                          >
                            Cancelled
                          </SelectItem>
                          <SelectItem
                            value="completed"
                            className="hover:bg-gray-100"
                          >
                            Completed
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold text-white ${getStatusColor(
                            s.status
                          )}`}
                        >
                          {s.status}
                        </span>
                        <Pencil
                          className="w-4 h-4 cursor-pointer text-gray-600 hover:text-gray-800"
                          onClick={() => setEditingStatusId(s._id)}
                        />
                      </>
                    )}
                  </div>

                  <CardContent className="p-4 space-y-2 flex-1">
                    <h4 className="text-lg font-semibold">
                      {s.specialNameOfDay}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {format(new Date(s.date), "do MMM yyyy")}
                    </p>
                    <p className="text-sm">
                      {s.startTime} - {s.endTime}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Price:</span> ₹
                      {s.pricePerTicket} {s.currency}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Capacity:</span>{" "}
                      {s.remainingCapacity}/{s.totalCapacity}
                    </p>
                    <p className="text-xs capitalize">
                      <span className="font-medium">Status:</span> {s.status}
                    </p>
                  </CardContent>

                  <div className="flex flex-wrap gap-2 p-3 border-t">
                    <ViewSession session={s} />

                    <EditSession
                      session={s}
                      onSuccess={(updatedSession) => {
                        // ✅ Update session in current list
                        setSessions((prev) =>
                          prev.map((ss) =>
                            ss._id === updatedSession._id ? updatedSession : ss
                          )
                        );
                      }}
                    />
                    <DeleteSession
                      session={s}
                      onSuccess={(deletedId) => {
                        if (!deletedId) return;
                        setSessions((prev) =>
                          prev.filter((ss) => ss._id !== deletedId)
                        );
                      }}
                    />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              No Sessions found for this event.
            </div>
          )}
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
