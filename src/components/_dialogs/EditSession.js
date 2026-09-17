"use client";

import { useState, useEffect } from "react";
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
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar, FileText, Pencil } from "lucide-react";
import { showToast } from "@/components/_ui/toast-utils";
import useAxios from "@/hooks/useAxios";

// ✅ Zod schema for optional fields
const sessionSchema = z.object({
  specialNameOfDay: z.string().optional(),
  date: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  pricePerTicket: z.coerce.number().optional(),
  currency: z.string().optional(),
  totalCapacity: z.coerce.number().optional(),
  remainingCapacity: z.coerce.number().optional(),
  status: z.string().optional(),
});

export default function EditSession({ session, onSuccess }) {
  const [open, setOpen] = useState(false);
  const { request: updateSession, loading } = useAxios();

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(sessionSchema),
    defaultValues: session,
  });

  // Preload session data when modal opens
  useEffect(() => {
    if (open && session) {
      reset(session);
    }
  }, [open, session, reset]);

  const onSubmit = async (data) => {
    try {
      const { data: resData, error } = await updateSession({
        method: "PUT",
        url: `/common-management/update-event-session`,
        payload: { ...data, sessionId: session._id },
        authRequired: true,
      });

      if (error) return showToast("error", error);

      showToast("success", resData?.message || "Session updated successfully!");
      setOpen(false);
      onSuccess?.(resData?.data || { ...session, ...data });
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to update session");
    }
  };

  const renderField = (name, label, placeholder, type = "text") => (
    <div className="space-y-1">
      <Label className="flex items-center gap-2 text-sm font-semibold">{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input {...field} type={type} placeholder={placeholder} className="h-10 w-full pr-10" />
        )}
      />
      {errors?.[name]?.message && (
        <p className="text-red-500 text-xs">{errors[name]?.message}</p>
      )}
    </div>
  );

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        <Pencil className="w-4 h-4 mr-1" /> Edit
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full max-w-2xl rounded-2xl border bg-white dark:bg-gray-950 p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Pencil className="text-blue-600" size={22} /> Edit Session
            </DialogTitle>
            <DialogDescription>Update session details below</DialogDescription>
          </DialogHeader>

          {/* Scrollable form container */}
          <div className="overflow-y-auto max-h-[70vh]">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex flex-col">
              {/* Session Info */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border">
                <div className="font-semibold text-base mb-3 flex items-center gap-2">
                  <FileText className="text-blue-500" size={18} /> Session Info
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField("specialNameOfDay", "Session Name", "Enter session name")}
                  {renderField("status", "Status", "active/inactive")}
                </div>
              </div>

              {/* Dates */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border">
                <div className="font-semibold text-base mb-3 flex items-center gap-2">
                  <Calendar className="text-orange-500" size={18} /> Session Dates
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField("date", "Date", "yyyy-mm-dd", "date")}
                  {renderField("startTime", "Start Time", "HH:mm", "time")}
                  {renderField("endTime", "End Time", "HH:mm", "time")}
                </div>
              </div>

              {/* Price & Capacity */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border">
                <div className="font-semibold text-base mb-3 flex items-center gap-2">
                  <FileText className="text-purple-500" size={18} /> Pricing & Capacity
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField("pricePerTicket", "Price per Ticket", "Enter price", "number")}
                  {renderField("currency", "Currency", "Enter currency")}
                  {renderField("totalCapacity", "Total Capacity", "Enter total capacity", "number")}
                  {renderField("remainingCapacity", "Remaining Capacity", "Enter remaining capacity", "number")}
                </div>
              </div>

              {/* Sticky submit */}
              <div className="flex justify-end sticky bottom-0 bg-white dark:bg-gray-950 z-10 p-4 rounded-b-2xl shadow-t md:static md:shadow-none md:p-0">
                <Button type="submit" loading={loading} loadingText="Updating..." className="w-full md:w-auto">
                  Update Session
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
