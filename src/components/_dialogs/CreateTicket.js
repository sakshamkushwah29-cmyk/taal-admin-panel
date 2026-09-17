// "use client";

// import { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Controller, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { showToast } from "@/components/_ui/toast-utils";
// import useAxios from "@/hooks/useAxios";
// import { FolderPlus, Calendar, Hash } from "lucide-react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// const ticketSchema = z.object({
//   eventId: z.string().min(1, "Event is required"),
//   sessionId: z.string().min(1, "Session is required"),
//   quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
//   isVipTicket: z.boolean().optional(),
//   isValidForAllDays: z.boolean().optional(),
//   vipName: z.string().min(1, "VIP Name is required").optional(),
// }).refine(
//   (data) => !data.isVipTicket || (data.isVipTicket && data.vipName),
//   {
//     message: "VIP Name is required",
//     path: ["vipName"],
//   }
// );

// export default function CreateTicket({ onSuccess }) {
//   const [open, setOpen] = useState(false);
//   const { request: apiRequest, loading } = useAxios();
//   const [events, setEvents] = useState([]);
//   const [sessions, setSessions] = useState([]);

//   const {
//     control,
//     handleSubmit,
//     watch,
//     reset,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(ticketSchema),
//     defaultValues: {
//       eventId: "",
//       sessionId: "",
//       quantity: 1,
//       isVipTicket: false,
//       isValidForAllDays: false,
//     },
//   });

//   const selectedEventId = watch("eventId");

//   // Fetch events
//   useEffect(() => {
//     const fetchEvents = async () => {
//       const { data, error } = await apiRequest({
//         method: "GET",
//         url: "/common-management/get-all-events",
//         authRequired: true,
//       });
//       if (!error && data?.data) {
//         setEvents(data.data);
//       }
//     };
//     fetchEvents();
//   }, []);

//   // Update sessions when event changes
//   useEffect(() => {
//     const eventObj = events.find((ev) => ev._id === selectedEventId);
//     setSessions(eventObj?.sessions || []);
//   }, [selectedEventId, events]);

//   const onSubmit = async (formData) => {
//     const { data, error } = await apiRequest({
//       method: "POST",
//       url: "/superadmin/genrate-ticket-admin",
//       payload: formData,
//       authRequired: true,
//     });

//     if (error) return showToast("error", error);

//     showToast("success", data?.message || "Ticket(s) generated successfully!");
//     onSuccess?.(data?.data);
//     setOpen(false);
//     reset();
//   };

