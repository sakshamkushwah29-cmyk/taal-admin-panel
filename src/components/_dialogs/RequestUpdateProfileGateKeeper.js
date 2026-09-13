import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import useAxios from "@/hooks/useAxios";
import { showToast } from "@/components/_ui/toast-utils";
import FileUploader from "@/components/common/FileUploader";
import Image from "next/image";
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { debounce } from "lodash";
import { useForm, Controller } from "react-hook-form";

const center = { lat: 22.7196, lng: 75.8577 }; // Indore default

export default function RequestUpdateProfileGateKeeper({ open, setOpen, profileData, role }) {
  // Initial state refs for reset
  const initialFormRef = useRef({
    centerName: profileData?.centerName || "",
    ownerName: profileData?.ownerName || "",
    email: profileData?.email || "",
    phone: profileData?.phone || "",
    address: profileData?.address || "",
    pathologyCoordinates: {
      lat: profileData?.pathologyCoordinates?.lat || center.lat,
      long: profileData?.pathologyCoordinates?.long || center.lng,
    },
    avatar: profileData?.avatar || "",
  });
  const [form, setForm] = useState({ ...initialFormRef.current });
  const [loading, setLoading] = useState(false);
  const { request } = useAxios();
  const { request: searchAddress } = useAxios();
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState(-1);
  const suggestionsRef = useRef();
  const addressInputRef = useRef();
  // Add a state for uploadedAvatar (preview only)
  const [uploadedAvatar, setUploadedAvatar] = useState(null);
  const uploadedAvatarRef = useRef(null);

  // Close suggestions on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        addressInputRef.current &&
        !addressInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
        setHighlightedIdx(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced address search
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (!query || !query.trim()) {
        setAddressSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      setAddressLoading(true);
      const { data, error } = await searchAddress({
        method: "POST",
        url: "/user/search-autocomplete-address",
        payload: { query },
        authRequired: true,
      });
      setAddressLoading(false);
      if (!error && data?.data) {
        setAddressSuggestions(data.data);
        setShowSuggestions(true);
      } else {
        setAddressSuggestions([]);
        setShowSuggestions(false);
      }
    }, 400),
    []
  );

  // Google Maps loader
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY_FOR_MAP,
  });

  // Marker state
  const [marker, setMarker] = useState({
    lat: form.pathologyCoordinates.lat,
    lng: form.pathologyCoordinates.long,
  });

  // Add zod schema for validation
  const profileSchema = z.object({
    centerName: z.string({ required_error: "Center name is required" }).min(2, "Center name is required"),
    ownerName: z.string({ required_error: "Owner name is required" }).min(2, "Owner name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .regex(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email address"
      ),
    phone: z.string({ required_error: "Phone number is required" }).min(10, "Phone number must be at least 10 digits"),
    address: z.string({ required_error: "Address is required" }).min(5, "Address is required"),
  });

  // Add react-hook-form setup
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      centerName: form.centerName,
      ownerName: form.ownerName,
      email: form.email,
      phone: form.phone,
      address: form.address,
    },
  });

  // Sync form, marker, and image with latest profileData when dialog opens
  useEffect(() => {
    if (open && profileData) {
      const addressString = profileData?.pathologyDetails?.address || "";
      const newForm = {
        centerName: profileData?.pathologyDetails?.centerName || "",
        ownerName: profileData?.name || "",
        email: profileData?.pathologyDetails?.email || "",
        phone: profileData?.pathologyDetails?.phoneNumber || "",
        address: addressString,
        pathologyCoordinates: {
          lat: profileData?.pathologyCoordinates?.lat || center.lat,
          long: profileData?.pathologyCoordinates?.long || center.lng,
        },
        avatar: profileData?.avatar || "",
      };
      setForm(newForm);
      // If address is present, geocode and set marker
      if (addressString) {
        (async () => {
          const coords = await geocodeAddress(addressString);
          if (coords) {
            setMarker(coords);
            setForm((prev) => ({ ...prev, pathologyCoordinates: { lat: coords.lat, long: coords.lng } }));
          } else {
            setMarker({
              lat: newForm.pathologyCoordinates.lat,
              lng: newForm.pathologyCoordinates.long,
            });
          }
        })();
      } else {
        setMarker({
          lat: newForm.pathologyCoordinates.lat,
          lng: newForm.pathologyCoordinates.long,
        });
      }
      // Also update the initialFormRef for reset
      initialFormRef.current = newForm;
      setUploadedAvatar(null);
      uploadedAvatarRef.current = null;
      // Sync react-hook-form values
      reset({
        centerName: newForm.centerName,
        ownerName: newForm.ownerName,
        email: newForm.email,
        phone: newForm.phone,
        address: addressString,
      });
    }
  }, [open, profileData]);

  // Geocode address to coordinates
  async function geocodeAddress(address) {
    const addressString = address;
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY_FOR_MAP;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(addressString)}&key=${apiKey}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.status === 'OK' && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
      }
    } catch (err) {
      // ignore
    }
    return null;
  }

  // Handle address input change (search)
  const handleAddressInputChange = (e) => {
    const { value } = e.target;
    handleFormChange("address", value);
    debouncedSearch(value);
    setShowSuggestions(true);
    setHighlightedIdx(-1);
  };

  // Handle suggestion select
  const handleSuggestionSelect = async (suggestion) => {
    const { data, error } = await request({
      method: "GET",
      url: `/user/get-details-using-place-id?placeId=${suggestion.place_id}`,
      authRequired: true,
    });
    if (!error && data?.data) {
      const coords = { lat: data.data.lat, lng: data.data.long };
      setMarker(coords);
      setForm((prev) => ({
        ...prev,
        pathologyCoordinates: { lat: coords.lat, long: coords.lng },
        address: data.data.formatted_address || suggestion.description
      }));
      setValue("address", data.data.formatted_address || suggestion.description, { shouldValidate: true });
    } else {
      setForm((prev) => ({ ...prev, address: suggestion.description }));
      setValue("address", suggestion.description, { shouldValidate: true });
    }
    setShowSuggestions(false);
    setHighlightedIdx(-1);
  };

  // Keyboard navigation for suggestions
  const handleAddressInputKeyDown = (e) => {
    if (!showSuggestions || addressSuggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIdx((prev) => (prev + 1) % addressSuggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIdx((prev) => (prev - 1 + addressSuggestions.length) % addressSuggestions.length);
    } else if (e.key === "Enter") {
      if (highlightedIdx >= 0 && highlightedIdx < addressSuggestions.length) {
        e.preventDefault();
        handleSuggestionSelect(addressSuggestions[highlightedIdx]);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setHighlightedIdx(-1);
    }
  };

  // Reverse geocode when marker is moved
  const handleMapClick = async (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarker({ lat, lng });
    setForm((prev) => ({
      ...prev,
      pathologyCoordinates: { lat, long: lng },
    }));
    // Reverse geocode to update address input
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY_FOR_MAP;
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.status === "OK" && data.results.length > 0) {
        setForm((prev) => ({ ...prev, address: data.results[0].formatted_address }));
        setValue("address", data.results[0].formatted_address, { shouldValidate: true });
      }
    } catch {}
  };

  // Update local form state when react-hook-form changes
  const handleFormChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setValue(name, value, { shouldValidate: true });
  };

  // Update handleChange to use react-hook-form
  const handleChange = (e) => {
    const { name, value } = e.target;
    handleFormChange(name, value);
  };

  // Update handleSubmit to use react-hook-form
  const onSubmit = async (data) => {
    setLoading(true);
    const payload = {
      centerName: data.centerName,
      ownerName: data.ownerName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      pathologyCoordinates: {
        lat: form.pathologyCoordinates.lat,
        long: form.pathologyCoordinates.long,
      },
      avatar: uploadedAvatarRef.current || form.avatar,
    };
    const { data: resData, error } = await request({
      method: "PUT",
      url: "/pathology/request-update-profile",
      payload,
      authRequired: true,
    });
    setLoading(false);
    handleDialogOpenChange(false); // Use the dialog close handler
    if (!error && resData?.status === 200) {
      showToast("success", resData.message || "Request submitted successfully");
      setUploadedAvatar(null);
      uploadedAvatarRef.current = null;
      setForm({ ...initialFormRef.current });
      setMarker({
        lat: initialFormRef.current.pathologyCoordinates.lat,
        lng: initialFormRef.current.pathologyCoordinates.long,
      });
      reset();
    } else {
      showToast("error", error || resData?.message || "Failed to submit request");
    }
  };

  // Reset all fields and marker when dialog closes (unless submitted)
  const handleDialogOpenChange = (val) => {
    if (!val) {
      setForm({ ...initialFormRef.current });
      setMarker({
        lat: initialFormRef.current.pathologyCoordinates.lat,
        lng: initialFormRef.current.pathologyCoordinates.long,
      });
      setUploadedAvatar(null);
      uploadedAvatarRef.current = null;
      reset(); // Reset react-hook-form
    }
    setOpen(val);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Request Pathology Profile Update</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          {/* Profile Image Preview and Uploader */}
          <div className="flex flex-col items-center gap-4 mb-4">
            <div className="relative group rounded-full overflow-hidden w-28 h-28 max-w-22 max-h-22 shadow-xl border-4 border-gray-300 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300">
              {uploadedAvatar ? (
                <Image
                  src={uploadedAvatar}
                  alt="Profile Preview"
                  fill
                  className="object-cover"
                />
              ) : form.avatar ? (
                <Image
                  src={form.avatar}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 text-lg font-semibold">
                  No Image
                </div>
              )}
            </div>
            <FileUploader
              url="/admin/upload-image"
              maxFiles={1}
              multiple={false}
              className="w-full"
              onSuccess={(data) => {
                const imageUrl = data?.data?.imageUrl;
                if (imageUrl) {
                  setUploadedAvatar(imageUrl);
                  uploadedAvatarRef.current = imageUrl;
                } else {
                  showToast("error", "Failed to upload image");
                }
              }}
            />
            {uploadedAvatar && (
              <span className="text-xs text-blue-500 mt-1 block text-center">Preview (not saved)</span>
            )}
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="profile-update-form-pathology">
            <div className="space-y-1">
              <Controller
                name="centerName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Pathology Center Name"
                    placeholder="Enter center name"
                  />
                )}
              />
              {errors.centerName && (
                <p className="text-red-500 text-xs mt-1">{errors.centerName.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Controller
                name="ownerName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Owner Name"
                    placeholder="Enter owner name"
                  />
                )}
              />
              {errors.ownerName && (
                <p className="text-red-500 text-xs mt-1">{errors.ownerName.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Email"
                    type="email"
                    placeholder="Enter email"
                  />
                )}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Phone"
                    placeholder="Enter phone"
                  />
                )}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
              )}
            </div>
            <div className="relative space-y-1">
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Address"
                    onChange={(e) => handleAddressInputChange(e)}
                    onFocus={() => form.address && addressSuggestions.length > 0 && setShowSuggestions(true)}
                    onKeyDown={handleAddressInputKeyDown}
                    ref={addressInputRef}
                    placeholder="Enter address"
                  />
                )}
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
              )}
              {showSuggestions && addressSuggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute z-10 left-0 right-0 bg-white border rounded shadow max-h-60 overflow-y-auto mt-1"
                >
                  {addressSuggestions.map((s, idx) => (
                    <div
                      key={s.place_id}
                      className={`px-4 py-2 cursor-pointer text-sm ${highlightedIdx === idx ? "bg-gray-200" : "hover:bg-gray-100"}`}
                      onClick={() => handleSuggestionSelect(s)}
                      onMouseEnter={() => setHighlightedIdx(idx)}
                    >
                      {s.description}
                    </div>
                  ))}
                </div>
              )}
              {addressLoading && (
                <div className="absolute right-2 top-2 text-xs text-gray-400">Searching...</div>
              )}
            </div>
            {/* Google Maps Pin Point Picker */}
            <div className="mb-4">
              <label className="block mb-2 font-medium text-gray-700">Select Pathology Location (Pin Point on Map)</label>
              {isLoaded ? (
                <div style={{ width: '100%', height: 300 }}>
                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={marker}
                    zoom={14}
                    onClick={handleMapClick}
                  >
                    <Marker position={marker} />
                  </GoogleMap>
                </div>
              ) : (
                <div className="text-center text-gray-500">Loading map...</div>
              )}
              <div className="mt-2 text-xs text-gray-500">
                Selected: Lat {marker.lat.toFixed(6)}, Lng {marker.lng.toFixed(6)}
              </div>
            </div>
          </form>
        </div>
        <DialogFooter>
          <Button variant="outline" type="button" onClick={() => handleDialogOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="profile-update-form-pathology" disabled={loading}>
            {loading ? "Submitting..." : "Submit Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 