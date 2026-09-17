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
import { FileText, Image as ImageIcon, Pencil } from "lucide-react";
import { showToast } from "@/components/_ui/toast-utils";
import useAxios from "@/hooks/useAxios";
import FileUploader from "../common/FileUploader";

const categorySchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(5, "Description is required"),
  icon: z.string().optional(),
});

export default function EditCategory({ category, onSuccess }) {
  const [open, setOpen] = useState(false);
  const { request: updateCategory, loading } = useAxios();

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
      icon: "",
    },
  });

  // ✅ Load category data when modal opens
  useEffect(() => {
    if (category && open) {
      reset({
        name: category.name || "",
        description: category.description || "",
        icon: category.icon || "",
      });
    }
  }, [category, open, reset]);

  const onSubmit = async (data) => {
    data.categoryId = category._id;
    const { data: resData, error } = await updateCategory({
      method: "PUT",
      url: `/superadmin/update-category`,
      payload: data,
      authRequired: true,
    });

    if (error) return showToast("error", error);
    showToast("success", resData?.message || "Category updated successfully!");
    onSuccess?.(resData?.data);
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
      <Button
        variant="outline"
        className="cursor-pointer flex items-center gap-2"
        onClick={() => setOpen(true)}
      >
        <Pencil size={16} /> Edit
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full max-w-lg rounded-2xl border bg-white dark:bg-gray-950 p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Pencil className="text-blue-600" size={22} /> Edit Category
            </DialogTitle>
            <DialogDescription>Update category details below</DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 flex flex-col"
          >
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

            <div className="flex justify-end">
              <Button
                type="submit"
                loading={loading}
                loadingText="Updating..."
                className="w-full md:w-auto cursor-pointer"
              >
                Update
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