//   return (
//     <>
//       <Button onClick={() => setOpen(true)} className="cursor-pointer">
//         Create Ticket
//       </Button>
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent
//           className="
//       w-full 
//       max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl
//       mx-auto rounded-2xl 
//       border border-gray-200 dark:border-gray-800 
//       bg-white dark:bg-gray-950 
//       p-4 sm:p-6 md:p-8 
//       max-h-[90vh] overflow-y-auto
//     "
//         >
//           <DialogHeader>
//             <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2">
//               <FolderPlus className="text-blue-600" size={22} /> Create Ticket
//             </DialogTitle>
//             <DialogDescription className="text-sm sm:text-base">
//               Generate new ticket(s) for an event
//             </DialogDescription>
//           </DialogHeader>

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//             {/* Event Info */}
//             <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
//               <div className="font-semibold text-base mb-3 flex items-center gap-2">
//                 <Calendar size={18} className="text-blue-500" /> Event & Session
//               </div>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 {/* Event Dropdown */}
//                 <div className="space-y-1">
//                   <Label>Event</Label>
//                   <Controller
//                     name="eventId"
//                     control={control}
//                     render={({ field }) => (
//                       <Select
//                         onValueChange={field.onChange}
//                         value={field.value}
//                       >
//                         <SelectTrigger className="w-full">
//                           <SelectValue placeholder="Select Event" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {events.map((event) => (
//                             <SelectItem key={event._id} value={event._id}>
//                               {event.title}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     )}
//                   />
//                   {errors.eventId?.message && (
//                     <p className="text-red-500 text-xs">
//                       {errors.eventId.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Session Dropdown */}
//                 <div className="space-y-1">
//                   <Label>Session</Label>
//                   <Controller
//                     name="sessionId"
//                     control={control}
//                     render={({ field }) => (
//                       <Select
//                         onValueChange={field.onChange}
//                         value={field.value}
//                       >
//                         <SelectTrigger className="w-full">
//                           <SelectValue placeholder="Select Session" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {sessions.map((session) => (
//                             <SelectItem key={session._id} value={session._id}>
//                               {session.specialNameOfDay} (
//                               {new Date(session.date).toLocaleDateString()})
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     )}
//                   />
//                   {errors.sessionId?.message && (
//                     <p className="text-red-500 text-xs">
//                       {errors.sessionId.message}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Ticket Info */}
//             <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
//               <div className="font-semibold text-base mb-3 flex items-center gap-2">
//                 <Hash size={18} className="text-green-500" /> Ticket Details
//               </div>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 {/* Quantity */}
//                 <div className="space-y-1">
//                   <Label>Quantity</Label>
//                   <Controller
//                     name="quantity"
//                     control={control}
//                     render={({ field }) => (
//                       <Input
//                         {...field}
//                         type="number"
//                         min={1}
//                         className="h-9 text-sm md:text-base"
//                       />
//                     )}
//                   />
//                   {errors.quantity?.message && (
//                     <p className="text-red-500 text-xs">
//                       {errors.quantity.message}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               {watch("isVipTicket") && (
//                 <div className="space-y-1 mt-4">
//                   <Label>VIP Name</Label>
//                   <Controller
//                     name="vipName"
//                     control={control}
//                     render={({ field }) => (
//                       <Input
//                         {...field}
//                         type="text"
//                         placeholder="Enter VIP Name"
//                         className="h-9 text-sm md:text-base"
//                       />
//                     )}
//                   />
//                   {errors.vipName?.message && (
//                     <p className="text-red-500 text-xs">
//                       {errors.vipName.message}
//                     </p>
//                   )}
//                 </div>
//               )}

