import axios from "axios";


const httpInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

/**
 * Makes an HTTP request using Axios with optional caching strategies.
 *
 * @param {string} method - HTTP method ('GET', 'POST', 'PUT', etc.).
 * @param {string} endpoint - API endpoint.
 * @param {Object} payload - Request body or query params.
 * @param {Object} config - Additional Axios config.
 * @param {Object} options - Next.js fetch options (e.g., cache, revalidate).
 * @returns {Promise} Axios response.
 */

export async function makeRequest(
  method,
  endpoint,
  payload = {},
  config = {},
  options = {}
) {
  try {
    const requestMethod = method.toLowerCase();
    const axiosOptions = {
      ...config,
      ...(requestMethod === "get" || requestMethod === "delete"
        ? { params: payload } // GET/DELETE: payload goes as query params
        : { data: payload }), // POST/PUT: payload goes in the request body
    };

    // If running on the server (Server Components), apply caching options
    if (typeof window === "undefined") {
      axiosOptions.next = options;
    }

    return await httpInstance({
      method: requestMethod,
      url: endpoint,
      ...axiosOptions,
    });
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
}

export default makeRequest;
