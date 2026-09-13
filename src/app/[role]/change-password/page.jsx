"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import useAxios from "@/hooks/useAxios";
import { showToast } from "@/components/_ui/toast-utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import AppBreadcrumb from "@/components/_ui/app-breadcrumb";

// ✅ Zod Schema
const passwordSchema = z
  .object({
    oldPassword: z.string().min(8, "Old password must be at least 8 characters"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ChangePassword() {
  const { request: changePassword, loading } = useAxios();
  const [openDialog, setOpenDialog] = useState(false);
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(passwordSchema),
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (payload) => {
    setOpenDialog(false);
    const { data, error } = await changePassword({
      method: "POST",
      url: "/superadmin/changed-password",
      authRequired: true,
      payload: {
        oldPassword: payload.oldPassword,
        newPassword: payload.newPassword,
      },
    });

    if (data?.status === 200) {
      showToast("success", "Password changed successfully!");
      reset();
    } else {
      showToast("error", error || "Password change failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white via-white transition-colors duration-500">
      <div className="w-full max-w-2xl px-4 pt-10">
        <AppBreadcrumb />
      </div>
      <div className="w-full max-w-md p-8 bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 mt-4 mb-8 space-y-8 transition-all duration-500">
        <h1 className="text-3xl font-bold text-center mb-2">
          Change Password
        </h1>
        <p className="text-center text-gray-500 dark:text-gray-400 text-base mb-4">
          For your security, please use a strong password you haven't used elsewhere.
        </p>
        {loading ? (
          <Skeleton className="h-40 w-full rounded-lg" />
        ) : (
          <form
            onSubmit={handleSubmit(() => setOpenDialog(true))}
            className="space-y-6"
            autoComplete="off"
          >
            {[
              { name: "oldPassword", label: "Old Password" },
              { name: "newPassword", label: "New Password" },
              { name: "confirmPassword", label: "Confirm New Password" },
            ].map(({ name, label }) => (
              <div key={name} className="space-y-1">
                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {label}
                </Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <Controller
                    name={name}
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type={showPassword[name] ? "text" : "password"}
                        placeholder={`Enter ${label.toLowerCase()}`}
                        className="pl-10 pr-12 py-2.5 rounded-xl border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 text-base"
                        autoComplete="new-password"
                        disabled={loading}
                      />
                    )}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400 transition-colors cursor-pointer"
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        [name]: !prev[name],
                      }))
                    }
                    disabled={loading}
                  >
                    {showPassword[name] ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors[name] && (
                  <p className="text-xs text-red-500 mt-1 animate-shake">
                    {errors[name]?.message}
                  </p>
                )}
              </div>
            ))}

            <Button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold cursor-pointer shadow-lg"
              loading={loading}
              loadingText="Changing…"
              disabled={loading}
            >
              Change Password
            </Button>
          </form>
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="rounded-2xl p-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Confirm Password Change
            </DialogTitle>
          </DialogHeader>
          <p className="text-base text-gray-600 dark:text-gray-300 mb-4">
            Are you sure you want to change your password?
          </p>
          <DialogFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setOpenDialog(false)}
              disabled={loading}
              className="rounded-lg px-6 py-2 text-base"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              loading={loading}
              loadingText="Changing…"
              className="rounded-lg px-6 py-2 text-base"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