//               {/* Checkboxes */}
//               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-6">
//                 <div className="flex items-center gap-2">
//                   <Controller
//                     name="isVipTicket"
//                     control={control}
//                     render={({ field }) => (
//                       <input
//                         type="checkbox"
//                         checked={field.value}
//                         onChange={(e) => field.onChange(e.target.checked)}
//                       />
//                     )}
//                   />
//                   <Label className="text-sm">VIP Ticket</Label>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <Controller
//                     name="isValidForAllDays"
//                     control={control}
//                     render={({ field }) => (
//                       <input
//                         type="checkbox"
//                         checked={field.value}
//                         onChange={(e) => field.onChange(e.target.checked)}
//                       />
//                     )}
//                   />
//                   <Label className="text-sm">Valid for All Days</Label>
//                 </div>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <div className="sticky bottom-0 left-0 right-0 z-20 p-4 bg-white dark:bg-gray-950 rounded-b-2xl shadow-t flex justify-end">
//               <Button
//                 type="submit"
//                 loading={loading}
//                 loadingText="Submitting..."
//                 className="w-full sm:w-auto cursor-pointer"
//               >
//                 Submit
//               </Button>
//             </div>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { showToast } from "@/components/_ui/toast-utils";
import useAxios from "@/hooks/useAxios";
import { FolderPlus, Calendar, Hash } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ticketSchema = z.object({
  eventId: z.string().min(1, "Event is required"),
  sessionId: z.string().min(1, "Session is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  isVipTicket: z.boolean().optional(),
  isValidForAllDays: z.boolean().optional(),
  ticketName: z.string().min(1, "Name is required"),
});

export default function CreateTicket({ onSuccess }) {
  const [open, setOpen] = useState(false);
  const { request: apiRequest, loading } = useAxios();
  const [events, setEvents] = useState([]);
  const [sessions, setSessions] = useState([]);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      eventId: "",
      sessionId: "",
      quantity: 1,
      isVipTicket: false,
      isValidForAllDays: false,
      ticketName: "",
    },
  });

  const selectedEventId = watch("eventId");

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await apiRequest({
        method: "GET",
        url: "/common-management/get-all-events",
        authRequired: true,
      });
      if (!error && data?.data) {
        setEvents(data.data);
      }
    };
    fetchEvents();
  }, []);

  // Update sessions when event changes
  useEffect(() => {
    const eventObj = events.find((ev) => ev._id === selectedEventId);
    setSessions(eventObj?.sessions || []);
  }, [selectedEventId, events]);

  const onSubmit = async (formData) => {
    const { data, error } = await apiRequest({
      method: "POST",
      url: "/superadmin/genrate-ticket-admin",
      payload: formData,
      authRequired: true,
    });

    if (error) return showToast("error", error);

    showToast("success", data?.message || "Ticket(s) generated successfully!");
    onSuccess?.(data?.data);
    setOpen(false);
    reset();
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="cursor-pointer">
        Create Ticket
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="
      w-full 
      max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl
      mx-auto rounded-2xl 
      border border-gray-200 dark:border-gray-800 
      bg-white dark:bg-gray-950 
      p-4 sm:p-6 md:p-8 
      max-h-[90vh] overflow-y-auto
    "
        >
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2">
              <FolderPlus className="text-blue-600" size={22} /> Create Ticket
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Generate new ticket(s) for an event
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Event Info */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
              <div className="font-semibold text-base mb-3 flex items-center gap-2">
                <Calendar size={18} className="text-blue-500" /> Event & Session
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Event Dropdown */}
                <div className="space-y-1">
                  <Label>Event</Label>
                  <Controller
                    name="eventId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Event" />
                        </SelectTrigger>
                        <SelectContent>
                          {events.map((event) => (
                            <SelectItem key={event._id} value={event._id}>
                              {event.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.eventId?.message && (
                    <p className="text-red-500 text-xs">
                      {errors.eventId.message}
                    </p>
                  )}
                </div>

                {/* Session Dropdown */}
                <div className="space-y-1">
                  <Label>Session</Label>
                  <Controller
                    name="sessionId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Session" />
                        </SelectTrigger>
                        <SelectContent>
                          {sessions.map((session) => (
                            <SelectItem key={session._id} value={session._id}>
                              {session.specialNameOfDay} (
                              {new Date(session.date).toLocaleDateString()})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.sessionId?.message && (
                    <p className="text-red-500 text-xs">
                      {errors.sessionId.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Ticket Info */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
              <div className="font-semibold text-base mb-3 flex items-center gap-2">
                <Hash size={18} className="text-green-500" /> Ticket Details
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Quantity */}
                <div className="space-y-1">
                  <Label>Quantity</Label>
                  <Controller
                    name="quantity"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="number"
                        min={1}
                        className="h-9 text-sm md:text-base"
                      />
                    )}
                  />
                  {errors.quantity?.message && (
                    <p className="text-red-500 text-xs">
                      {errors.quantity.message}
                    </p>
                  )}
                </div>

                {/* Ticket Name (always required) */}
                <div className="space-y-1">
                  <Label>Ticket Name</Label>
                  <Controller
                    name="ticketName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter Ticket Name"
                        className="h-9 text-sm md:text-base"
                      />
                    )}
                  />
                  {errors.ticketName?.message && (
                    <p className="text-red-500 text-xs">
                      {errors.ticketName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <Controller
                    name="isVipTicket"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    )}
                  />
                  <Label className="text-sm">VIP Ticket</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Controller
                    name="isValidForAllDays"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    )}
                  />
                  <Label className="text-sm">Valid for All Days</Label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="sticky bottom-0 left-0 right-0 z-20 p-4 bg-white dark:bg-gray-950 rounded-b-2xl shadow-t flex justify-end">
              <Button
                type="submit"
                loading={loading}
                loadingText="Submitting..."
                className="w-full sm:w-auto cursor-pointer"
              >
                Submit
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
