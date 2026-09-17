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
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FileText, Tags, FolderPlus, ListOrdered, Trash2 } from "lucide-react";
import { showToast } from "@/components/_ui/toast-utils";
import useAxios from "@/hooks/useAxios";
import FileUploader from "../common/FileUploader";

// ✅ Zod Schema
const productSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Description is required"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).min(1, "At least one tag required"),
  gender: z.enum(
    ["men", "women", "boys", "girls", "unisex", "all"],
    "Select gender"
  ),
  variants: z
    .array(
      z.object({
        color: z.string().min(1, "Color required"),
        size: z.string().min(1, "Size required"),
        price: z.number().min(1, "Price required"),
        stock: z.number().min(0, "Stock required"),
        images: z
          .array(z.string().url("Invalid image URL"))
          .min(1, "At least one image required"),
      })
    )
    .min(1, "At least one variant required"),
});

export default function AddSaleProduct({ onSuccess }) {
  const [open, setOpen] = useState(false);
  const { request: addProduct, loading } = useAxios();
  const [categories, setCategories] = useState([]);

  const {
    request: getAllCategories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useAxios();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      tags: [],
      gender: "unisex",
      variants: [
        {
          color: "",
          size: "",
          price: 0,
          stock: 0,
          images: [],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const endpoint = `/superadmin/get-categories`;

      try {
        const { data, error } = await getAllCategories({
          method: "GET",
          url: endpoint,
          authRequired: true,
        });

        if (!error && data?.data) {
          setCategories(data?.data?.data || data?.data || []);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };

    fetchCategories();
  }, [open]);

  const onSubmit = async (data) => {
    const { data: resData, error } = await addProduct({
      method: "POST",
      url: "/superadmin/create-product",
      payload: data,
      authRequired: true,
    });

    if (error) return showToast("error", error);
    showToast("success", resData?.message || "Product added successfully!");
    onSuccess?.(resData?.data);
    setOpen(false);
    reset();
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Add Product</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full max-w-4xl rounded-2xl border bg-white dark:bg-gray-950 p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold">
              <FolderPlus className="text-blue-600" /> Add Product
            </DialogTitle>
            <DialogDescription>
              Fill in the product details and variants below.
            </DialogDescription>
          </DialogHeader>

          {/* Scrollable Form */}
          <div className="max-h-[80vh] overflow-y-auto pr-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Info */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border shadow-sm space-y-3">
                <div className="font-semibold flex items-center gap-2">
                  <FileText className="text-blue-500" /> Product Info
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Product Title" />
                    )}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Product Description" />
                    )}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full border rounded-md px-3 py-2 dark:bg-gray-800"
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  {errors.category && (
                    <p className="text-red-500 text-xs">
                      {errors.category.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-full border rounded-md px-3 py-2 dark:bg-gray-800"
                      >
                        <option value="">Select Gender</option>
                        <option value="all">All</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value = "boys">Boys</option>
                        <option value = "girls">Girls</option>
                        <option value="unisex">Unisex</option>
                      </select>
                    )}
                  />
                  {errors.gender && (
                    <p className="text-red-500 text-xs">
                      {errors.gender.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border shadow-sm space-y-3">
                <div className="font-semibold flex items-center gap-2">
                  <Tags className="text-green-500" /> Tags
                </div>
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <Controller
                    name="tags"
                    control={control}
                    render={({ field }) => (
                      <Input
                        placeholder="Enter tags (comma separated)"
                        onChange={(e) =>
                          field.onChange(
                            e.target.value.split(",").map((t) => t.trim())
                          )
                        }
                      />
                    )}
                  />
                  {errors.tags && (
                    <p className="text-red-500 text-xs">
                      {errors.tags.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Variants */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border shadow-sm">
                <div className="font-semibold mb-3 flex items-center gap-2">
                  <ListOrdered className="text-purple-500" /> Variants
                </div>

                {fields.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-4 border rounded-lg mb-4 bg-white dark:bg-gray-950 shadow-sm space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div className="space-y-1">
                        <Label>Color</Label>
                        <Controller
                          name={`variants.${index}.color`}
                          control={control}
                          render={({ field }) => (
                            <Input {...field} placeholder="Color" />
                          )}
                        />
                      </div>

                      <div className="space-y-1">
                        <Label>Size</Label>
                        <Controller
                          name={`variants.${index}.size`}
                          control={control}
                          render={({ field }) => (
                            <Input {...field} placeholder="Size" />
                          )}
                        />
                      </div>

                      <div className="space-y-1">
                        <Label>Price</Label>
                        <Controller
                          name={`variants.${index}.price`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              type="number"
                              placeholder="Price"
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber)
                              }
                            />
                          )}
                        />
                      </div>

                      <div className="space-y-1">
                        <Label>Stock</Label>
                        <Controller
                          name={`variants.${index}.stock`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              type="number"
                              placeholder="Stock"
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber)
                              }
                            />
                          )}
                        />
                      </div>
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                      <Label>Variant Images</Label>
                      <Controller
                        name={`variants.${index}.images`}
                        control={control}
                        render={({ field }) => (
                          <FileUploader
                            url="superadmin/upload-product-images"
                            multiple
                            fieldName="images"
                            maxFiles={3}
                            onSuccess={(res) => {
                              const uploadedUrls =
                                res?.data?.map((file) => file.url) || [];
                              field.onChange([
                                ...(field.value || []),
                                ...uploadedUrls,
                              ]);
                            }}
                            onError={(err) => showToast("error", err)}
                          />
                        )}
                      />
                      {/* ✅ Show uploaded preview */}
                      <div className="flex gap-2 mt-2">
                        {fields[index].images?.map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt="variant"
                            crossOrigin="anonymous"
                            className="w-16 h-16 rounded-md object-cover border"
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        className="text-red-600 border-red-300 hover:bg-red-50"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Remove Variant
                      </Button>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    append({
                      color: "",
                      size: "",
                      price: 0,
                      stock: 0,
                      images: [],
                    })
                  }
                >
                  + Add Variant
                </Button>
              </div>

              {/* Submit */}
              <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
