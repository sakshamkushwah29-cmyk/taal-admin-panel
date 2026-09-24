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
import * as z from "zod";
import { FolderPlus, FileText, Image as ImageIcon, Layers } from "lucide-react";
import { showToast } from "@/components/_ui/toast-utils";
import useAxios from "@/hooks/useAxios";
import FileUploader from "../common/FileUploader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ✅ Zod Schema
const categorySchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(5, "Description is required"),
  type: z.enum(["rental", "sale", "both"]).default("both"),
  icon: z.string().optional(),
});

export default function AddCategory({ onSuccess }) {
  const [open, setOpen] = useState(false);
  const { request: addCategory, loading } = useAxios();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      type: "both",
      icon: "",
    },
  });

  const onSubmit = async (data) => {
    const { data: resData, error } = await addCategory({
      method: "POST",
      url: "/superadmin/create-category",
      payload: data,
      authRequired: true,
    });

    if (error) return showToast("error", error);
    showToast("success", resData?.message || "Category created successfully!");
    onSuccess?.(resData?.data);
    setOpen(false);
    reset();
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
          <Input
            {...field}
            type={type}
            placeholder={placeholder}
            className="h-10 w-full"
          />
        )}
      />
      {errors?.[name]?.message && (
        <p className="text-red-500 text-xs">{errors[name]?.message}</p>
      )}
    </div>
  );

  return (
    <>
      <Button className="cursor-pointer" onClick={() => setOpen(true)}>
        Add Category
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full max-w-lg rounded-2xl border bg-white dark:bg-gray-950 p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <FolderPlus className="text-blue-600" size={22} /> Add Category
            </DialogTitle>
            <DialogDescription>Enter category details below</DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 flex flex-col"
          >
            {/* Category Info */}
            <div className="space-y-4">
              {renderField("name", "Name", "Enter category name", FileText)}
              {renderField(
                "description",
                "Description",
                "Enter description",
                FileText
              )}

              <div className="space-y-1">
                <Label className="flex items-center gap-2 text-sm font-semibold">
                  <Layers size={18} />
                  Category Type (For)
                </Label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full h-10">
                        <SelectValue placeholder="Select category type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="both">Both (Rental & Buyers)</SelectItem>
                        <SelectItem value="rental">Rental Only</SelectItem>
                        <SelectItem value="sale">Buyers Only</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors?.type?.message && (
                  <p className="text-red-500 text-xs">
                    {errors.type.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label className="flex items-center gap-2 text-sm font-semibold">
                  <ImageIcon size={18} />
                  Icon
                </Label>
                <Controller
                  name="icon"
                  control={control}
                  render={({ field }) => (
                    <FileUploader
                      value={field.value}
                      onChange={field.onChange}
                      label="Upload Icon"
                    />
                  )}
                />
                {errors?.icon?.message && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.icon.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <Button
                type="submit"
                loading={loading}
                loadingText="Submitting..."
                className="w-full md:w-auto cursor-pointer"
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
