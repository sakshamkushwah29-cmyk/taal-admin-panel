"use client";

import { useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useAuthUser } from "@/contexts/AuthContext";

export default function useAxios() {
  const { authUser } = useAuthUser(); // Get token from AuthContext
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Make API requests with better flexibility.
   *
   * @param {object} options - Request options
   * @param {string} options.method - HTTP method (GET, POST, PUT, DELETE, etc.)
   * @param {string} options.url - API endpoint
   * @param {object|FormData} [options.payload] - Request payload (optional)
   * @param {boolean} [options.authRequired=false] - Whether to include the token
   * @param {object} [options.headers={}] - Custom headers (optional)
   * @param {object} [options.params={}] - Query parameters (optional)
   *
   * @returns {Promise<{ data: any, error: string | null }>} - API response data or error
   */
  const request = async ({
    method,
    url,
    payload = null,
    authRequired = false,
    headers = {},
    params = {}, // ✅ Added params for GET requests
  }) => {
    setLoading(true);
    setError(null);

    try {
      let requestHeaders = { ...headers };

      // Handle JSON vs FormData dynamically
      let requestData = payload;
      if (payload instanceof FormData) {
        delete requestHeaders["Content-Type"]; // ✅ Let the browser set Content-Type
      } else if (typeof payload === "object" && payload !== null) {
        requestHeaders["Content-Type"] = "application/json"; // ✅ Set Content-Type for JSON
      }

      // Attach Authorization token if required
      if (authRequired && authUser?.token) {
        requestHeaders.Authorization = `Bearer ${authUser.token}`;
      }

      // ✅ Handle GET requests correctly (Axios doesn't allow `data` in GET)
      const axiosConfig = {
        method,
        url,
        headers: requestHeaders,
        ...(method === "GET" || method === "DELETE"
          ? { params }
          : { data: requestData }),
      };

      const response = await axiosInstance(axiosConfig);

      setData(response.data);
      return { data: response.data, error: null };
    } catch (error) {
      console.log("API request error:", error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      setError(errorMessage);
      return { data: error.response?.data || null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { request, loading, data, error };
}
