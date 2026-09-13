"use client";

import { useState } from "react";
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
import Image from "next/image";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";
import { showToast } from "@/components/_ui/toast-utils";
import useAxios from "@/hooks/useAxios";
import FileUploader from "../common/FileUploader";
import {
  Mail,
  Lock,
  User,
  Phone,
  Home,
  MapPin,
  Landmark,
  Hash,
  FileText,
  FileBadge,
  ShieldCheck,
  FolderPlus,
} from "lucide-react";

const gatekeeperSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email address"
    ),
  password: z.string({ required_error: "Password is required" }).min(6, "Password must be at least 6 characters."),
  name: z.string({ required_error: "Gatekeeper name is required" }).min(2, "Gatekeeper name is required"),
  phone: z
    .string({ required_error: "Phone number is required" })
    .regex(/^[6-9]\d{9}$/, "Phone number must be a valid 10-digit Indian number"),
});


export default function AddGatekeeper({ onSuccess }) {
  const [open, setOpen] = useState(false);
  const { request: addGatekeeper, loading } = useAxios();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);


  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(gatekeeperSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      phone: "",
    },
  });

  const onSubmit = async (data) => {
    const { data: resData, error } = await addGatekeeper({
      method: "POST",
      url: "/superadmin/create-gatekeeper",
      payload: data,
      authRequired: true,
    });
    if (error) return showToast("error", error);
    showToast("success", resData?.message || "Gatekeeper added successfully!");
    onSuccess?.(resData?.data);
    setOpen(false);
    reset();
    setUploadedImage(null);
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
              type={name === "password" ? (showPassword ? "text" : "password") : type}
              placeholder={placeholder}
              className="h-9 pr-10"
            />
            {name === "password" && (
              <div
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            )}
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
      <Button className="cursor-pointer" onClick={() => setOpen(true)}>Add Gatekeeper</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <FolderPlus className="text-blue-600" size={22} /> Add Gatekeeper
            </DialogTitle>
            <DialogDescription>Enter gatekeeeper details below</DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[70vh]">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex flex-col h-full">
              {/* Account Info Section */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 mb-2 border border-gray-100 dark:border-gray-800">
                <div className="font-semibold text-base mb-3 flex items-center gap-2">
                  <User size={18} className="text-blue-500" /> Account Info
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField("email", "Email", "Enter email", Mail, "email")}
                  {renderField("password", "Password", "Enter password", Lock, "password")}
                </div>
              </div>

              {/* Pharmacy Info Section */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 mb-2 border border-gray-100 dark:border-gray-800">
                <div className="font-semibold text-base mb-3 flex items-center gap-2">
                  <Landmark size={18} className="text-green-500" /> Gatekeeper Info
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField("name", "Name", "Enter Manager name", User)}
                  {renderField("phone", "Phone", "Enter contact number", Phone)}
                </div>
              </div>
              {/* Sticky Submit Button for Mobile */}
              <div className="flex justify-end sticky bottom-0 bg-white dark:bg-gray-950 z-10 p-4 rounded-b-2xl shadow-t md:static md:shadow-none md:p-0">
                <Button type="submit" loading={loading} loadingText="Submitting..." className="w-full md:w-auto cursor-pointer">
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}