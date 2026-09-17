"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { showToast } from "@/components/_ui/toast-utils";
import useAxios from "@/hooks/useAxios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const sessionSchema = z.object({
  event: z.string().min(1, "Event ID is required"),
  specialNameOfDay: z.string().min(2, "Special day name required"),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time required"),
  endTime: z.string().min(1, "End time required"),
  pricePerTicket: z.coerce.number().min(1, "Ticket price required"),
  currency: z.string().min(1, "Currency required"),
  totalCapacity: z.coerce.number().min(1, "Total capacity required"),
  remainingCapacity: z.coerce.number().min(0, "Remaining capacity required"),
});

export default function AddSession({ onSuccess }) {
  const [open, setOpen] = useState(false);
  const { request: addSession, loading } = useAxios();
  const [maxSessions, setMaxSessions] = useState(null);
  const [events, setEvents] = useState([]);
  const [sessions, setSessions] = useState([]); // ✅ cards ke liye
  const [editIndex, setEditIndex] = useState(null); // ✅ agar edit karna ho

  const [selectedEventId, setSelectedEventId] = useState(null);
  const [dateRange, setDateRange] = useState({ min: "", max: "" });

  const { control, handleSubmit, reset, setValue, getValues } = useForm({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      event: "",
      specialNameOfDay: "",
      date: "",
      startTime: "",
      endTime: "",
      pricePerTicket: "",
      currency: "INR",
      totalCapacity: "",
      remainingCapacity: "",
    },
  });

  const {
    request: getAllEvents,
    loading: eventLoading,
    error: eventError,
  } = useAxios();

  useEffect(() => {
    const fetchEvents = async () => {
      const ITEMS_PER_PAGE = 10;
      const endpoint = `/common-management/get-all-events`;

      try {
        const { data, error } = await getAllEvents({
          method: "GET",
          url: endpoint,
          authRequired: true,
        });

        if (!error && data?.data) {
          setEvents(data?.data || []);

          // default select first event
          if (!selectedEventId && data?.data?.length > 0) {
            setSelectedEventId(data.data[0]._id);
          }
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };

    fetchEvents();
  }, []);

  // 🔥 Add or Update Session
  const handleAddSession = () => {
    const formData = getValues();

    if (editIndex !== null) {
      // update
      const updated = [...sessions];
      updated[editIndex] = formData;
      setSessions(updated);
      setEditIndex(null);
    } else {
      // add new
      setSessions([...sessions, formData]);
    }

    // reset form for new entry
    reset({
      event: "",
      specialNameOfDay: "",
      date: "",
      startTime: "",
      endTime: "",
      pricePerTicket: 0,
      currency: "INR",
      totalCapacity: 0,
      remainingCapacity: 0,
    });
  };

  // 🔥 Remove Session
  const handleRemove = (index) => {
    setSessions(sessions.filter((_, i) => i !== index));
  };

  // 🔥 Edit Session (load back to form)
  const handleEdit = (index) => {
    const item = sessions[index];
    Object.keys(item).forEach((key) => {
      setValue(key, item[key]);
    });
    setEditIndex(index);
  };

  // 🔥 Final Submit to API
  // const onSubmit = async () => {
  //   const { data: resData, error } = await addSession({
  //     method: "POST",
  //     url: "/common-management/create-event-session",
  //     payload: sessions,
  //     authRequired: true,
  //   });

  //   if (error) return showToast("error", error);
  //   console.log(resData, "resData-----------");
  //   showToast("success", resData?.message || "Sessions added successfully!");
  //   onSuccess(resData?.data[0].event);
  //   setSessions([]);
  //   reset();
  //   setOpen(false);
  // };


  const onSubmit = async () => {
    // Current form ka data bhi include karo
    const formData = getValues();
    const allSessions = [...sessions];
  
    // agar edit me nahi hai aur form me kuch bhara hai to push karo
    const hasData =
      formData.specialNameOfDay ||
      formData.date ||
      formData.startTime ||
      formData.endTime ||
      formData.pricePerTicket;
  
    if (hasData) {
      allSessions.push(formData);
    }
  
    if (allSessions.length === 0) {
      return showToast("error", "Please add at least one session!");
    }
  
    const { data: resData, error } = await addSession({
      method: "POST",
      url: "/common-management/create-event-session",
      payload: allSessions,
      authRequired: true,
    });
  
    if (error) return showToast("error", error);
  
    showToast("success", resData?.message || "Sessions added successfully!");
    onSuccess(resData?.data[0].event);
    setSessions([]);
    reset();
    setOpen(false);
  };
  

  return (
    <>
      <Button onClick={() => setOpen(true)}>Add Sessions</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Event Sessions</DialogTitle>
          </DialogHeader>

          {/* Form Fields */}
          <form
            onSubmit={handleSubmit(handleAddSession)}
            className="space-y-4 border p-4 rounded"
          >
            <Controller
              name="event"
              control={control}
              render={({ field }) => (
                <div>
                  <Label>Event ID</Label>
                  <Select
                    value={field.value} // ✅ direct form ke andar value
                    onValueChange={(val) => {
                      field.onChange(val); // ✅ form ke value update
                      setSelectedEventId(val);
                      const selected = events.find((ev) => ev._id === val);
                      if (selected) {
                        const start = new Date(selected.startDate);
                        const end = new Date(selected.endDate);

                        const diffDays =
                          Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1; // ✅ inclusive days
                        setDateRange({
                          min: new Date(selected.startDate)
                            .toISOString()
                            .split("T")[0],
                          max: new Date(selected.endDate)
                            .toISOString()
                            .split("T")[0],
                        });
                        setMaxSessions(diffDays);
                      }
                    }}
                  >
                    <SelectTrigger className="w-[200px] rounded">
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
                </div>
              )}
            />

            <Controller
              name="specialNameOfDay"
              control={control}
              render={({ field }) => (
                <div>
                  <Label>Special Day</Label>
                  <Input {...field} placeholder="e.g. Shailaputri" />
                </div>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <div>
                    <Label>Date</Label>
                    <Input
                      {...field}
                      type="date"
                      min={dateRange.min}
                      max={dateRange.max}
                    />
                  </div>
                )}
              />
              <Controller
                name="startTime"
                control={control}
                render={({ field }) => (
                  <div>
                    <Label>Start Time</Label>
                    <Input {...field} type="time" />
                  </div>
                )}
              />
              <Controller
                name="endTime"
                control={control}
                render={({ field }) => (
                  <div>
                    <Label>End Time</Label>
                    <Input {...field} type="time" />
                  </div>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="pricePerTicket"
                control={control}
                render={({ field }) => (
                  <div>
                    <Label>Ticket Price</Label>
                    <Input
                      {...field}
                      type="number"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </div>
                )}
              />
              <Controller
                name="currency"
                control={control}
                render={({ field }) => (
                  <div>
                    <Label>Currency</Label>
                    <Input {...field} placeholder="INR" />
                  </div>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="totalCapacity"
                control={control}
                render={({ field }) => (
                  <div>
                    <Label>Total Capacity</Label>
                    <Input
                      {...field}
                      type="number"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </div>
                )}
              />
              <Controller
                name="remainingCapacity"
                control={control}
                render={({ field }) => (
                  <div>
                    <Label>Remaining Capacity</Label>
                    <Input
                      {...field}
                      type="number"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </div>
                )}
              />
            </div>

            {sessions.length < maxSessions && (
              <Button type="submit" className="w-full">
                {editIndex !== null ? "Update Session" : "Add Another Day"}
              </Button>
            )}
          </form>

          {/* Cards */}
          <div className="mt-6 space-y-3">
            {sessions.map((s, i) => (
              <div
                key={i}
                className="border p-3 rounded flex justify-between items-center cursor-pointer"
                onClick={() => handleEdit(i)}
              >
                <div>
                  <p className="font-semibold">
                    {s.specialNameOfDay} ({s.date})
                  </p>
                  <p className="text-sm text-gray-500">
                    {s.startTime} - {s.endTime} | {s.pricePerTicket}{" "}
                    {s.currency}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(i);
                  }}
                >
                  <Trash size={16} />
                </Button>
              </div>
            ))}
          </div>

          {/* Final Submit */}

          <Button
            type="button"
            onClick={onSubmit}
            loading={loading}
            className="w-full mt-4"
          >
            Submit All Sessions
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
