import axios from "axios";
// import Cookies from 'js-cookie';
import {
  PUBLISHABLE_API_KEY,
  REACT_NATIVE_PUBLIC_DEV_URL,
  REGIOD_ID,
} from "../env";
import { store } from "../store";
export const baseURL = REACT_NATIVE_PUBLIC_DEV_URL;

export const instance = axios.create({
  baseURL: baseURL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const makeRequest = async (type, path, body = null, options = {}) => {
  console.log("optionsare pojerpoivj", options?.headers);

  // Initialize headers object
  const headers = {
    ...options.headers, // Merge any headers passed in options
  };

  try {


    // Create the config object
    const config = {
      timeout: 30000,
      headers,
      credentials: "include",
      ...options,
    };

    console.log('🚀 Complete Request Details:', {
      method: type.toUpperCase(),
      url: `${baseURL}${path}`,
      headers: config.headers,
      body: body,
      config: {
        timeout: config.timeout,
        credentials: config.credentials,
        ...config,
      },
    });

    let response;

    // Perform the request based on the type
    switch (type.toUpperCase()) {
      case "GET":
        response = await instance.get(path, config);
        break;
      case "POST":
        if (body === null || body === undefined) {
          response = await instance.post(path, {}, config); // Empty body
        } else {
          response = await instance.post(path, body, config); // Regular body
        }
        break;
      case "PUT":
        response = await instance.put(path, body, config);
        break;
      case "PATCH":
        response = await instance.patch(path, body, config);
        break;
      case "DELETE":
        response = await instance.delete(path, config);
        break;
      default:
        throw new Error("Unsupported request type");
    }

    return response;
  } catch (error) {
    console.error("Error making request:", error);

    // Handle specific errors
    if (error.response?.status === 401) {
      // Handle unauthorized error, such as refreshing tokens or redirecting
      // ToastNotification('error', 'Session expired. Please login again');
    } else if (error.code === "ECONNABORTED") {
      // Handle timeout
      // ToastNotification('error', 'Request timed out');
    }

    throw error; // Re-throw error after logging/handling
  }
};
// Optional: Request interceptor for adding authentication or other common headers
instance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.user.token;

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    config.headers["x-publishable-api-key"] = PUBLISHABLE_API_KEY;
    config.headers["region_id"] = REGIOD_ID;


    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Response interceptor for handling global responses or errors
instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.log("error from instance", error)
    if (error.response?.status === 401) {
      // Handle 401 errors, e.g., redirect or clear local storage
      // window.location.reload(true);
      // window.location.href = '/';
      // window.localStorage.clear();
    }
    // Extract and return the error message
    const errorMessage = error.response?.data?.message || "An error occurred.";
    return Promise.reject({ code: errorMessage });
  }
);
