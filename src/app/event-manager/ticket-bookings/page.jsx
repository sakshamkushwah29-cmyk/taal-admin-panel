

"use client";

import { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RefreshCw, AlertCircle } from "lucide-react";
import { showToast } from "@/components/_ui/toast-utils";
import useAxios from "@/hooks/useAxios";
import { Alert } from "@/components/ui/alert";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import AdminDashboardLayout from "../page";
import SpecialOffersListSkeleton from "@/components/_skeletons/special-offers-list-skeleton";
import { format } from "date-fns";
// import AddEvent from "@/components/_dialogs/AddEvents";
import ViewEvent from "@/components/_dialogs/ViewEvent";
// import DeleteEvent from "@/components/_dialogs/DeleteEvent";
// import EditEvent from "@/components/_dialogs/EditEvent";
import AppBreadcrumb from "@/components/_ui/app-breadcrumb";
import { useRouter } from "next/navigation";
import { formatInTimeZone } from "date-fns-tz";


export default function Event() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  const router = useRouter();

  const {
    request: getAllEvents,
    loading: eventLoading,
    error: eventError,
  } = useAxios();

  const { request: updateBlockStatus } = useAxios();

  const debounceSearch = useCallback(
    debounce((val) => {
      setSearchQuery(val);
      setCurrentPage(1);
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchValue(val);
    debounceSearch(val);
  };

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  useEffect(() => {
    const fetchOffers = async () => {
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
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };

    fetchOffers();
  }, [searchQuery, currentPage, refreshKey]);

  const handleBlockStatusToggle = async (eventId, newStatus) => {
    setLoadingId(eventId);
    try {
      const isActive = newStatus === true || newStatus === "true";

      const { data, error } = await updateBlockStatus({
        method: "PUT",
        url: "/admin/update-special-offer-status",
        authRequired: true,
        payload: {
          specialOfferId: eventId,
          isActive,
        },
      });

      if (error) {
        showToast("error", "Failed to update event status");
        return;
      }

      setEvents((prev) =>
        prev.map((p) => (p._id === eventId ? { ...p, isActive } : p))
      );

      showToast(
        "success",
        `Event status updated to ${isActive ? "Active" : "Inactive"}`
      );
    } catch (error) {
      showToast("error", "Unexpected error while updating status");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <AdminDashboardLayout>
      <AppBreadcrumb />
      <div className="p-3 space-y-1">
        <div className="flex flex-col md:flex-row justify-between gap-4 items-center mb-5">
          <h2 className="text-xl font-bold">Event Management</h2>
          <div className="flex flex-col md:flex-row gap-2 items-center">
            <Input
              placeholder="Search by event title..."
              value={searchValue}
              onChange={handleSearchChange}
              className="w-[250px]"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={eventLoading}
              >
                <RefreshCw className="w-5 h-5 mr-1" /> Refresh
              </Button>

              {/* <AddEvent
                onSuccess={(addedEvent) => {
                  if (!addedEvent) return;
                  setEvents((prev) => [addedEvent, ...prev]);
                }}
              /> */}
            </div>
          </div>
        </div>

        {eventError && (
          <Alert variant="destructive">
            <AlertCircle className="w-5 h-5" />
            <span>Error: {eventError || "Failed to fetch events."}</span>
          </Alert>
        )}

        {eventLoading ? (
          <SpecialOffersListSkeleton />
        ) : events.length > 0 ? (
          <>
            {/* Card  Layout */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col"
                >
                  {/* Banner */}
                  <div className="h-40 w-full overflow-hidden">
                    <img
                      src={event?.banner || event.images?.[0]}
                      alt={event.title}
                   
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    {/* Title & Venue */}
                    <h3 className="text-lg font-bold">{event.title}</h3>
                    <p className="text-sm text-gray-600">
                      {event.venueName}, {event?.address?.city}
                    </p>

                    {/* Dates */}
                    <div className="text-sm text-gray-500">
                      {event?.startDate
                        ? 
                        formatInTimeZone(new Date(event.startDate), "UTC", "dd MMM yyyy")
                        : "N/A"}
                      {" - "}
                      {event?.endDate
                        ? format(new Date(event.endDate), "do MMM yyyy")
                        : "N/A"}
                    </div>

                    {/* Extra Details */}
                    <div className="text-xs text-gray-700 mt-2 space-y-1">
                      {event?.description && (
                        <p className="line-clamp-2">
                          <span className="font-semibold">About:</span>{" "}
                          {event.description}
                        </p>
                      )}
                      {event?.category && (
                        <p>
                          <span className="font-semibold">Category:</span>{" "}
                          {event.category}
                        </p>
                      )}
                      {event?.organizer && (
                        <p>
                          <span className="font-semibold">Organizer:</span>{" "}
                          {event.organizer}
                        </p>
                      )}
                      {event?.price && (
                        <p>
                          <span className="font-semibold">Price:</span> ₹
                          {event.price}
                        </p>
                      )}
                      <p>
                        <span className="font-semibold">Created:</span>{" "}
                        {event?.createdAt
                          ? format(new Date(event.createdAt), "do MMM yyyy")
                          : "N/A"}
                      </p>
                    </div>

                    {/* Status + Sessions */}
                    <div className="flex justify-between items-center mt-2">
                      {/* <Switch
                        checked={event.isActive === true}
                        onCheckedChange={(newStatus) =>
                          handleBlockStatusToggle(event._id, newStatus)
                        }
                        disabled={loadingId === event._id}
                      /> */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {event.sessions?.length || 0} Sessions
                        </span>
                        <button
                          className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                          onClick={() =>  router.push(`/event-manager/ticket-bookings/event-sessions/${event._id}`)}
                        >
                          View
                        </button>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-3">
                      <ViewEvent event={event} />
                      {/* <EditEvent
                        events={event}
                        onSuccess={(editedEvent) => {
                          if (!editedEvent) return;
                          setEvents((prev) =>
                            prev.map((p) =>
                              p._id === editedEvent._id ? editedEvent : p
                            )
                          );
                          handleRefresh();
                        }}
                      /> */}
                      {/* <DeleteEvent
                        events={event}
                        onSuccess={(eventId) => {
                          if (!eventId) return;
                          setEvents((prev) =>
                            prev.filter((p) => p._id !== eventId)
                          );
                        }}
                      /> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination
            {!searchQuery && (
              <div className="pt-4">
                <Pagination>
                  <PaginationContent className="justify-center">
                    <PaginationItem className="cursor-pointer">
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                    <PaginationItem className="cursor-pointer">
                      <span className="text-muted-foreground text-sm px-4">
                        Page {currentPage} of {totalPages}
                      </span>
                    </PaginationItem>
                    <PaginationItem className="cursor-pointer">
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((prev) =>
                            prev < totalPages ? prev + 1 : prev
                          )
                        }
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )} */}
          </>
        ) : (
          <div className="text-center text-muted-foreground">
            No Events found.
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}

