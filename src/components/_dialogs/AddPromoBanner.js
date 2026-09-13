"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
import { showToast } from "@/components/_ui/toast-utils";
import useAxios from "@/hooks/useAxios";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import FileUploader from "../common/FileUploader";
import { debounce } from "lodash";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Search, Calendar, Package, Pill } from "lucide-react";
import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";

const bannerSchema = z.object({
  bannerImageUrl: z.string({ required_error: "Please upload a banner image" })
    .min(1, "Please upload a banner image")
    .url({ message: "Please provide a valid image URL" }),
  productId: z.string().min(1, "Please select a product"),
  type: z
  .string()
  .refine((val) => val === "test" || val === "medicine", {
    message: "Please select a banner type",
  }),
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  isActive: z.boolean(),
  priority: z.coerce.number().min(1, "Priority must be at least 1"),
});
export default function AddPromoBanner({ onSuccess, handleRefresh }) {
  const [open, setOpen] = useState(false);
  const { request: createBanner, loading } = useAxios();
  const { request: searchTest } = useAxios();
  const { request: searchMedicine } = useAxios();
  const [searchResults, setSearchResults] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [uploadedBannerImage, setUploadedBannerImage] = useState("");
  const dropdownRef = useRef();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
    getValues,
    trigger,
  } = useForm({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      bannerImageUrl: "",
      productId: "",
      type: "",
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      isActive: true,
      priority: 1,
    },
  });

  const selectedType = watch("type");

   useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset search when type changes
  useEffect(() => {
    setSearchValue("");
    setSearchResults([]);
    setShowDropdown(false);
    setValue("productId", "");
  }, [selectedType, setValue]);

  // Debounced search function
  const debounceSearch = useCallback(
    debounce(async (val, type) => {
      const trimmed = val.trim();
      if (!trimmed) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }
      setSearchLoading(true);
      let data, error;
      if (type === "test") {
        ({ data, error } = await searchTest({
          method: "GET",
          url: `/admin/search-test?value=${encodeURIComponent(trimmed)}&page=1&limit=5`,
          authRequired: true,
        }));
        setSearchResults(data?.data?.tests || []);
      } else {
        ({ data, error } = await searchMedicine({
          method: "GET",
          url: `/admin/search-medicine?query=${encodeURIComponent(trimmed)}`,
          authRequired: true,
        }));
        setSearchResults(data?.data?.data || []);
      }
      setShowDropdown(true);
      setSearchLoading(false);
    }, 500),
    [searchTest, searchMedicine]
  );

  const onSubmit = async (data) => {
    console.log("[DEBUG] onSubmit called with data:", data);
    if (!data.productId) {
      showToast('error', 'Please select a product');
      return;
    }
    // Generate path based on type and productId
    let path = "";
    if (data.type === "test") {
      path = `/pathology/lab-test/${data.productId}`;
    } else if (data.type === "medicine") {
      path = `/pharmacy/product/${data.productId}`;
    }

    console.log(path, "Data path")
    console.log(data.type, "Data type")
    console.log(data.productId, "Data productId")

    const payload = {
      ...data,
      path: path
    };

    console.log("[DEBUG] Payload to be sent:", payload);

    const { data: resData, error } = await createBanner({
      method: "POST",
      url: "/admin/create-promo-banner",
      payload: payload,
      authRequired: true,
    });

    if (error) {
      console.log("[DEBUG] API error:", error);
      showToast("error", error);
      return;
    }
    console.log("[DEBUG] Response data", resData);
    showToast("success", "Promo banner added successfully!");
    onSuccess?.(resData?.data);
    handleRefresh();
    setOpen(false);
    reset();
    setUploadedBannerImage("");
  };


  const onInvalid = (errors) => {
    console.log("Form errors:", errors);
    showToast("error", "Please fill all required fields correctly!");
  };

  const renderField = (name, label, placeholder, type = "text", icon = null) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        {icon && icon}
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
            className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        )}
      />
      {errors?.[name]?.message && (
        <p className="text-red-500 text-xs font-medium">{errors[name]?.message}</p>
      )}
    </div>
  );

  return (
    <>
      <Button onClick={() => setOpen(true)} className="cursor-pointer">
        <Package className="w-4 h-4 mr-2" />
        Add Promo Banner
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full h-[80vh] lg:max-h-[90vh]  rounded-2xl border-0 shadow-2xl">
          <DialogHeader className="text-center bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-t-2xl">
            <DialogTitle className="text-3xl font-bold">
              Create Promo Banner
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-lg mt-2">
              Design an attractive promotional banner for your products
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-8 p-6 overflow-y-auto">
            {/* Type Selection - Enhanced Design */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
              <Label className="text-lg font-semibold text-gray-800 mb-4 block flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-blue-600" />
                </div>
                Select Banner Type
              </Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(val) => field.onChange(val)}
                  >
                    <SelectTrigger className="h-14 bg-white border-2 border-blue-200 focus:border-blue-500 rounded-xl text-lg">
                      <SelectValue placeholder="Choose banner type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="test" className="flex items-center gap-3 py-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <Pill className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium">Test</div>
                        </div>
                      </SelectItem>
                      <SelectItem value="medicine" className="flex items-center gap-3 py-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Package className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">Medicine</div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors?.type?.message && (
                <p className="text-red-500 text-sm font-medium mt-2 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.type.message}
                </p>
              )}
            </div>

            {/* Banner Image Upload with Preview */}
            <div className="space-y-3">
              <Label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-purple-600" />
                </div>
                Banner Image
              </Label>
              <div className="flex flex-col md:flex-row items-center gap-4">
                {(uploadedBannerImage?.trim() || control._formValues.bannerImageUrl?.trim()) ? (
                  <div className="relative w-40 h-24 rounded-md overflow-hidden border shadow bg-white flex items-center justify-center">
                    {(uploadedBannerImage?.trim() || control._formValues.bannerImageUrl?.trim()) && (
                      <Image
                        src={uploadedBannerImage?.trim() || control._formValues.bannerImageUrl?.trim()}
                        width={100}
                        height={100}
                        alt="Banner Preview"
                        className="object-cover w-full h-full"
                      />
                    )}

                  </div>
                ) : (
                  <div className="w-40 h-24 flex items-center justify-center border rounded-md text-sm text-gray-500">
                    No Banner Image
                  </div>
                )}

                <div className="w-full">
                  <FileUploader
                    url="/admin/upload-promo-banner-image"
                    maxFiles={1}
                    multiple={false}
                    allowedTypes={{ "image/png": [], "image/jpeg": [] }}
                    fieldName="image"
                    onSuccess={(data) => {
                      const url = data?.data?.imageUrl || "";
                      if (url) {
                        setValue("bannerImageUrl", url, { shouldValidate: true });
                        setUploadedBannerImage(url);
                      } else {
                        showToast("error", "Failed to upload image");
                      }
                    }}
                  />
                  {errors?.bannerImageUrl?.message && (
                    <p className="text-red-500 text-sm font-medium flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.bannerImageUrl.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Product Search - Enhanced */}
            <div className="space-y-3 relative" ref={dropdownRef}>
              <Label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Search className="w-4 h-4 text-green-600" />
                </div>
                Search {selectedType === "test" ? "Test" : "Medicine"}
              </Label>
              <div className="relative">
                <Input
                  placeholder={
                    selectedType === "test"
                      ? "Search for tests (e.g., Blood Test, COVID Test)..."
                      : "Search for medicines (e.g., Paracetamol, Crocin)..."
                  }
                  value={searchValue}
                  onChange={e => {
                    setSearchValue(e.target.value);
                    debounceSearch(e.target.value, selectedType);
                  }}
                  onFocus={() => {
                    if (searchResults.length > 0) setShowDropdown(true);
                  }}
                  className="h-14 pl-12 border-2 border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-xl text-lg"
                  autoComplete="off"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                {searchLoading && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
                  </div>
                )}
              </div>

              {showDropdown && searchResults.length > 0 && (
                <div className="absolute z-10 top-full left-0 w-full mt-2 border-2 border-gray-200 rounded-xl bg-white shadow-xl max-h-64 overflow-y-auto">
                  {searchResults.map((item) => (
                    <div
                      key={item._id}
                      className="px-6 py-4 hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-all duration-200"
                      onClick={() => {
                        setValue("productId", item._id, { shouldValidate: true });
                        setSearchValue(item.name || item.testName || "");
                        setShowDropdown(false);
                      }}
                    >
                      <div className="font-semibold text-gray-800 text-lg">
                        {item.name || item.testName}
                      </div>
                      {/* {item.description && (
                        <div className="text-sm text-gray-600 mt-1">
                          {item.description}
                        </div>
                      )} */}
                    </div>
                  ))}
                </div>
              )}
              {errors?.productId?.message && (
                <p className="text-red-500 text-sm font-medium flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.productId.message}
                </p>
              )}
            </div>

            {/* Title and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-orange-600 font-bold">T</span>
                  </div>
                  Banner Title
                </Label>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter attractive banner title"
                      className="h-12 border-2 border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl text-lg"
                    />
                  )}
                />
                {errors?.title?.message && (
                  <p className="text-red-500 text-sm font-medium flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-red-600 font-bold">#</span>
                  </div>
                  Priority
                </Label>
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      placeholder="1"
                      className="h-12 border-2 border-gray-200 focus:border-red-500 focus:ring-red-500 rounded-xl text-lg"
                    />
                  )}
                />
                {errors?.priority?.message && (
                  <p className="text-red-500 text-sm font-medium flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.priority.message}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <Label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <span className="text-indigo-600 font-bold">D</span>
                </div>
                Description
              </Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    placeholder="Write compelling description for your banner..."
                    className="w-full h-24 border-2 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl text-lg p-4 resize-none"
                  />
                )}
              />
              {errors?.description?.message && (
                <p className="text-red-500 text-sm font-medium flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Date Range - Enhanced */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-teal-600" />
                  </div>
                  Start Date
                </Label>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value ? new Date(field.value) : null}
                      onChange={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Select start date"
                      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-teal-500 text-lg"
                      minDate={new Date()}
                    />
                  )}
                />
                {errors?.startDate?.message && (
                  <p className="text-red-500 text-sm font-medium flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-teal-600" />
                  </div>
                  End Date
                </Label>
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value ? new Date(field.value) : null}
                      onChange={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Select end date"
                      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-teal-500 text-lg"
                      minDate={new Date()}
                    />
                  )}
                />
                {errors?.endDate?.message && (
                  <p className="text-red-500 text-sm font-medium flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* Status - Enhanced */}
            <div className="space-y-3">
              <Label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-600 font-bold">S</span>
                </div>
                Status
              </Label>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(val) => field.onChange(val === "true")}
                    defaultValue={field.value ? "true" : "false"}
                  >
                    <SelectTrigger className="h-12 bg-white border-2 border-gray-200 focus:border-yellow-500 focus:ring-yellow-500 rounded-xl text-lg">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true" className="text-green-600 font-medium">Active</SelectItem>
                      <SelectItem value="false" className="text-red-600 font-medium">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors?.isActive?.message && (
                <p className="text-red-500 text-sm font-medium flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.isActive.message}
                </p>
              )}
            </div>

            {/* Action Buttons - Enhanced */}
            <div className="pt-8 flex gap-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1 border-2 border-gray-300 hover:bg-gray-50 rounded-xl text-lg font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl text-lg font-semibold"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creating Banner...
                  </div>
                ) : (
                  "Create Banner"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
