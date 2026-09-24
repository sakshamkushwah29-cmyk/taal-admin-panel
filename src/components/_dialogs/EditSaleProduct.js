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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  FileText,
  Tags,
  FolderEdit,
  ListOrdered,
  Trash2,
  Plus,
  X,
  Loader2,
} from "lucide-react";
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
        discountPrice: z
          .union([z.number(), z.nan()])
          .optional()
          .transform((v) => (Number.isFinite(v) ? v : undefined)),
        sku: z.string().optional(),
        stock: z.number().min(0, "Stock required"),
        images: z
          .array(z.string().url("Invalid image URL"))
          .min(1, "At least one image required"),
      })
    )
    .min(1, "At least one variant required"),
});

const emptyVariant = {
  color: "",
  size: "",
  price: 0,
  discountPrice: undefined,
  sku: "",
  stock: 0,
  images: [],
};

export default function EditSaleProduct({ product, onSuccess }) {
  const [open, setOpen] = useState(false);
  const { request: updateProduct, loading } = useAxios();
  const [categories, setCategories] = useState([]);
  const [tagsText, setTagsText] = useState("");

  const { request: getAllCategories } = useAxios();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      tags: [],
      gender: "unisex",
      variants: [emptyVariant],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  // 🟢 prefill on product change
  useEffect(() => {
    if (product) {
      const initialTags = product.tags || [];
      setTagsText(initialTags.join(", "));
      reset({
        title: product.title || "",
        description: product.description || "",
        category:
          typeof product.category === "object"
            ? product.category[0]?._id
            : product.category[0]?._id || "",
        tags: initialTags,
        gender: product.gender || "unisex",
        variants: (product.variants || []).map((v) => ({
          color: v.color || "",
          size: v.size || "",
          price: v.price ?? 0,
          discountPrice: v.discountPrice || undefined,
          sku: v.sku || "",
          stock: v.stock ?? 0,
          images: v.images || [],
        })),
      });
    }
  }, [product, reset]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await getAllCategories({
          method: "GET",
          url: `/superadmin/get-categories?type=sale`,
          authRequired: true,
        });
        if (!error && data?.data) {
          setCategories(data?.data?.data || data?.data || []);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleTagsChange = (value) => {
    setTagsText(value);
    setValue(
      "tags",
      value
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      { shouldValidate: true }
    );
  };

  const onSubmit = async (data) => {
    // strip internal fields and empty discountPrice before sending
    const variants = data.variants.map((v) => ({
      color: v.color,
      size: v.size,
      price: v.price,
      stock: v.stock,
      images: v.images,
      ...(v.sku ? { sku: v.sku } : {}),
      ...(v.discountPrice && v.discountPrice > 0
        ? { discountPrice: v.discountPrice }
        : {}),
    }));

    const { data: resData, error } = await updateProduct({
      method: "PUT",
      url: `/superadmin/update-sale-product`,
      authRequired: true,
      payload: { ...data, variants, productId: product._id },
    });

    if (error) return showToast("error", error);
    showToast("success", resData?.message || "Product updated successfully!");
    onSuccess?.(resData?.data);
    setOpen(false);
  };

  const sectionClass =
    "rounded-xl border bg-card p-5 space-y-4 shadow-sm";
  const sectionTitleClass =
    "text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2";

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        Edit
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[95vw] sm:max-w-[1100px] p-0 overflow-hidden max-h-[90vh] flex flex-col">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <FolderEdit className="text-blue-600 w-5 h-5" /> Edit Product
            </DialogTitle>
            <DialogDescription className="text-xs">
              Update product details, variants and images.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col flex-1 min-h-0"
          >
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Basic Info */}
              <div className={sectionClass}>
                <div className={sectionTitleClass}>
                  <FileText className="w-4 h-4 text-blue-500" /> Product Info
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Title</Label>
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

                  <div className="space-y-1.5">
                    <Label className="text-xs">Category</Label>
                    <Controller
                      name="category"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full h-9 border rounded-md px-3 text-sm bg-white dark:bg-gray-800"
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

                  <div className="space-y-1.5">
                    <Label className="text-xs">Gender</Label>
                    <Controller
                      name="gender"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="w-full h-9 border rounded-md px-3 text-sm bg-white dark:bg-gray-800"
                        >
                          <option value="">Select Gender</option>
                          <option value="all">All</option>
                          <option value="men">Men</option>
                          <option value="women">Women</option>
                          <option value="boys">Boys</option>
                          <option value="girls">Girls</option>
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

                <div className="space-y-1.5">
                  <Label className="text-xs">Description</Label>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        rows={3}
                        placeholder="Product Description"
                      />
                    )}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className={sectionClass}>
                <div className={sectionTitleClass}>
                  <Tags className="w-4 h-4 text-green-500" /> Tags
                </div>
                <Input
                  placeholder="Enter tags (comma separated)"
                  value={tagsText}
                  onChange={(e) => handleTagsChange(e.target.value)}
                />
                <div className="flex flex-wrap gap-2">
                  {tagsText
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                    .map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                </div>
                {errors.tags && (
                  <p className="text-red-500 text-xs">{errors.tags.message}</p>
                )}
              </div>

              {/* Variants */}
              <div className={sectionClass}>
                <div className="flex items-center justify-between">
                  <div className={sectionTitleClass}>
                    <ListOrdered className="w-4 h-4 text-purple-500" /> Variants (
                    {fields.length})
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => append(emptyVariant)}
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Variant
                  </Button>
                </div>

                {fields.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-4 border rounded-lg bg-muted/30 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground">
                        Variant {index + 1}
                      </span>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:bg-red-50 h-7 px-2"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Color</Label>
                        <Controller
                          name={`variants.${index}.color`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              className="bg-white"
                              placeholder="Color"
                            />
                          )}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Size</Label>
                        <Controller
                          name={`variants.${index}.size`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              className="bg-white"
                              placeholder="Size"
                            />
                          )}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Price</Label>
                        <Controller
                          name={`variants.${index}.price`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              className="bg-white"
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
                        <Label className="text-xs">Discount Price</Label>
                        <Controller
                          name={`variants.${index}.discountPrice`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              className="bg-white"
                              type="number"
                              placeholder="Optional"
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber)
                              }
                            />
                          )}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Stock</Label>
                        <Controller
                          name={`variants.${index}.stock`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              className="bg-white"
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

                    {/* Images */}
                    <div className="space-y-2">
                      <Label className="text-xs">Variant Images</Label>
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
                            <div className="flex flex-wrap gap-2">
                              {(field.value || []).map((img, i) => (
                                <div
                                  key={i}
                                  className="relative w-16 h-16 group"
                                >
                                  <img
                                    src={img}
                                    alt="variant"
                                    crossOrigin="anonymous"
                                    className="w-16 h-16 rounded-md object-cover border"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      field.onChange(
                                        field.value.filter((_, idx) => idx !== i)
                                      )
                                    }
                                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-0.5 hover:bg-red-700"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      />
                      {errors.variants?.[index]?.images && (
                        <p className="text-red-500 text-xs">
                          {errors.variants[index].images.message}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {typeof errors.variants?.message === "string" && (
                  <p className="text-red-500 text-xs">
                    {errors.variants.message}
                  </p>
                )}
              </div>
            </div>

            {/* Sticky footer */}
            <div className="px-6 py-4 border-t flex justify-end gap-2 bg-background">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}


// "use client";

// import { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useForm, Controller, useFieldArray } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { FileText, Tags, FolderEdit, ListOrdered, X } from "lucide-react";
// import { showToast } from "@/components/_ui/toast-utils";
// import useAxios from "@/hooks/useAxios";
// import FileUploader from "../common/FileUploader";

// // ✅ Zod Schema
// const productSchema = z.object({
//   title: z.string().min(3, "Title is required"),
//   description: z.string().min(10, "Description is required"),
//   category: z.string().min(1, "Category is required"),
//   tags: z.array(z.string()).min(1, "At least one tag required"),
//   gender: z.enum(
//     ["men", "women", "boys", "girls", "unisex", "all"],
//     "Select gender"
//   ),
//   variants: z
//     .array(
//       z.object({
//         color: z.string().min(1, "Color required"),
//         size: z.string().min(1, "Size required"),
//         price: z.number().min(1, "Price required"),
//         discountPrice: z.number().optional(),
//         stock: z.number().min(0, "Stock required"),
//         images: z
//           .array(z.string().url("Invalid image URL"))
//           .min(1, "At least one image required"),
//       })
//     )
//     .min(1, "At least one variant required"),
// });

// export default function EditSaleProduct({ product, onSuccess }) {
//   const [open, setOpen] = useState(false);
//   const { request: updateProduct, loading } = useAxios();
//   const [categories, setCategories] = useState([]);

//   const { request: getAllCategories } = useAxios();

//   const {
//     control,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(productSchema),
//     defaultValues: {
//       title: "",
//       description: "",
//       category: "",
//       gender: "unisex",
//       tags: [],
//       variants: [],
//     },
//   });

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const { data, error } = await getAllCategories({
//           method: "GET",
//           url: `/superadmin/get-categories`,
//           authRequired: true,
//         });
//         if (!error && data?.data) {
//           setCategories(data?.data?.data || data?.data || []);
//         }
//       } catch (error) {
//         console.error("Unexpected error:", error);
//       }
//     };
//     fetchCategories();
//   }, []);

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "variants",
//   });

//   // 🟢 prefill on product change
//   useEffect(() => {
//     if (product) {
//       reset({
//         title: product.title || "",
//         description: product.description || "",
//         category:
//           typeof product.category === "object"
//             ? product.category[0]._id
//             : product.category[0]._id || "",
//         tags: product.tags || [],
//         variants: product.variants || [],
//         gender: product.gender || "unisex",
//       });
//     }
//   }, [product, reset]);

//   const onSubmit = async (data) => {
//     const { data: resData, error } = await updateProduct({
//       method: "PUT",
//       url: `/superadmin/update-sale-product`,
//       authRequired: true,
//       payload: { ...data, productId: product._id },
//     });

//     if (error) return showToast("error", error);
//     showToast("success", resData?.message || "Product updated successfully!");
//     onSuccess?.(resData?.data);
//     setOpen(false);
//     reset();
//   };

//   console.log(product, "product");
//   return (
//     <>
//       <Button onClick={() => setOpen(true)} variant="outline">
//         Edit
//       </Button>
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent className="w-full max-w-3xl rounded-2xl border bg-white dark:bg-gray-950 p-6 overflow-y-auto max-h-[90vh]">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <FolderEdit className="text-blue-600" /> Edit Product
//             </DialogTitle>
//             <DialogDescription>Update product details below</DialogDescription>
//           </DialogHeader>

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//             {/* Basic Info */}
//             <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border space-y-3">
//               <div className="font-semibold flex items-center gap-2">
//                 <FileText className="text-blue-500" /> Product Info
//               </div>
//               <Controller
//                 name="title"
//                 control={control}
//                 render={({ field }) => (
//                   <Input {...field} placeholder="Product Title" />
//                 )}
//               />
//               {errors.title && (
//                 <p className="text-red-500 text-xs">{errors.title.message}</p>
//               )}

//               <Controller
//                 name="description"
//                 control={control}
//                 render={({ field }) => (
//                   <Input {...field} placeholder="Product Description" />
//                 )}
//               />
//               {errors.description && (
//                 <p className="text-red-500 text-xs">
//                   {errors.description.message}
//                 </p>
//               )}

//               <Controller
//                 name="category"
//                 control={control}
//                 render={({ field }) => (
//                   <select
//                     {...field}
//                     value={field.value || ""}
//                     onChange={(e) => field.onChange(e.target.value)}
//                     className="w-full border rounded-md px-3 py-2 dark:bg-gray-800"
//                   >
//                     <option value="">Select Category</option>
//                     {categories.map((cat) => (
//                       <option key={cat._id} value={cat._id}>
//                         {cat.name}
//                       </option>
//                     ))}
//                   </select>
//                 )}
//               />
//               {errors.category && (
//                 <p className="text-red-500 text-xs">
//                   {errors.category.message}
//                 </p>
//               )}

//               <Controller
//                 name="gender"
//                 control={control}
//                 render={({ field }) => (
//                   <select
//                     {...field}
//                     value={field.value || ""}
//                     onChange={(e) => field.onChange(e.target.value)}
//                     className="w-full border rounded-md px-3 py-2 dark:bg-gray-800"
//                   >
//                     <option value="">Select Gender</option>
//                     <option value="all">All</option>
//                     <option value="male">Male</option>
//                     <option value="female">Female</option>
//                     <option value="boys">Boys</option>
//                     <option value="girls">Girls</option>
//                     <option value="unisex">Unisex</option>
//                   </select>
//                 )}
//               />
//               {errors.gender && (
//                 <p className="text-red-500 text-xs">{errors.gender.message}</p>
//               )}
//             </div>

//             {/* Tags */}
//             <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border space-y-3">
//               <div className="font-semibold flex items-center gap-2">
//                 <Tags className="text-green-500" /> Tags
//               </div>
//               <Controller
//                 name="tags"
//                 control={control}
//                 render={({ field }) => (
//                   <Input
//                     placeholder="Enter tags (comma separated)"
//                     defaultValue={field.value?.join(", ")}
//                     onChange={(e) =>
//                       field.onChange(
//                         e.target.value.split(",").map((t) => t.trim())
//                       )
//                     }
//                   />
//                 )}
//               />
//               {errors.tags && (
//                 <p className="text-red-500 text-xs">{errors.tags.message}</p>
//               )}
//             </div>

//             {/* Variants */}
//             <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border space-y-4">
//               <div className="font-semibold flex items-center gap-2">
//                 <ListOrdered className="text-purple-500" /> Variants
//               </div>
//               {fields.map((item, index) => (
//                 <div
//                   key={item.id}
//                   className="p-4 border rounded-lg space-y-3 mb-4"
//                 >
//                   <Controller
//                     name={`variants.${index}.color`}
//                     control={control}
//                     render={({ field }) => (
//                       <Input {...field} placeholder="Color" />
//                     )}
//                   />
//                   <Controller
//                     name={`variants.${index}.size`}
//                     control={control}
//                     render={({ field }) => (
//                       <Input {...field} placeholder="Size" />
//                     )}
//                   />
//                   <Controller
//                     name={`variants.${index}.price`}
//                     control={control}
//                     render={({ field }) => (
//                       <Input {...field} type="number" placeholder="Price" />
//                     )}
//                   />
//                   <Controller
//                     name={`variants.${index}.discountPrice`}
//                     control={control}
//                     render={({ field }) => (
//                       <Input
//                         {...field}
//                         type="number"
//                         placeholder="Discount Price"
//                       />
//                     )}
//                   />
//                   <Controller
//                     name={`variants.${index}.stock`}
//                     control={control}
//                     render={({ field }) => (
//                       <Input {...field} type="number" placeholder="Stock" />
//                     )}
//                   />

//                   {/* Images Upload + Preview */}
//                   <Controller
//                     name={`variants.${index}.images`}
//                     control={control}
//                     render={({ field }) => (
//                       <div className="space-y-2">
//                         <FileUploader
//                           url="superadmin/upload-product-images"
//                           multiple
//                           fieldName="images"
//                           maxFiles={3}
//                           onSuccess={(res) => {
//                             const uploadedUrls =
//                               res?.data?.map((file) => file.url) || [];
//                             field.onChange([
//                               ...(field.value || []),
//                               ...uploadedUrls,
//                             ]);
//                           }}
//                           onError={(err) => showToast("error", err)}
//                         />

//                         {/* Image Previews */}
//                         <div className="flex gap-2 flex-wrap">
//                           {field.value?.map((imgUrl, i) => (
//                             <div key={i} className="relative w-20 h-20">
//                               <img
//                                 src={imgUrl}
//                                 alt="variant"
//                                 crossOrigin="anonymous"
//                                 className="w-20 h-20 object-cover rounded-lg border"
//                               />
//                               <button
//                                 type="button"
//                                 onClick={() => {
//                                   const updated = field.value.filter(
//                                     (_, idx) => idx !== i
//                                   );
//                                   field.onChange(updated);
//                                 }}
//                                 className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
//                               >
//                                 <X size={14} />
//                               </button>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   />

//                   <Button
//                     type="button"
//                     variant="destructive"
//                     onClick={() => remove(index)}
//                   >
//                     Remove Variant
//                   </Button>
//                 </div>
//               ))}
//               <Button
//                 type="button"
//                 variant="secondary"
//                 onClick={() =>
//                   append({
//                     color: "",
//                     size: "",
//                     price: 0,
//                     discountPrice: 0,
//                     stock: 0,
//                     images: [],
//                   })
//                 }
//               >
//                 + Add Variant
//               </Button>
//             </div>

//             {/* Submit */}
//             <div className="flex justify-end">
//               <Button type="submit" loading={loading}>
//                 Save Changes
//               </Button>
//             </div>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }
