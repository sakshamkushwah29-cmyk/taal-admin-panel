"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Pencil, Building2, User, Phone, FileText, MapPin, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { email, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useAxios from "@/hooks/useAxios";
import { showToast } from "@/components/_ui/toast-utils";
import FileUploader from "../common/FileUploader";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mmanagerSchema = z.object({
  name: z.string().min(2, "Manager name is required"),

  phone: z
      .string()
      .regex(/^[6-9]\d{9}$/, "Phone number must be a valid 10-digit Indian number"),
   email: z
     .string()
     .min(1, "Email is required")
     .regex(
       /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
       "Invalid email address"
     ),
});

const InfoInput = ({ label, icon: Icon, name, register, error, placeholder }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4" />}
      {label}
    </label>
    <Input
      {...register(name)}
      placeholder={placeholder}
      className="bg-white dark:bg-gray-900"
    />
    {error && <p className="text-red-500 text-xs">{error.message}</p>}
  </div>
);

export default function EditManagers({ managers, onSuccess }) {
  const [open, setOpen] = useState(false);
  const { request, loading } = useAxios();

console.log(managers, "Managers==========")

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    resolver: zodResolver(mmanagerSchema),
    defaultValues: {
      name: managers.name || "",
      phone: managers.phone || "",
      email: managers.email || "",
    },
  });

  useEffect(() => {
    if (open && managers) {
      reset({
        name: managers.name || "",
        phone: managers.phone || "",
        email: managers.email || "",
      });
    }
  }, [open, managers, reset]);


  const onSubmit = async (values) => {
    const { data, error } = await request({
      method: "PUT",
      url: "/superadmin/update-event-manager",
      authRequired: true,
      payload: {
        managerId: managers._id,
        ...values,
      },
    });

    if (!error) {
      showToast("success", data.message || "Manager updated successfully.");
      setOpen(false);
      onSuccess(data.data);
    } else {
      showToast("error", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" className="cursor-pointer">
          <Pencil className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-sm lg:max-h-[85vh] max-h-[70vh] rounded-2xl shadow-2xl bg-white dark:bg-gray-950 flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800">
        <DialogHeader className="p-6 border-b border-gray-200 dark:border-gray-800">
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
            <Building2 className="text-indigo-600" size={20} />
            Edit Manager Details
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
            Update Manager details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 overflow-y-auto bg-gray-50 dark:bg-gray-900 flex-1">
          <InfoInput label="Manager Name" icon={Building2} name="name" register={register} error={errors?.name} placeholder="Enter Manager name" />
          <InfoInput label="Phone" icon={Phone} name="phone" register={register} error={errors?.phone} placeholder="Enter phone number" />
         <InfoInput label="Email" icon={User} name="email" register={register} error={errors?.email} placeholder="Enter email" />

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex gap-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1 cursor-pointer" >
              Cancel
            </Button>
            <Button type="submit" loading={loading} loadingText="Updating..." className="flex-1 cursor-pointer">
              Update Manager
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
