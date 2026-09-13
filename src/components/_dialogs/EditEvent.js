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
import {
  Calendar,
  MapPin,
  Landmark,
  FileImage,
  FileText,
  Pencil,
} from "lucide-react";
import { showToast } from "@/components/_ui/toast-utils";
import useAxios from "@/hooks/useAxios";
import FileUploader from "../common/FileUploader";

// ✅ Zod Schema (same as AddEvent)
const eventSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Description is required"),
  venueName: z.string().min(2, "Venue name is required"),
  address: z.object({
    address: z.string().min(5, "Address is required"),
    landmark: z.string().optional(),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    pincode: z.string().min(5, "Pincode is required"),
    country: z.string().min(2, "Country is required"),
    maplink: z.string().url("Invalid map link"),
  }),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  images: z.array(z.string().url()).optional(),
  banner: z.string().url().optional(),
});

export default function EditEvent({ events, onSuccess }) {
  const [open, setOpen] = useState(false);
  const { request: updateEvent, loading } = useAxios();

console.log(events,"events")

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      venueName: "",
      address: {
        address: "",
        landmark: "",
        city: "",
        state: "",
        pincode: "",
        country: "",
        maplink: "",
      },
      images: [],
      banner: "",
      startDate: "",
      endDate: "",
    },
  });

  // 🔥 When modal opens, preload event data
  useEffect(() => {
    if (open && events) {
      reset({
        title: events.title || "",
        description: events.description || "",
        venueName: events.venueName || "",
        address: {
          address: events.address?.address || "",
          landmark: events.address?.landmark || "",
          city: events.address?.city || "",
          state: events.address?.state || "",
          pincode: events.address?.pincode || "",
          country: events.address?.country || "",
          maplink: events.address?.maplink || "",
        },
        images: events.images || [],
        banner: events.banner || "",
        startDate: events.startDate
          ? new Date(events.startDate).toISOString().slice(0, 16)
          : "",
        endDate: events.endDate
          ? new Date(events.endDate).toISOString().slice(0, 16)
          : "",
      });
    }
  }, [open, events, reset]);

  const onSubmit = async (data) => {
    data.eventId = events._id;
    if (!data.banner) data.banner = events.banner;
    if (!data.images || data.images.length === 0) data.images = events.images;

    console.log("[DEBUG] onSubmit called with data:", data);
    const { data: resData, error } = await updateEvent({
      method: "PUT",
      url: `/common-management/update-event`,
      payload: data,
      authRequired: true,
    });

    if (error) return showToast("error", error);

    showToast("success", resData?.message || "Event updated successfully!");
    onSuccess(resData?.data);
    setOpen(false);
  };

  const renderField = (name, label, placeholder, Icon, type = "text") => (
    <div className="space-y-1">
      <Label className="flex items-center gap-2 text-sm font-semibold">
        <Icon size={18} />
        {label}
      </Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="relative">
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              className="h-10 w-full pr-10"
            />
          </div>
        )}
      />
      {errors?.[name]?.message && (
        <p className="text-red-500 text-xs">{errors[name]?.message}</p>
      )}
    </div>
  );

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <Pencil className="w-4 h-4 mr-1" /> Edit
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full max-w-2xl rounded-2xl border bg-white dark:bg-gray-950 p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Pencil className="text-blue-600" size={22} /> Edit Event
            </DialogTitle>
            <DialogDescription>Update event details below</DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[70vh]">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 flex flex-col"
            >
              {/* Event Info */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border">
                <div className="font-semibold text-base mb-3 flex items-center gap-2">
                  <FileText className="text-blue-500" size={18} /> Event Info
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField("title", "Title", "Enter title", FileText)}
                  {renderField(
                    "venueName",
                    "Venue Name",
                    "Enter venue",
                    Landmark
                  )}
                </div>
                {renderField(
                  "description",
                  "Description",
                  "Enter description",
                  FileText
                )}
              </div>

              {/* Address Info */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border">
                <div className="font-semibold text-base mb-3 flex items-center gap-2">
                  <MapPin className="text-green-500" size={18} /> Address Info
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField(
                    "address.address",
                    "Address",
                    "Enter address",
                    Landmark
                  )}
                  {renderField(
                    "address.landmark",
                    "Landmark",
                    "Enter landmark",
                    Landmark
                  )}
                  {renderField("address.city", "City", "Enter city", Landmark)}
                  {renderField(
                    "address.state",
                    "State",
                    "Enter state",
                    Landmark
                  )}
                  {renderField(
                    "address.pincode",
                    "Pincode",
                    "Enter pincode",
                    Landmark
                  )}
                  {renderField(
                    "address.country",
                    "Country",
                    "Enter country",
                    Landmark
                  )}
                  {renderField(
                    "address.maplink",
                    "Map Link",
                    "Enter map link",
                    Landmark
                  )}
                </div>
              </div>

              {/* Media */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border">
                <div className="font-semibold text-base mb-3 flex items-center gap-2">
                  <FileImage className="text-pink-500" size={18} /> Banner
                </div>
                <Controller
                  name="banner"
                  control={control}
                  defaultValue={events.banner || ""}
                  render={({ field }) => (
                    <FileUploader
                      url="common-management/upload-banner-image"
                      multiple={false}
                      value={field.value || events.banner}
                      onSuccess={(res) => {
                        const uploadedUrl = res?.data?.url || "";
                        field.onChange(uploadedUrl); // Zod ke liye string set hoga
                      }}
                      onError={(err) => showToast("error", err)}
                      label="Upload Banner"
                    />
                  )}
                />
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border">
                <div className="font-semibold text-base mb-3 flex items-center gap-2">
                  <FileImage className="text-purple-500" size={18} /> Event
                  Images
                </div>
                <Controller
                  name="images"
                  control={control}
                  render={({ field }) => (
                    <FileUploader
                      multiple
                      url="common-management/upload-event-images"
                      fieldName="images"
                      maxFiles={5}
                      value={field.value.length ? field.value : events.images} 
                      onSuccess={(res) => {
                        // ✅ extract urls from response
                        const uploadedUrls =
                          res?.data?.map((file) => file.url) || [];

                        // ✅ merge with existing field value
                        field.onChange([
                          ...(field.value || []),
                          ...uploadedUrls,
                        ]);
                      }}
                      onError={(err) => showToast("error", err)}
                      label="Upload Images"
                    />
                  )}
                />
              </div>

              {/* Dates */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border">
                <div className="font-semibold text-base mb-3 flex items-center gap-2">
                  <Calendar className="text-orange-500" size={18} /> Event Dates
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField(
                    "startDate",
                    "Start Date",
                    "",
                    Calendar,
                    "datetime-local"
                  )}
                  {renderField(
                    "endDate",
                    "End Date",
                    "",
                    Calendar,
                    "datetime-local"
                  )}
                </div>
              </div>

              {/* Sticky Submit */}
              <div className="flex justify-end sticky bottom-0 bg-white dark:bg-gray-950 z-10 p-4 rounded-b-2xl shadow-t md:static md:shadow-none md:p-0">
                <Button
                  type="submit"
                  loading={loading}
                  loadingText="Updating..."
                  className="w-full md:w-auto cursor-pointer"
                >
                  Update Event
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
