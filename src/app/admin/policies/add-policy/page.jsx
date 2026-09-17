"use client";
import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useAxios from "@/hooks/useAxios";
import { showToast } from "@/components/_ui/toast-utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdminDashboardLayout from "../../page";
import AppBreadcrumb from "@/components/_ui/app-breadcrumb";
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });
 
const policySchema = z.object({
  type: z.string().min(1, "Policy type is required"),
  userType: z.string().min(1, "User type is required"),
  content: z.string().min(20, "Content must be at least 20 characters"),
});

export default function AddPolicyPage() {
  const router = useRouter();
  const { request } = useAxios();
  const [hasMounted, setHasMounted] = useState(false);
 
  const editor = useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(policySchema),
    defaultValues: {
      type: "",
      userType: "",
      content: "",
    },
  });

  const content = watch("content");

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const onSubmit = async (formData) => {
    const { data, error } = await request({
      method: "POST",
      url: "/admin/add-policy",
      payload: formData,
      authRequired: true,
    });

    if (!error) {
      showToast("success", data?.message || "Policy added successfully.");
      router.push("/admin/policies");
    } else {
      showToast("error", error || "Something went wrong.");
    }
  };

  if (!hasMounted) return null;

  return (
    <AdminDashboardLayout>
      <AppBreadcrumb />
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary">Add Policy</h2>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                  <Label className="ms-3" htmlFor="type">Policy Type</Label>
                  <Select
                     onValueChange={(val) => setValue("type", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Policy Type"/>
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="privacy">Privacy</SelectItem>
                      <SelectItem value="terms">Terms</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <p className="text-sm text-red-500">{errors.type.message}</p>
                  )}
                </div>

                {/* User Type Dropdown */}
                <div className="space-y-2">
                  <Label className="ms-3" htmlFor="userType">User Type</Label>
                  <Select
                     onValueChange={(val) => setValue("userType", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select User Type"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="delivery">Delivery</SelectItem>
                      <SelectItem value="pharmacy">Pharmacy</SelectItem>
                      <SelectItem value="pathology">Pathology</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.userType && (
                    <p className="text-sm text-red-500">{errors.userType.message}</p>
                  )}
                </div>
              </div>

               <div className="space-y-2">
                <Label>Policy Content</Label>
                <JoditEditor
                ref={editor}
                value={content}
                onChange={(val) => setValue("content", val, {shouldValidate: true})}
                />
               
                {errors.content && (
                  <p className="text-sm text-red-500">{errors.content.message}</p>
                )}
              </div>

               <div className="space-y-2">
                <Label>Live Preview</Label>
                <div
                  className="prose dark:prose-invert bg-white p-4 rounded-md border max-h-72 overflow-auto"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-3 my-3">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Add Policy"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
}
