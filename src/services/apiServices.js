// src/services/apiService.js

import makeRequest from "./apiRequest";

const loginUser = async (payload = {}, config = {}) => {
  try {
    const response = await makeRequest(
      "POST",
      "/admin/login-admin",
      payload,
      config
    );

    if (response.data.status === 200) {
    }
    return response.data;
  } catch (error) {
    console.error(error);
  }
};



export const controller = {
  auth: {
    loginUser,
    // Add more login methods as needed
  },
  config: {},
  // Add more controllers as needed
};
