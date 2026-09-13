// axiosInstance.js
import { showToast } from "@/components/_ui/toast-utils";
import axios from "axios";
 

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // withCredentials: true, // Ensure cookies are sent
  headers: {
    "Content-Type": "application/json", // Default content type
  },
});
  console.log("BASE URL",process.env.NEXT_PUBLIC_API_URL)


// Interceptor for request logging (optional)
axiosInstance.interceptors.request.use((config) => {
  console.log("Making request to:", config.url);
  return config;
});

// Interceptor for response error handling (e.g., token refresh handling)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    console.log("API Error:", error.response);

    // ✅ Handle 401 Unauthorized Error
    if (error.response?.data?.status === 401) {
      console.error("Unauthorized Access:", error.response.data);
      showToast(
        "error",
        error.response?.data?.message || "Session expired. Please login again."
      );
      localStorage.removeItem("authUser");
      window.location.href = "/"; // Ensures full reload
      return Promise.reject(error);
    }

    // if (error.response?.status === 401 && !originalRequest._retry) {
    //   originalRequest._retry = true;
    //   try {
    //     const refreshResponse = await axios.post(
    //       `${
    //         process.env.NEXT_PUBLIC_API_URL || "http://localhost:4002/api/v1"
    //       }/auth/refresh`,
    //       {},
    //       { withCredentials: true }
    //     );
    //     const newToken = refreshResponse.data.token;
    //     localStorage.setItem("token", newToken); // Store the new token
    //     return axiosInstance(originalRequest); // Retry the original request
    //   } catch (refreshError) {
    //     console.error("Token refresh failed", refreshError);
    //     localStorage.removeItem("token"); // Remove token if refresh fails
    //     return Promise.reject(refreshError);
    //   }
    // }

    return Promise.reject(error);
  }
);  

export default axiosInstance;
