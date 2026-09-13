// src/utils/authUtils.js
import axios from "axios";
import {
  getAuthToken,
  handleAuthError,
  removeAuthToken,
} from "../utils/authHelpers";
import { ROUTES } from "../routes/constants";
// import {
//   showNotification,
//   showToast,
// } from "../components/_toasts/notificationUtils";
      
/**
 * Generates the Axios configuration object with the Authorization header.
 *
 * @param {string} contentType - The content type for the request, defaults to "application/json".
 * @returns {Object} - Axios configuration object with the Authorization header.
 */
export function getAuthConfig(contentType = "application/json") {
  const token = getAuthToken();
  return {
    headers: {
      Authorization: `${token}`,
      "Content-Type": contentType,
    },
  };
}

/**
 * Generates the Axios configuration object without the Authorization header.
 *
 * @param {string} contentType - The content type for the request, defaults to "application/json".
 * @returns {Object} - Axios configuration object without the Authorization header.
 */
export function getConfig(contentType = "application/json") {
  return {
    headers: {
      "Content-Type": contentType,
    },
  };
}

/**
 * Handles API and runtime errors gracefully.
 *
 * @param {Object|Error} error - The error object (Axios error or any runtime error).
 * @param {Function} [navigate] - Optional navigate function for redirecting (e.g., React Router).
 * @returns {Object|null} Error response data or null.
 */
export const handleApiError = (error, navigate) => {
  console.error("API Error Details:", error);

  if (axios.isAxiosError(error)) {
    if (error.code === "ERR_NETWORK") {
      // Handle network errors specifically
      showToast("error", "Network Error", 2);
      return;
    }

    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          showToast("error", data?.message || "Bad Request", 2);
          break;
        case 401:
          showToast("error", data?.message || "Unauthorized", 2);
          handleAuthError(data?.message);
          if (navigate) navigate(ROUTES.AUTH.LOGIN);
          removeAuthToken();
          // window.location.href = ROUTES.AUTH.LOGIN;
          break;
        case 403:
          showToast("error", data?.message || "Forbidden", 2);
          break;
        case 404:
          showToast("error", data?.message || "Resource Not Found", 2);
          break;
        case 409:
          showNotification("error", data?.message || "Conflict");
          break;
        case 500:
          showToast("error", data?.message || "Internal Server Error", 2);
          break;
        default:
          showToast(
            "error",
            data?.message || "An unexpected error occurred",
            2
          );
          break;
      }
      return;
    } else if (error.request) {
      // No response was received
      if (!navigator.onLine) {
        // Handle offline or network errors specifically
        showToast("error", "No Internet Connection", 2);
        return;
      } else {
        showToast("error", "No Response from Server", 2);
        return;
      }
    } else {
      // Error in setup or other cases
      showToast(
        "error",
        error.message ||
          "An unexpected error occurred while setting up the request",
        2
      );
      return;
    }
  } else {
    // Handle non-Axios or unexpected errors
    showToast("error", "An unexpected error occurred", 2);
    return;
  }
};
