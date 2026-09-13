"use client";
import AppBreadcrumb from "@/components/_ui/app-breadcrumb";
import NotificationList from "@/components/common/NotificationList";

export default function NotificationPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white via-white transition-colors duration-500">
    <div className="p-4 md:p-10 max-w-5xl w-full mx-auto space-y-6">
      <AppBreadcrumb />
      <NotificationList />
    </div>
    </div>
  );
}