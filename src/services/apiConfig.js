/**
 * Generates an Axios configuration object with optional authentication and content-type handling.
 *
 * @param {Object} [options] - Configuration options for the request.
 * @param {boolean} [options.includeAuth=false] - Whether to include the Authorization header.
 * @param {string} [options.contentType="application/json"] - The content type for the request.
 * @param {boolean} [options.isFormData=false] - Whether the request contains form data (sets `multipart/form-data`).
 * @param {string} [options.token=null] - A manually provided authentication token (overrides the context token if given).
 * @returns {Object} - The Axios request configuration object with the appropriate headers.
 *
 * @example
 * Basic usage without authentication
 *** axios.get("/api/data", getAxiosConfig());
 *
 * @example
 * Request with authentication from context
 *** axios.get("/api/protected", getAxiosConfig({ includeAuth: true }));
 *
 * @example
 * Request with manually provided token
 *** axios.post("/api/upload", formData, getAxiosConfig({ includeAuth: true, token: "your-manual-token", isFormData: true }));
 */

 const getAxiosConfig = ({
    includeAuth = false,
    contentType = "application/json",
    isFormData = false,
    token = null,
  } = {}) => {
    return includeAuth && token
      ? {
          headers: {
            Authorization: `${token}`, // Ensure proper format
            "Content-Type": isFormData ? "multipart/form-data" : contentType,
          },
        }
      : {
          headers: {
            "Content-Type": isFormData ? "multipart/form-data" : contentType,
          },
        };
  };
  
  export default getAxiosConfig;
  