"use client";

import useFileUpload from "@/hooks/useFileUpload";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import Image from "next/image";
import { showToast } from "@/components/_ui/toast-utils";

export default function FileUploader({
  url = "/upload-endpoint",
  authRequired = true,
  allowedTypes = {
    "image/png": [],
    "image/jpeg": [],
    "application/pdf": [],
    "text/csv": [],
  },
  fieldName = "image",
  maxFileSize = 5, // MB
  maxFiles = 5,
  multiple = true,
  onSuccess, // Callback function on successful upload
  onError, // Callback function on upload error
}) {
  const {
    uploadFile,
    loading,
    progress,
    filePreviews,
    removeFile,
    clearFiles,
    setSelectedFiles,
    selectedFiles,
    validateFiles,
  } = useFileUpload({
    url,
    authRequired,
    allowedTypes: Object.keys(allowedTypes), // Pass only keys as types
    fieldName,
    maxFileSize,
    maxFiles,
    multiple,
  });

  const [previewImage, setPreviewImage] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: allowedTypes, // Fixed accept format
    maxFiles: maxFiles,
    maxSize: maxFileSize * 1024 * 1024,
    multiple,
    onDrop: (acceptedFiles, rejectedFiles) => {
      let errorMessages = [];

      if (rejectedFiles.length > 0) {
        return showToast(
          "error",
          `You can only upload up to ${maxFiles} files. You selected ${rejectedFiles.length}.`
        );
      }

      if (acceptedFiles.length === 0)
        return showToast("error", "No files selected.");

      const totalFiles = selectedFiles.length + acceptedFiles.length;
      if (totalFiles > maxFiles) {
        errorMessages.push(
          `You can only upload up to ${maxFiles} files. You selected ${totalFiles}.`
        );
        acceptedFiles = acceptedFiles.slice(0, maxFiles - selectedFiles.length);
      }

      rejectedFiles.forEach(({ file, errors }) => {
        errors.forEach((error) => {
          if (error.code === "file-too-large") {
            errorMessages.push(`${file.name} exceeds ${maxFileSize}MB limit.`);
          } else if (error.code === "file-invalid-type") {
            errorMessages.push(`${file.name} is not a supported format.`);
          }
        });
      });

      // Show all errors in ONE toast
      if (errorMessages.length > 0) {
        showToast("error", errorMessages.join("\n"));
        return;
      }

      // Validate accepted files before adding
      if (validateFiles(acceptedFiles)) {
        setSelectedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
      }
    },
  });

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      showToast("error", "No files selected.");
      return;
    }

    const { data, error } = await uploadFile();

    if (error) {
      if (onError) onError(error);
    } else {

      console.log(data,)
      if (onSuccess) onSuccess(data);
    }
  };

  return (
    <div className="p-4">
<div className="w-full max-w-xs mx-auto space-y-2">
<div
    {...getRootProps()}
    className="w-full h-10 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 text-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 cursor-pointer"
  >
    <input {...getInputProps()} />
    <p className="text-sm">Drag & drop or click to upload</p>
    {/* <p className="text-xs text-gray-400 mt-1">PNG, JPG, PDF, CSV (Max {maxFileSize}MB)</p> */}
  </div>

  {filePreviews.length > 0 && (
    <div className="grid grid-cols-2 gap-2 pt-2">
      {filePreviews.map(({ url, type, name }, index) => (
        <div key={index} className="relative group">
          {type === "image" ? (
            <Image
              src={url}
              width={80}
              height={80}
              alt={name}
              className="rounded-lg object-cover border shadow hover:opacity-90 transition cursor-pointer"
              onClick={() => setPreviewImage(url)}
            />
          ) : (
            <div className="h-20 w-20 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg text-xs text-gray-700 dark:text-gray-200 shadow">
              {name.split(".").pop()}
            </div>
          )}
          <button
            onClick={() => removeFile(index)}
            className="absolute top-0 right-0 bg-red-500  hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition  cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )}

  <div className="flex items-center justify-center gap-3 mt-2">
    <Button
      onClick={handleUpload}
      disabled={loading || selectedFiles.length === 0}
      className="text-sm px-4 cursor-pointer"
    >
      {loading ? "Uploading..." : "Upload"}
    </Button>
    {selectedFiles.length > 0 && (
      <Button
        onClick={clearFiles}
        variant="ghost"
        className="text-sm px-4 text-gray-600 dark:text-gray-300 cursor-pointer"
      >
        Clear
      </Button>
    )}
  </div>

  {progress > 0 && (
    <p className="text-xs text-gray-400 text-center mt-1">Progress: {progress}%</p>
  )}
</div>

      {previewImage && (
        <Dialog
          open={!!previewImage}
          onOpenChange={() => setPreviewImage(null)}
        >
          <DialogContent>
            <DialogTitle>Preview</DialogTitle>
            <DialogDescription>Preview of the file</DialogDescription>
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-auto rounded-lg object-contain"
            />
            <DialogClose />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
