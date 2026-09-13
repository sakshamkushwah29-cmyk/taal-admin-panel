"use client";

import useAxios from "@/hooks/useAxios";
import { Suspense, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { showToast } from "@/components/_ui/toast-utils";
import ProfileFormSkeleton from "@/components/_skeletons/profile-form-skeleton";
import FileUploader from "@/components/common/FileUploader";
import Image from "next/image";
import { BadgeCheck, Mail, Shield, User } from "lucide-react";
import AppBreadcrumb from "@/components/_ui/app-breadcrumb";
import RequestUpdateProfileEventManager from "@/components/_dialogs/RequestUpdateProfileEventManager";
import RequestUpdateProfileGateKeeper from "@/components/_dialogs/RequestUpdateProfileGateKeeper";
import { useRef } from "react";

const profileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  avatar: z.string().optional(),
});

export default function ViewProfile() {
  const {
    request: getProfile,
    loading: profileLoading,
    error: profileError,
    data: profileData,
  } = useAxios();
  const { request: updateProfile, loading: updateLoading } = useAxios();

  const [openDialog, setOpenDialog] = useState(false);
  const [openRequestDialog, setOpenRequestDialog] = useState(false);
  const [uploadedAvatar, setUploadedAvatar] = useState(null); 
  const uploadedAvatarRef = useRef(null);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      avatar: "",
      email: "",
      role: "",
    },
  });

  useEffect(() => {
    getProfile({
      method: "GET",
      url: "/admin/get-admin-details",
      authRequired: true,
    });
  }, []);

  useEffect(() => {
    if (profileData?.status === 200) {
      const { name, avatar, email, role } = profileData.data;
      reset({ name, avatar, email, role });
    }
  }, [profileData, reset]);

  const onSubmit = async (payload) => {
     if (uploadedAvatarRef.current) {
      payload.avatar = uploadedAvatarRef.current;
    }
    setOpenDialog(false);
    const { data: updatedData, error } = await updateProfile({
      method: "PATCH",
      url: "/admin/update-admin-profile",
      authRequired: true,
      payload,
    });

    if (updatedData?.status === 200) {
      showToast("success", updatedData.message);
       getProfile({
        method: "GET",
        url: "/admin/get-admin-details",
        authRequired: true,
      });
      setUploadedAvatar(null);
      uploadedAvatarRef.current = null;
    } else {
      showToast("error", error || "Update failed");
    }
  };

  const name = getValues("name");
  const email = getValues("email");
  const role = getValues("role");
  const isActive = profileData?.data?.isActive;

  return (
    <>
      <div className="min-h-screen flex flex-col justify-center items-center bg-white via-white transition-colors duration-500">
      <div className="flex flex-col gap-8 px-2 py-10 md:px-6 max-w-4xl w-full mx-auto">
        <AppBreadcrumb />
        <Suspense fallback={<ProfileFormSkeleton />}>
          {profileLoading ? (
            <ProfileFormSkeleton />
          ) : profileError ? (
            <p className="text-red-500 text-end">{profileError}</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 w-full">
                {/* --- Account Info Section (Read Only) --- */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 md:p-10 border border-gray-200 dark:border-gray-700 w-full max-w-xl mx-auto">
                  <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
                    Account Information
                  </h2>
                  <div className="space-y-6">
                    {/* Full Name */}
                    <div className="flex items-start gap-4">
                      <User className="w-5 h-5 mt-1 text-indigo-500 dark:text-indigo-400" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                        <p className="text-lg font-medium text-gray-800 dark:text-gray-100">{name || "-"}</p>
                      </div>
                    </div>
                    {/* Email */}
                    <div className="flex items-start gap-4">
                      <Mail className="w-5 h-5 mt-1 text-rose-500 dark:text-rose-400" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                        <p className="text-lg font-medium text-gray-800 dark:text-gray-100">{email || "-"}</p>
                      </div>
                    </div>
                    {/* Role */}
                    <div className="flex items-start gap-4">
                      <Shield className="w-5 h-5 mt-1 text-teal-500 dark:text-teal-400" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
                        <div className="flex items-center gap-2 mt-1">
                          {role === "superadmin" && (
                            <span className="bg-indigo-100 uppercase text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 text-xs font-semibold px-2 py-1 rounded-full">Superadmin</span>
                          )}
                          {role === "pharmacy" && (
                            <span className="bg-green-100 uppercase text-green-700 dark:bg-green-900 dark:text-green-300 text-xs font-semibold px-2 py-1 rounded-full">Pharmacy</span>
                          )}
                          {role === "pathology" && (
                            <span className="bg-yellow-100 uppercase text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 text-xs font-semibold px-2 py-1 rounded-full">Pathology</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Active Status */}
                    <div className="flex items-start gap-4">
                      <BadgeCheck className="w-5 h-5 mt-1 text-emerald-500 dark:text-emerald-400" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                        <div className="flex items-center gap-2 mt-1">
                          {isActive ? (
                            <>
                              <span className="h-2 w-2 rounded-full bg-green-500" />
                              <span className="text-green-700 dark:text-green-300 text-sm font-semibold">Active</span>
                            </>
                          ) : (
                            <>
                              <span className="h-2 w-2 rounded-full bg-red-500" />
                              <span className="text-red-700 dark:text-red-300 text-sm font-semibold">Inactive</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* --- Edit Profile Section --- */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 md:p-10 border border-gray-200 dark:border-gray-700 flex flex-col items-center w-full max-w-xl mx-auto">
                  {role === "superadmin" ? (
                    <>
                      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Edit Profile</h2>
                      {/* Avatar and FileUploader stacked vertically */}
                      <div className="flex flex-col items-center gap-2 mb-4 w-full">
                        <div className="relative group rounded-full overflow-hidden w-32 h-32 max-w-22 max-h-22 shadow-xl border-4 border-gray-300 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300 flex items-center justify-center">
                          {uploadedAvatar ? (
                            <Image
                              src={uploadedAvatar}
                              alt="Preview"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : profileData?.data?.avatar ? (
                            <Image
                              src={profileData.data.avatar}
                              alt="Avatar"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-32 h-32 flex items-center justify-center bg-gray-200 text-gray-500">
                              No Image
                            </div>
                          )}
                        </div>
                        {/* FileUploader for admin only, stacked below avatar */}
                        <div className="flex flex-col items-center gap-1 w-full mt-2">
                          <FileUploader
                            url="/admin/upload-image"
                            authRequired={true}
                            allowedTypes={{ "image/png": [], "image/jpeg": [] }}
                            fieldName="files"
                            maxFileSize={5}
                            maxFiles={1}
                            multiple={false}
                            onSuccess={(data) => {
                              if (data?.data?.imageUrl) {
                                setUploadedAvatar(data.data.imageUrl);
                                uploadedAvatarRef.current = data.data.imageUrl;
                              }
                            }}
                            onError={() => showToast("error", "Image upload failed")}
                            dropzoneClassName="text-xs text-center break-words"
                          />
                          {uploadedAvatar && (
                            <span className="text-xs text-blue-500 mt-1 block text-center">
                              Preview (not saved)
                            </span>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (role === "pharmacy" || role === "pathology") ? (
                    <>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Edit Profile</h2>
                      <div className="flex flex-col items-center gap-4 w-full">
                        <div className="relative group rounded-full overflow-hidden w-32 h-32 max-w-22 max-h-22 shadow-xl border-4 border-gray-300 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300 mb-4">
                          {control._formValues.avatar ? (
                            <Image
                              src={control._formValues.avatar}
                              alt="Profile"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-32 h-32 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 text-lg font-semibold">No Image</div>
                          )}
                        </div>
                        <Button
                          type="button"
                          className="px-6 py-3 text-sm font-semibold rounded-xl shadow-md transition-shadow mt-2"
                          onClick={() => setOpenRequestDialog(true)}
                        >
                          Edit Request
                        </Button>
                      </div>
                    </>
                  ) : null}
                  {/* Edit form or button by role (admin only) */}
                  {role === "superadmin" && (
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="w-full flex flex-col gap-6"
                    >
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Full Name
                        </label>
                        <Controller
                          name="name"
                          control={control}
                          render={({ field }) => (
                            <Input {...field} placeholder="Enter your name" required />
                          )}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                        )}
                      </div>
                      <Button type="submit" disabled={updateLoading} className="w-full py-3 rounded-xl font-semibold cursor-pointer shadow-lg">
                        {updateLoading ? "Saving..." : "Save Changes"}
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </>
          )}
        </Suspense>
        {/* Confirm Dialog */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Changes</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to update your profile?</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit(onSubmit)} disabled={updateLoading}>
                {updateLoading ? "Saving..." : "Confirm"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Request Update Profile Dialog for pharmacy/pathology */}
        {role === "event_manager" && (
          <RequestUpdateProfileEventManager open={openRequestDialog} setOpen={setOpenRequestDialog} profileData={profileData?.data} role={role} />
        )}
        {role === "gatekeeper" && (
          <RequestUpdateProfileGateKeeper open={openRequestDialog} setOpen={setOpenRequestDialog} profileData={profileData?.data} role={role} />
        )}
      </div>
      </div>
    </>
  );
}