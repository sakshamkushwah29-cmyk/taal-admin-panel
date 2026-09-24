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
import { FileText, Tags, FolderEdit, ListOrdered, X } from "lucide-react";
import { showToast } from "@/components/_ui/toast-utils";
import useAxios from "@/hooks/useAxios";
import FileUploader from "../common/FileUploader";

// Zod Schema for Edit Rent Product
const productSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Description is required"),
  rentPricePerDay: z.number().min(1, "Rent price per day is required"),
  deposit: z.number().min(1, "Deposit is required"),
  category: z.string().min(1, "Category is required"),
  gender: z.string().min(1, "Gender is required"),
  tags: z.array(z.string()).min(1, "At least one tag required"),
  variants: z
    .array(
      z.object({
        color: z.string().min(1, "Color required"),
        size: z.string().min(1, "Size required"),
        price: z.number().min(1, "Price required"),
        discountPrice: z.number().optional(),
        stock: z.number().min(0, "Stock required"),
        images: z
          .array(z.string().url("Invalid image URL"))
          .min(1, "At least one image required"),
      })
    )
    .min(1, "At least one variant required"),
});

export default function EditRentProduct({ product, onSuccess }) {
  const [open, setOpen] = useState(false);
  const { request: updateProduct, loading } = useAxios();
  const [categories, setCategories] = useState([]);

  const { request: getAllCategories } = useAxios();

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
      rentPricePerDay: 0,
      deposit: 0,
      category: "",
      gender: "",
      tags: [],
      variants: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await getAllCategories({
          method: "GET",
          url: `/superadmin/get-categories?type=rental`,
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
  }, []);

  // Pre-populate form with product data
  useEffect(() => {
    if (product) {
      reset({
        title: product.title || "",
        description: product.description || "",
        rentPricePerDay: product.rentPricePerDay || 0,
        deposit: product.deposit || 0,
        category: product.category?._id || product.category || "",
        gender: product.gender || "",
        tags: product.tags || [],
        variants: product.variants || [],
      });
    }
  }, [product, reset]);

  const onSubmit = async (data) => {
    const { data: resData, error } = await updateProduct({
      method: "PUT",
      url: `/superadmin/update-rent-product`,
      payload: { ...data, productId: product._id },
      authRequired: true,
    });

    if (error) return showToast("error", error);
    showToast("success", resData?.message || "Rent product updated successfully!");
    onSuccess?.(resData?.data);
    setOpen(false);
    reset();
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        Edit
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full max-w-3xl rounded-2xl border bg-white dark:bg-gray-950 p-6 overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderEdit className="text-blue-600" /> Edit Rent Product
            </DialogTitle>
            <DialogDescription>
              Update rent product details below
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border space-y-3">
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
                  <p className="text-red-500 text-xs">{errors.title.message}</p>
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
                  <p className="text-red-500 text-xs">{errors.description.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Rent Price Per Day</Label>
                <Controller
                  name="rentPricePerDay"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      placeholder="Rent Price Per Day"
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  )}
                />
                {errors.rentPricePerDay && (
                  <p className="text-red-500 text-xs">{errors.rentPricePerDay.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Deposit</Label>
                <Controller
                  name="deposit"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      placeholder="Deposit"
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  )}
                />
                {errors.deposit && (
                  <p className="text-red-500 text-xs">{errors.deposit.message}</p>
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
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
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
                  <p className="text-red-500 text-xs">{errors.category.message}</p>
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
                      <option value="men">Men</option>
                      <option value="women">Women</option>
                      <option value="kids">Kids</option>
                    </select>
                  )}
                />
                {errors.gender && (
                  <p className="text-red-500 text-xs">{errors.gender.message}</p>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border space-y-3">
              <div className="font-semibold flex items-center gap-2">
                <Tags className="text-green-500" /> Tags
              </div>
              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder="Enter tags (comma separated)"
                    value={field.value?.join(", ") || ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value.split(",").map((t) => t.trim())
                      )
                    }
                  />
                )}
              />
              {errors.tags && (
                <p className="text-red-500 text-xs">{errors.tags.message}</p>
              )}
            </div>

            {/* Variants */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border space-y-4">
              <div className="font-semibold flex items-center gap-2">
                <ListOrdered className="text-purple-500" /> Variants
              </div>
              {fields.map((item, index) => (
                <div
                  key={item.id}
                  className="p-4 border rounded-lg space-y-3 mb-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
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
                      <Label>Discount Price</Label>
                      <Controller
                        name={`variants.${index}.discountPrice`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="number"
                            placeholder="Discount Price"
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

                  {/* Images Upload + Preview */}
                  <div className="space-y-2">
                    <Label>Variant Images</Label>
                    <Controller
                      name={`variants.${index}.images`}
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-2">
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

                          {/* Image Previews */}
                          <div className="flex gap-2 flex-wrap">
                            {field.value?.map((imgUrl, i) => (
                              <div key={i} className="relative w-20 h-20">
                                <img
                                  src={imgUrl}
                                  alt="variant"
                                  crossOrigin="anonymous"
                                  className="w-20 h-20 object-cover rounded-lg border"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = field.value.filter(
                                      (_, idx) => idx !== i
                                    );
                                    field.onChange(updated);
                                  }}
                                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    />
                  </div>

                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => remove(index)}
                  >
                    Remove Variant
                  </Button>
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
                    discountPrice: 0,
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
                {loading ? "Updating..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}