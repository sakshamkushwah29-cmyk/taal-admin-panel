"use client";

import { Toaster, toast } from "react-hot-toast";

export const showToast = (type, message) => {
  const toastTypes = {
    success: toast.success,
    error: toast.error,
    warning: toast,
    info: toast,
  };
  (toastTypes[type] || toast)(message);
};

const ToastProvider = ({ children }) => {
  return (
    <>
      {children}
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export { ToastProvider };
